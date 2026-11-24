import test from 'node:test';
import assert from 'node:assert/strict';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';
import { fileURLToPath } from 'node:url';
import { PUBLIC_TOOLS } from '../lib/adapter.mjs';
import { VERSION, createUpstream } from '../lib/upstream.mjs';
import { connectedAdapter, fixture } from './helpers.mjs';

test('actual executable initializes over stdio, discovers public tools offline and blocks private calls', async (t) => {
  const transport = new StdioClientTransport({
    command: process.execPath,
    args: [fileURLToPath(new URL('../server.mjs', import.meta.url))],
    env: {}, stderr: 'pipe',
  });
  let stderr = '';
  transport.stderr?.on('data', (chunk) => { stderr += chunk; });
  const client = new Client({ name: 'stdio-smoke', version: '1.0.0' });
  t.after(() => client.close());
  await client.connect(transport);
  assert.equal(client.getServerVersion().version, VERSION);
  assert.deepEqual((await client.listTools()).tools, PUBLIC_TOOLS);
  const result = await client.callTool({ name: 'get_context_pack', arguments: { query: 'PRIVATE_SENTINEL' } });
  assert.equal(result.isError, true);
  assert.equal(JSON.parse(result.content[0].text).error, 'authentication_required');
  assert.doesNotMatch(JSON.stringify(result), /PRIVATE_SENTINEL/);
  assert.equal(stderr, '');
});

test('scoped private discovery preserves cursor, annotations and empty catalogs', async (t) => {
  const mock = await fixture(t, ({ body, reply }) => {
    assert.equal(body.method, 'tools/list');
    reply(body.params?.cursor === 'page2' ? { tools: [] } : {
      tools: [{ name: 'get_context_pack', inputSchema: { type: 'object' }, annotations: { readOnlyHint: true } }],
      nextCursor: 'page2',
    });
  });
  const client = await connectedAdapter(t, createUpstream({ apiKey: 'dayze_k_fixture', url: mock.url }));
  const first = await client.listTools();
  assert.equal(first.nextCursor, 'page2');
  assert.equal(first.tools[0].annotations.readOnlyHint, true);
  assert.deepEqual(await client.listTools({ cursor: first.nextCursor }), { tools: [] });
  assert.ok(mock.requests.every(({ headers }) => headers.authorization === 'Bearer dayze_k_fixture'));
  assert.equal(mock.requests[0].body.method, 'initialize');
  assert.equal(mock.requests.filter(({ body }) => body.method === 'initialize').length, 1);
});

test('public calls forward arguments and return structured results without a credential', async (t) => {
  const mock = await fixture(t, ({ body, req, reply }) => {
    assert.equal(req.headers.authorization, undefined);
    assert.deepEqual(body.params, { name: 'notable_search', arguments: { q: 'fixture person' } });
    reply({ content: [{ type: 'text', text: 'fixture result' }], structuredContent: { matches: [] } });
  });
  const client = await connectedAdapter(t, createUpstream({ url: mock.url }));
  assert.deepEqual(await client.callTool({ name: 'notable_search', arguments: { q: 'fixture person' } }), {
    content: [{ type: 'text', text: 'fixture result' }], structuredContent: { matches: [] },
  });
});

for (const [status, category] of [[401, 'authentication_required'], [403, 'permission_denied'], [402, 'payment_required'], [429, 'rate_limited'], [503, 'upstream_http_error']]) {
  test(`HTTP ${status} remains distinguishable and does not leak upstream errors`, async (t) => {
    const mock = await fixture(t, ({ res }) => { res.writeHead(status).end('PRIVATE_SENTINEL dayze_k_secret'); });
    const client = await connectedAdapter(t, createUpstream({ apiKey: 'dayze_k_fixture', url: mock.url }));
    const result = await client.callTool({ name: 'get_context_pack', arguments: { query: 'PRIVATE_ARGUMENT' } });
    assert.equal(result.isError, true);
    assert.equal(JSON.parse(result.content[0].text).error, category);
    assert.doesNotMatch(JSON.stringify(result), /PRIVATE_SENTINEL|dayze_k_secret|PRIVATE_ARGUMENT/);
    await assert.rejects(client.listTools(), (error) => {
      assert.equal(error.data.error, category);
      assert.doesNotMatch(JSON.stringify(error), /PRIVATE_SENTINEL|dayze_k_secret/);
      return true;
    });
  });
}

