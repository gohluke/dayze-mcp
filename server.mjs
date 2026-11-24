#!/usr/bin/env node
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { createAdapter } from './lib/adapter.mjs';
import { createUpstream } from './lib/upstream.mjs';

try {
  const upstream = createUpstream({ apiKey: process.env.DAYZE_API_KEY });
  const server = createAdapter({ upstream });
  let closing = false;
  const close = async () => {
    if (closing) return;
    closing = true;
    await upstream.close();
    await server.close();
  };
  process.once('SIGINT', close);
  process.once('SIGTERM', close);
  process.stdin.once('end', close);
  await server.connect(new StdioServerTransport());
} catch {
  // stdout is reserved for MCP. Never log raw exceptions or credentials.
  console.error('Dayze MCP could not start. Check DAYZE_API_KEY configuration and the Node.js version.');
  process.exitCode = 1;
}
