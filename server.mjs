#!/usr/bin/env node
/**
 * Stdio MCP adapter for Glama / local install.
 * Production clients should use https://dayze.com/api/mcp directly.
 * This process speaks MCP over stdio and proxies JSON-RPC to the hosted endpoint
 * (URL lives in code so Glama CMD validation stays happy).
 */
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';

const UPSTREAM = 'https://dayze.com/api/mcp';

async function upstream(method, params = {}) {
  const res = await fetch(UPSTREAM, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json, text/event-stream',
    },
    body: JSON.stringify({
      jsonrpc: '2.0',
      id: Date.now(),
      method,
      params,
    }),
  });
  const text = await res.text();
  let payload;
  try {
    payload = JSON.parse(text);
  } catch {
    // Streamable HTTP may return SSE; take the last data: JSON line.
    const dataLine = text
      .split('\n')
      .map((l) => l.trim())
      .filter((l) => l.startsWith('data:'))
      .pop();
    if (!dataLine) throw new Error(`Upstream non-JSON (${res.status}): ${text.slice(0, 200)}`);
    payload = JSON.parse(dataLine.slice(5).trim());
  }
  if (payload.error) {
    const err = new Error(payload.error.message || 'Upstream MCP error');
    err.code = payload.error.code;
    throw err;
  }
  return payload.result;
}

const server = new Server(
  {
    name: 'dayze-life-context',
    version: '1.6.1',
  },
  {
    capabilities: {
      tools: {},
    },
  },
);

server.setRequestHandler(ListToolsRequestSchema, async () => {
  const result = await upstream('tools/list');
  return { tools: result?.tools ?? [] };
});

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const result = await upstream('tools/call', {
    name: request.params.name,
    arguments: request.params.arguments ?? {},
  });
  return result;
});

const transport = new StdioServerTransport();
await server.connect(transport);