test('MCP validation errors are not reported as network failure; tool errors are preserved', async (t) => {
  let calls = 0;
  const mock = await fixture(t, ({ body, res, reply }) => {
    calls++;
    if (calls === 1) {
      res.writeHead(200, { 'Content-Type': 'application/json' }).end(JSON.stringify({ jsonrpc: '2.0', id: body.id, error: { code: -32602, message: 'PRIVATE_SENTINEL', data: { secret: 'PRIVATE_SENTINEL' } } }));
    } else reply({ isError: true, content: [{ type: 'text', text: 'No matching fixture record' }] });
  });
  const client = await connectedAdapter(t, createUpstream({ url: mock.url }));
  const first = await client.callTool({ name: 'notable_search', arguments: {} });
  assert.equal(JSON.parse(first.content[0].text).error, 'upstream_mcp_error');
  assert.doesNotMatch(JSON.stringify(first), /PRIVATE_SENTINEL/);
  const second = await client.callTool({ name: 'notable_search', arguments: { q: 'fixture' } });
  assert.equal(second.content[0].text, 'No matching fixture record');
  assert.equal(second.isError, true);
  assert.equal(calls, 2);
});

test('SSE handles comments, notifications, CRLF and multiline data', async (t) => {
  const mock = await fixture(t, ({ body, res }) => {
    res.writeHead(200, { 'Content-Type': 'text/event-stream' });
    res.end(': heartbeat\r\n\r\nevent: message\r\ndata: {"jsonrpc":"2.0","method":"notifications/message","params":{"level":"info","data":"fixture"}}\r\n\r\nevent: message\r\ndata: {"jsonrpc":"2.0",\r\ndata: "id":' + body.id + ',"result":{"content":[{"type":"text","text":"SSE fixture"}]}}\r\n\r\n');
  });
  const client = await connectedAdapter(t, createUpstream({ url: mock.url }));
  const result = await client.callTool({ name: 'notable_search', arguments: { q: 'fixture' } });
  assert.equal(result.content[0].text, 'SSE fixture');
});

test('a timed-out write is not retried and warns about uncertain completion', async (t) => {
  let calls = 0;
  const mock = await fixture(t, () => { calls++; });
  const client = await connectedAdapter(t, createUpstream({ apiKey: 'dayze_k_fixture', url: mock.url, timeoutMs: 150 }));
  const result = await client.callTool({ name: 'log_event', arguments: { request_id: 'synthetic-request' } });
  assert.equal(JSON.parse(result.content[0].text).error, 'request_timeout');
  assert.match(result.content[0].text, /write may have completed/);
  assert.equal(calls, 1);
});

for (const payload of ['not JSON PRIVATE_SENTINEL', '{"jsonrpc":"2.0","id":9999,"result":{}}']) {
  test('malformed or unmatched responses cannot become successful results', async (t) => {
    const mock = await fixture(t, ({ res }) => { res.writeHead(200, { 'Content-Type': 'application/json' }).end(payload); });
    const client = await connectedAdapter(t, createUpstream({ url: mock.url, timeoutMs: 150 }));
    const result = await client.callTool({ name: 'notable_search', arguments: { q: 'fixture' } });
    assert.equal(result.isError, true);
    assert.doesNotMatch(JSON.stringify(result), /PRIVATE_SENTINEL/);
  });
}

test('redirects never forward credentials to another destination', async (t) => {
  let destinationCalls = 0;
  const destination = await fixture(t, ({ reply }) => { destinationCalls++; reply({ tools: [] }); });
  const origin = await fixture(t, ({ res }) => { res.writeHead(307, { Location: destination.url }).end(); });
  const client = await connectedAdapter(t, createUpstream({ apiKey: 'dayze_k_fixture', url: origin.url }));
  await assert.rejects(client.listTools());
  assert.equal(destinationCalls, 0);
  assert.equal(destination.requests.length, 0);
});

test('invalid key configuration fails without including its value', () => {
  for (const apiKey of ['', 'Bearer PRIVATE_SENTINEL', 'dayze_k_x\r\nX-Other: PRIVATE_SENTINEL']) {
    assert.throws(() => createUpstream({ apiKey }), (error) => !error.message.includes('PRIVATE_SENTINEL'));
  }
});
