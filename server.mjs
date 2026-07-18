#!/usr/bin/env node
/**
 * Stdio MCP adapter for Glama / local install.
 * Production clients should use https://dayze.com/api/mcp directly.
 *
 * Tool schemas are embedded so Glama quality scoring works even when the
 * build sandbox has no outbound network. Live calls still proxy upstream
 * when network is available.
 */
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';

const UPSTREAM = 'https://dayze.com/api/mcp';

/** Snapshot of public + private tool schemas (synced 2026-07-18 from hosted MCP). */
const FALLBACK_TOOLS = [
  {
    name: 'notable_search',
    title: 'Search Notable People',
    description:
      'Search the public Dayze notable-people catalog by name, occupation, or slug. Use when you need to find a person before fetching a pack. Example slug: albert-einstein. ($0.01)',
    inputSchema: {
      type: 'object',
      properties: {
        q: { type: 'string', description: 'Search query (alias: query)' },
        limit: { type: 'number', description: 'Max results 1–20', default: 8 },
      },
      required: ['q'],
      additionalProperties: false,
    },
  },
  {
    name: 'notable_profile',
    title: 'Notable Person Profile',
    description:
      'Full notable-person profile JSON by slug. Use for bio, timeline, and metadata without similar people or life-in-days context. Example slug: taylor-swift. ($0.02)',
    inputSchema: {
      type: 'object',
      properties: {
        slug: { type: 'string', description: 'Person slug, e.g. albert-einstein' },
      },
      required: ['slug'],
      additionalProperties: false,
    },
  },
  {
    name: 'notable_pack',
    title: 'Notable Knowledge Pack',
    description:
      'Knowledge pack: profile + life-in-days + similar people + birthday peers (+ quality / upgrade hint). Timeline events include day_number. Best starting point for agent context. Example slug: albert-einstein. ($0.05)',
    inputSchema: {
      type: 'object',
      properties: {
        slug: { type: 'string', description: 'Person slug, e.g. albert-einstein' },
        similar: { type: 'number', default: 8 },
        peers: { type: 'number', default: 12 },
        date: { type: 'string', description: 'YYYY-MM-DD target date' },
      },
      required: ['slug'],
      additionalProperties: false,
    },
  },
  {
    name: 'notable_pack_premium',
    title: 'Premium Notable Pack',
    description:
      'S-tier guaranteed pack (score≥85, timeline≥8, image, embedding). Errors if below bar. Use when you need high-quality, complete notable context. Example slug: elon-musk. ($0.10)',
    inputSchema: {
      type: 'object',
      properties: {
        slug: { type: 'string', description: 'Person slug, e.g. elon-musk' },
        similar: { type: 'number', default: 12 },
        peers: { type: 'number', default: 20 },
        date: { type: 'string' },
      },
      required: ['slug'],
      additionalProperties: false,
    },
  },
  {
    name: 'get_life_context',
    title: 'Life Context Snapshot',
    description:
      'Get the authenticated user\'s current life context — identity, today\'s events, mood, inner circle, and social edges. Prefer get_context_pack for a full session bootstrap. Requires API key. ($0.15; API key required)',
    inputSchema: { type: 'object', properties: {}, additionalProperties: false },
  },
  {
    name: 'get_context_pack',
    title: 'Life Context Pack',
    description:
      'Life Context Protocol (LCP) reference pack for a Dayze user: identity + who matters (edges) + week calendar + semantic/recent memories. Includes protocol.version. Optional query focuses memories. Requires API key or share token. Spec: https://dayze.com/docs/life-context ($0.20; API key required)',
    inputSchema: {
      type: 'object',
      properties: {
        query: { type: 'string', description: 'Optional focus query for semantic memories' },
      },
      additionalProperties: false,
    },
  },
  {
    name: 'get_life_graph',
    title: 'Life Graph Export',
    description:
      'Life-graph export: people nodes + person_connections edges. Optional event–people links. Requires API key. ($0.25; API key required)',
    inputSchema: {
      type: 'object',
      properties: {
        include_event_links: { type: 'boolean', default: false },
        event_links_limit: { type: 'number', default: 25 },
        max_people: { type: 'number', default: 150 },
      },
      additionalProperties: false,
    },
  },
  {
    name: 'get_person_neighborhood',
    title: 'Person Neighborhood',
    description:
      'Subgraph around one person_id — profile plus all declared connections. Requires API key. ($0.15; API key required)',
    inputSchema: {
      type: 'object',
      properties: {
        person_id: { type: 'string', description: 'UUID' },
      },
      required: ['person_id'],
      additionalProperties: false,
    },
  },
  {
    name: 'get_events',
    title: 'Calendar Events',
    description:
      'User calendar events (range: today|week|month|year|decade). Requires API key. ($0.10; API key required)',
    inputSchema: {
      type: 'object',
      properties: {
        range: {
          type: 'string',
          enum: ['today', 'week', 'month', 'year', 'decade'],
        },
      },
      additionalProperties: false,
    },
  },
  {
    name: 'get_people',
    title: 'User Contacts',
    description:
      'List user CRM people (flat list). Each row includes contact_origin (personal|online|imported). Requires API key. ($0.10; API key required)',
    inputSchema: { type: 'object', properties: {}, additionalProperties: false },
  },
  {
    name: 'get_memories',
    title: 'Agent Memories',
    description:
      'User memories from Dayze Agent. Pass query for semantic retrieval; omit for recent chronological. Requires API key. ($0.10; API key required)',
    inputSchema: {
      type: 'object',
      properties: {
        query: { type: 'string', description: 'Semantic focus (optional)' },
        limit: { type: 'number', description: 'Max rows 1–50, default 20' },
      },
      additionalProperties: false,
    },
  },
  {
    name: 'get_expenses',
    title: 'Expense Summary',
    description:
      'List user expenses / cashflow summary. Requires API key. ($0.10; API key required)',
    inputSchema: { type: 'object', properties: {}, additionalProperties: false },
  },
  {
    name: 'get_trackers',
    title: 'Habit Trackers',
    description:
      'List user trackers / habits / streaks. Requires API key. ($0.10; API key required)',
    inputSchema: { type: 'object', properties: {}, additionalProperties: false },
  },
  {
    name: 'search',
    title: 'Semantic Life Search',
    description:
      'Semantic search across the authenticated user life graph (events, people, memories). Requires API key. ($0.15; API key required)',
    inputSchema: {
      type: 'object',
      properties: {
        query: { type: 'string', description: 'Search query (primary)' },
        q: { type: 'string', description: 'Alias for query' },
        limit: { type: 'number', description: 'Max results 1–50', default: 10 },
      },
      required: ['query'],
      additionalProperties: false,
    },
  },
];

