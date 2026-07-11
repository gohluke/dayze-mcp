# Dayze MCP

[![Dayze MCP](https://glama.ai/mcp/servers/gohluke/dayze-mcp/badge)](https://glama.ai/mcp/servers/gohluke/dayze-mcp)

**Hosted people + life-in-days knowledge API for AI agents.**


**Install / try on Smithery:** https://smithery.ai/servers/polaris/dayze

[![smithery badge](https://smithery.ai/badge/@polaris/dayze)](https://smithery.ai/servers/polaris/dayze)

| | |
|---|---|
| Website | https://dayze.com |
| MCP endpoint | https://dayze.com/api/v1/mcp |
| Discovery | https://dayze.com/.well-known/mcp.json |
| Server card | https://dayze.com/.well-known/mcp/server-card.json |
| OpenAPI | https://dayze.com/openapi.json |
| x402scan | https://www.x402scan.com/recipient/0x4DeE3CDA6cb33b1f7A29dE1385B192F802AE3EDa/resources |

## Pitch

Dayze is a pay-per-call people + life-in-days API for AI agents — notable packs with day-of-life numbers, similar people, and birthday peers. Public `notable_*` tools need no API key; USDC on Base via x402 after the free tier.

## Quick try

```bash
curl https://dayze.com/api/v1/mcp

curl -X POST https://dayze.com/api/v1/mcp \
  -H 'Content-Type: application/json' \
  -d '{"tool":"notable_pack","parameters":{"slug":"albert-einstein"}}'
```

Timeline events include `day_number` (e.g. Einstein’s Nobel = Day 15,580).

## Transport

REST MCP-compatible HTTP JSON (`GET` capabilities, `POST` tool invoke). Not full Streamable HTTP yet.

## Tags

`mcp` · `x402` · `ai-agents` · `notable-people` · `life-in-days` · `knowledge-api` · `base` · `usdc`

## License

Documentation and listing metadata in this repo: MIT.
The Dayze product and API remain proprietary; this repo exists so directories can index a public GitHub URL.
