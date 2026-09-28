# Dayze MCP

[![Dayze MCP](https://glama.ai/mcp/servers/gohluke/dayze-mcp/badge)](https://glama.ai/mcp/servers/gohluke/dayze-mcp)

**Dayze gives connected AI tools Life Context: your people, plans and memories in a private, correctable record.**

After you sign in, `get_context_pack` hands your AI the signed-in user's context (who matters, this week's plans, recent memories) over the Model Context Protocol (MCP). The public notable-people catalog (`notable_*`) is a separate feature and never touches your private record.

**ChatGPT + iPhone first.** Capture people, plans and moments in Dayze on your iPhone, then connect ChatGPT and ask about your own life. Cursor, Codex, Claude and other MCP clients use the same hosted endpoint.

**Listed on LightNow:** https://lightnow.ai/servers/com.dayze/life-context

[![LightNow MCP capabilities](https://lightnow.ai/badge/com.dayze/life-context)](https://lightnow.ai/servers/com.dayze/life-context)

## Relationship intelligence

Dayze starts with the people in your life. Ask *"When did I last see Maya, and what's next with her?"* and your AI can:

1. **Resolve the person** — `resolve_person` / `get_people` against your private Dayze Contacts.
2. **Show the linked moments** — `get_person_interactions` returns the events, places and notes connected to that person.
3. **Show the evidence** — `explain_fact` returns the source behind a claim, so the answer is traceable rather than guessed.
4. **Correct it** — `update_person`, `merge_people` and the other write tools fix the record, so the next answer is right.

These four steps use the full endpoint (`https://dayze.com/api/mcp`). ChatGPT's compact profile is read-only: `get_context_pack`, `get_people_context`, `get_events`, `search_dayze` and related context reads, with corrections made in Dayze itself.

## Connect ChatGPT

1. ChatGPT → Settings → Connectors → add a custom connector.
2. URL: `https://dayze.com/api/mcp?tools_profile=compact`
3. Click **Connect** and sign in to Dayze (OAuth). No API key.
4. Ask: "Use Dayze to pull my context pack for this week."

More detail: [`README-CHATGPT.md`](README-CHATGPT.md) · https://dayze.com/docs/agents

## Claude Code

This repo is also a [Claude Code plugin](https://code.claude.com/docs/en/plugins) and its own marketplace (`.claude-plugin/`). The plugin adds the hosted Dayze MCP server and the `dayze-life-context` skill.

```bash
claude plugin marketplace add gohluke/dayze-mcp
claude plugin install dayze@dayze
claude mcp login plugin:dayze:dayze
```

The last command opens Dayze sign-in in your browser (OAuth). In a session you can use `/mcp` → **plugin:dayze:dayze** → **Authenticate** instead. No API key.

Then ask: "Use Dayze to pull my context pack for this week."

To point the plugin at a different Dayze connector URL, set `DAYZE_MCP_URL` in the `env` block of `~/.claude/settings.json` and sign in again. The default is `https://dayze.com/api/mcp`.

Local development: `claude --plugin-dir /path/to/dayze-mcp`.

## Cursor / Grok Bot

This repo is a [Cursor Plugin](https://cursor.com/docs/reference/plugins) (**v1.33.0**): `.cursor-plugin/plugin.json`, `skills/dayze-life-context/`, URL-only root [`mcp.json`](https://cursor.com/docs/mcp), plus [Codex/ChatGPT](https://developers.openai.com/plugins/build/plugins) metadata in `.codex-plugin/` and `.mcp.json`.

**Dayze Contacts** is the private CRM. Advertised MCP names stay `get_people`, `create_person`, `update_person`, `resolve_person` (stable). Call aliases `get_contacts` / `create_contact` / `update_contact` / `resolve_contact` work on the hosted server. Public **People** stays `notable_*`.

**Cursor Marketplace:** `https://github.com/gohluke/dayze-mcp` submitted 2026-09-19, in review (see `PUBLISH.md`). The ChatGPT custom connector works today; the ChatGPT Apps Directory listing is in review.

Until marketplace review lands, test locally:

```bash
mkdir -p ~/.cursor/plugins/local
ln -s /path/to/dayze-mcp ~/.cursor/plugins/local/dayze
```

Reload Cursor (`Developer: Reload Window`), open Customize, and click **Connect**. Sign in to Dayze in the browser. Do not paste an API key — Cursor discovers OAuth from [RFC 9728](https://dayze.com/.well-known/oauth-protected-resource). Same Connect flow for Cursor desktop, Cursor web, and Grok Bot.

Docs: https://dayze.com/docs/agents

| | |
|---|---|
| Website | https://dayze.com |
| Agents docs | https://dayze.com/docs/agents |
| Streamable HTTP | https://dayze.com/api/mcp |
| REST MCP | https://dayze.com/api/mcp |
| Discovery | https://dayze.com/.well-known/mcp.json |
| Server card | https://dayze.com/.well-known/mcp/server-card.json |
| OpenAPI | https://dayze.com/openapi.json |
| OAuth PRM | https://dayze.com/.well-known/oauth-protected-resource |
| OAuth AS | https://dayze.com/.well-known/oauth-authorization-server |

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
curl https://dayze.com/api/mcp

curl -X POST https://dayze.com/api/mcp \
  -H 'Content-Type: application/json' \
  -d '{"tool":"notable_pack","parameters":{"slug":"albert-einstein"}}'
```

The last call uses the public notable-people catalog. Timeline events include `day_number` (e.g. Einstein’s Nobel = Day 15,580).

## Auth

- Private Life Context tools (`get_context_pack`, Contacts, events, memories): OAuth `dayze_at_…` (recommended) or `Bearer dayze_k_…`, scope `context`
- Public `notable_*` tools: no login (see [public tool pricing](#technical-reference-public-tool-pricing))
- OAuth 2.1 + PKCE + DCR for ChatGPT / Claude / Gemini agents — see https://dayze.com/docs/agents

## Transport

- **Streamable HTTP** JSON-RPC at `/api/mcp` (`initialize`, `tools/list`, `tools/call`)
- **Compact ChatGPT profile** at `/api/mcp?tools_profile=compact` (read-only subset)
- **REST** MCP-compatible at `/api/v1/mcp` (`GET` capabilities, `POST` `{tool, parameters}`)
- GET `/api/mcp` returns discovery JSON (200); SSE sessions are not available on Netlify serverless

## Tags

`life-context` · `mcp` · `model-context-protocol` · `personal-crm` · `relationship-intelligence` · `chatgpt` · `ai-agents` · `notable-people`

## Glama install / Make Release

Dayze MCP is **hosted** at `https://dayze.com/api/mcp`. This repo ships a local
**stdio** adapter (`server.mjs`) so Glama can build/scan without putting a URL in CMD
(Glama rejects remote endpoints in CMD arguments).

1. Open https://glama.ai/mcp/servers/gohluke/dayze-mcp/admin/dockerfile
2. **Build steps:** `["npm install"]`
3. **CMD arguments:** `["node", "./server.mjs"]`
4. Click **Build** → wait for green → **Build & Release** (`1.6.2`)

If Glama keeps checking out an old commit, use build steps:
`["git fetch origin && git checkout origin/main", "npm install"]`

Prefer connecting clients directly to `https://dayze.com/api/mcp` (Streamable HTTP + OAuth).

## Technical reference: public tool pricing

This applies only to the public notable-people catalog, not to your private Life Context.

- Anonymous `notable_*` calls have a free tier. After it, the server may answer `402 Payment Required` using [x402](https://www.x402.org/) (USDC on Base).
- Signed-in Dayze clients (OAuth or API key) skip that anonymous paywall.
- Per-call list prices appear in each tool description (e.g. `notable_search` $0.01, `notable_pack` $0.05).
- Payment recipient on x402scan: https://www.x402scan.com/recipient/0x4DeE3CDA6cb33b1f7A29dE1385B192F802AE3EDa/resources

## License

Documentation and listing metadata in this repo: MIT.
The Dayze product and API remain proprietary; this repo exists so directories can index a public GitHub URL.
