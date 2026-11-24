// Run after `docker build --tag dayze-mcp:ci .`. Uses public discovery only.
import assert from 'node:assert/strict';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';
import { PUBLIC_TOOLS } from '../lib/adapter.mjs';
import { VERSION } from '../lib/upstream.mjs';

const client = new Client({ name: 'container-smoke', version: '1.0.0' });
try {
  await client.connect(new StdioClientTransport({
    command: 'docker', args: ['run', '--rm', '-i', '--network=none', 'dayze-mcp:ci'],
  }));
  assert.equal(client.getServerVersion().version, VERSION);
  assert.deepEqual((await client.listTools()).tools, PUBLIC_TOOLS);
  const result = await client.callTool({ name: 'get_context_pack', arguments: {} });
  assert.equal(JSON.parse(result.content[0].text).error, 'authentication_required');
  console.log('Container stdio initialization, offline discovery and private-call guard pass.');
} finally {
  await client.close();
}
