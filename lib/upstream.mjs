import { readFileSync } from 'node:fs';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StreamableHTTPClientTransport, StreamableHTTPError } from '@modelcontextprotocol/sdk/client/streamableHttp.js';
import { UnauthorizedError } from '@modelcontextprotocol/sdk/client/auth.js';
import { ErrorCode, McpError } from '@modelcontextprotocol/sdk/types.js';

export const VERSION = JSON.parse(readFileSync(new URL('../package.json', import.meta.url))).version;
export const ENDPOINT = 'https://dayze.com/api/mcp';

// Injectable transport inputs are for deterministic tests. The executable uses the canonical URL.
export function createUpstream({ apiKey, url = ENDPOINT, timeoutMs = 30000, fetchImpl = fetch } = {}) {
  if (apiKey !== undefined && !/^dayze_k_[A-Za-z0-9_-]+$/.test(apiKey)) {
    throw new Error('Invalid DAYZE_API_KEY configuration');
  }
  let client;
  let connecting;
  const options = { timeout: timeoutMs, maxTotalTimeout: timeoutMs };
  async function connect() {
    if (!connecting) {
      client = new Client({ name: 'dayze-stdio-adapter', version: VERSION });
      const transport = new StreamableHTTPClientTransport(new URL(url), {
        requestInit: {
          redirect: 'error',
          headers: apiKey ? { Authorization: `Bearer ${apiKey}` } : {},
        },
        fetch: (input, init = {}) => fetchImpl(input, {
          ...init,
          signal: AbortSignal.any([...(init.signal ? [init.signal] : []), AbortSignal.timeout(timeoutMs)]),
        }),
        reconnectionOptions: { maxRetries: 0, initialReconnectionDelay: 1000, maxReconnectionDelay: 1000, reconnectionDelayGrowFactor: 1 },
      });
      connecting = client.connect(transport, options).then(() => client).catch(async (error) => {
        await client.close().catch(() => {});
        connecting = undefined;
        throw error;
      });
    }
    return connecting;
  }
  return {
    authenticated: Boolean(apiKey),
    async listTools(params) { return (await connect()).listTools(params, options); },
    async callTool(params, signal) {
      // Never automatically retry a call: it may have committed a write.
      return (await connect()).callTool(params, undefined, { ...options, signal });
    },
    async close() { await client?.close(); },
  };
}

// Raw upstream messages/data may echo private inputs. Only relay classified failures.
export function describeError(error) {
  const code = error instanceof StreamableHTTPError || error instanceof McpError ? error.code : undefined;
  if (error instanceof UnauthorizedError || code === 401) {
    return { error: 'authentication_required', message: 'Sign in through hosted Dayze OAuth, or configure a valid DAYZE_API_KEY for this local adapter.' };
  }
  if (code === 403) return { error: 'permission_denied', message: 'This Dayze connection does not have permission. Review its granted scopes in Dayze.' };
  if (code === 402) return { error: 'payment_required', message: 'The public tool requires payment or an eligible Dayze account. This adapter does not make payments.' };
  if (code === 429) return { error: 'rate_limited', message: 'Dayze rate limit reached. Retry later.' };
  if (code === ErrorCode.RequestTimeout || error?.name === 'TimeoutError' || error?.name === 'AbortError') {
    return { error: 'request_timeout', message: 'Dayze did not finish in time, or the request was cancelled. A write may have completed; check Dayze before retrying.' };
  }
  if (error instanceof McpError) return { error: 'upstream_mcp_error', code, message: 'Dayze rejected the MCP request. Check the advertised tool schema and your connection permissions.' };
  if (error instanceof StreamableHTTPError) return { error: 'upstream_http_error', status: code, message: 'Dayze returned an unexpected HTTP response. Retry later.' };
  return { error: 'upstream_unavailable', message: 'Could not complete the Dayze connection. Check network access or use hosted Dayze OAuth.' };
}
