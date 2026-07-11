# Dayze MCP

[![Dayze MCP](https://glama.ai/mcp/servers/gohluke/dayze-mcp/badge)](https://glama.ai/mcp/servers/gohluke/dayze-mcp)

**Hosted people + life-in-days knowledge API for AI agents.**

**Install / try on Smithery:** https://smithery.ai/servers/polaris/dayze

[![smithery badge](https://smithery.ai/badge/@polaris/dayze)](https://smithery.ai/servers/polaris/dayze)

| | |
|---|---|
| Website | https://dayze.com |
| Agents docs | https://dayze.com/docs/agents |
| Streamable HTTP | https://dayze.com/api/mcp |
| REST MCP | https://dayze.com/api/v1/mcp |
| Discovery | https://dayze.com/.well-known/mcp.json |
| Server card | https://dayze.com/.well-known/mcp/server-card.json |
| OpenAPI | https://dayze.com/openapi.json |
| x402scan | https://www.x402scan.com/recipient/0x4DeE3CDA6cb33b1f7A29dE1385B192F802AE3EDa/resources |

## Pitch

Dayze is a pay-per-call people + life-in-days API for AI agents — notable packs with day-of-life numbers, similar people, and birthday peers. Public `notable_*` tools need no API key; USDC on Base via x402 after the free tier.

## Quick try

```bash
# Streamable HTTP (JSON-RPC)
curl -X POST https://dayze.com/api/mcp \
  -H 'Content-Type: application/json' \
  -H 'Accept: application/json, text/event-stream' \
  -d '{"jsonrpc":"2.0","id":1,"method":"initialize","params":{"protocolVersion":"2025-06-18","capabilities":{},"clientInfo":{"name":"curl","version":"1.0"}}}'

curl -X POST https://dayze.com/api/mcp \
  -H 'Content-Type: application/json' \
  -d '{"jsonrpc":"2.0","id":2,"method":"tools/list"}'

# REST (compat)
curl https://dayze.com/api/v1/mcp

curl -X POST https://dayze.com/api/v1/mcp \
  -H 'Content-Type: application/json' \
  -d '{"tool":"notable_pack","parameters":{"slug":"albert-einstein"}}'
```

Timeline events include `day_number` (e.g. Einstein’s Nobel = Day 15,580).

## Transport

- **Streamable HTTP** JSON-RPC at `/api/mcp` (`initialize`, `tools/list`, `tools/call`)
- **REST** MCP-compatible at `/api/v1/mcp` (`GET` capabilities, `POST` `{tool, parameters}`)
- GET SSE on `/api/mcp` is stubbed (405) on Netlify serverless

## Tags

`mcp` · `x402` · `ai-agents` · `notable-people` · `life-in-days` · `knowledge-api` · `base` · `usdc`

## License

Documentation and listing metadata in this repo: MIT.
The Dayze product and API remain proprietary; this repo exists so directories can index a public GitHub URL.
