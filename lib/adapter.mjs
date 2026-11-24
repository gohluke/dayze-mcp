import { readFileSync } from 'node:fs';
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { CallToolRequestSchema, ListToolsRequestSchema, McpError, ErrorCode } from '@modelcontextprotocol/sdk/types.js';
import { VERSION, describeError } from './upstream.mjs';

export const PUBLIC_TOOLS = JSON.parse(readFileSync(new URL('./public-tools.json', import.meta.url)));
const publicNames = new Set(PUBLIC_TOOLS.map(({ name }) => name));

export function createAdapter({ upstream }) {
  const server = new Server({ name: 'dayze-life-context', version: VERSION }, { capabilities: { tools: {} } });
  server.setRequestHandler(ListToolsRequestSchema, async (request) => {
    // Public discovery is deterministic and usable offline; tool execution still needs Dayze.
    if (!upstream.authenticated) return { tools: structuredClone(PUBLIC_TOOLS) };
    try {
      return await upstream.listTools(request.params);
    } catch (error) {
      const details = describeError(error);
      throw new McpError(ErrorCode.InternalError, details.message, details);
    }
  });
  server.setRequestHandler(CallToolRequestSchema, async (request, extra) => {
    if (!upstream.authenticated && !publicNames.has(request.params.name)) {
      return errorResult({ error: 'authentication_required', message: 'Private tools require hosted Dayze OAuth or DAYZE_API_KEY. This adapter currently exposes only the public notable-people catalog.' });
    }
    try {
      return await upstream.callTool(request.params, extra.signal);
    } catch (error) {
      return errorResult(describeError(error));
    }
  });
  return server;
}

function errorResult(details) {
  return { isError: true, content: [{ type: 'text', text: JSON.stringify(details) }] };
}