async function upstream(method, params = {}, timeoutMs = 8000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
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
      signal: controller.signal,
    });
    const text = await res.text();
    let payload;
    try {
      payload = JSON.parse(text);
    } catch {
      const dataLine = text
        .split('\n')
        .map((l) => l.trim())
        .filter((l) => l.startsWith('data:'))
        .pop();
      if (!dataLine) {
        throw new Error(`Upstream non-JSON (${res.status}): ${text.slice(0, 200)}`);
      }
      payload = JSON.parse(dataLine.slice(5).trim());
    }
    if (payload.error) {
      const err = new Error(payload.error.message || 'Upstream MCP error');
      err.code = payload.error.code;
      throw err;
    }
    return payload.result;
  } finally {
    clearTimeout(timer);
  }
}

const server = new Server(
  {
    name: 'dayze-life-context',
    version: '1.6.2',
  },
  {
    capabilities: {
      tools: {},
    },
  },
);

server.setRequestHandler(ListToolsRequestSchema, async () => {
  try {
    const result = await upstream('tools/list', {}, 5000);
    if (result?.tools?.length) return { tools: result.tools };
  } catch {
    // Sandbox / offline — schemas below are enough for Glama scoring.
  }
  return { tools: FALLBACK_TOOLS };
});

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  try {
    return await upstream('tools/call', {
      name: request.params.name,
      arguments: request.params.arguments ?? {},
    });
  } catch {
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(
            {
              error: 'upstream_unavailable',
              message:
                'This Glama/stdio adapter could not reach the hosted Dayze MCP. Call https://dayze.com/api/mcp directly (Streamable HTTP), or retry with network access.',
              tool: request.params.name,
              arguments: request.params.arguments ?? {},
            },
            null,
            2,
          ),
        },
      ],
      isError: true,
    };
  }
});

const transport = new StdioServerTransport();
await server.connect(transport);
