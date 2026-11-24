import { createServer } from 'node:http';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { InMemoryTransport } from '@modelcontextprotocol/sdk/inMemory.js';
import { createAdapter } from '../lib/adapter.mjs';

export async function fixture(t, handle) {
  const requests = [];
  const http = createServer(async (req, res) => {
    if (req.method === 'GET') { res.writeHead(405).end(); return; }
    const chunks = [];
    for await (const chunk of req) chunks.push(chunk);
    const body = JSON.parse(Buffer.concat(chunks).toString());
    requests.push({ body, headers: req.headers });
    if (body.method === 'notifications/initialized' || body.method === 'notifications/cancelled') {
      res.writeHead(202).end(); return;
    }
    const reply = (result) => {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ jsonrpc: '2.0', id: body.id, result }));
    };
    if (body.method === 'initialize') {
      reply({ protocolVersion: '2025-06-18', capabilities: { tools: {} }, serverInfo: { name: 'fixture', version: '1.0.0' } });
      return;
    }
    await handle({ req, res, body, reply });
  });
  await new Promise((resolve) => http.listen(0, '127.0.0.1', resolve));
  t.after(() => new Promise((resolve) => { http.close(resolve); http.closeAllConnections(); }));
  return { url: `http://127.0.0.1:${http.address().port}/mcp`, requests };
}

export async function connectedAdapter(t, upstream) {
  const server = createAdapter({ upstream });
  const client = new Client({ name: 'fixture-client', version: '1.0.0' });
  const [local, remote] = InMemoryTransport.createLinkedPair();
  t.after(async () => { await client.close(); await server.close(); await upstream.close?.(); });
  await server.connect(remote);
  await client.connect(local);
  return client;
}
