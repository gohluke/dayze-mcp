# Publish Dayze plugin (1.32.0)

Live MCP: `GET https://dayze.com/api/mcp/health` — after Dayze deploy expect **1.32.0** (Contacts titles). Until then production may still report **1.30.2**.

Human connect UI: https://dayze.com/mcp  
Best methods: https://dayze.com/docs/agents · `DAYZE_MCP_BEST_METHODS` in dayze-webapp

## Already live

| Surface | Status |
|---------|--------|
| Hosted MCP | https://dayze.com/api/mcp (OAuth) · https://dayze.com/api/mcp/key (API key) |
| Official MCP Registry | `com.dayze/life-context` (republish when stub version bumps) |
| ChatGPT custom connector | Live (dev) — compact URL |
| OpenAI domain verify | `https://dayze.com/.well-known/openai-apps` |
| Cursor Marketplace | **Submit this repo** (below) |
| Claude Connectors Directory | **Not submitted** — packet in dayze-webapp `docs/MCP_AGENT_PLATFORMS.md` |
| OpenAI Apps Directory | **Not submitted** — `docs/CHATGPT_DIRECTORY_SUBMISSION.md` |

## Best method by client

| Client | Method | URL |
|--------|--------|-----|
| ChatGPT | OAuth + compact tools | `https://dayze.com/api/mcp?tools_profile=compact` |
| Claude | OAuth connector | `https://dayze.com/api/mcp` |
| Cursor | API key **or** OAuth | `/api/mcp/key` + Bearer · or `/api/mcp` OAuth (this plugin) |
| Gemini Spark | OAuth or Dayze CLI | `https://dayze.com/api/mcp` |
| Codex | CLI + API key | `/api/mcp/key` |

This marketplace plugin uses **OAuth** (`mcp.json` → `/api/mcp`) so Connect works without pasting keys.

## Plugin pack (repo root)

```
.cursor-plugin/plugin.json   # Cursor Marketplace (v1.32.0)
mcp.json                     # URL-only Streamable HTTP — no API keys
.codex-plugin/plugin.json    # ChatGPT / Codex
.mcp.json                    # Codex http type
skills/dayze-life-context/SKILL.md
assets/logo.svg
```

Keep `assets/logo.svg`. Do not add API keys or `.app.json`.

---

## 1. Cursor Marketplace — submit now

1. Confirm `main` includes **v1.32.0**.
2. Optional local smoke:

```bash
mkdir -p ~/.cursor/plugins/local
ln -sf /Users/gluke/Documents/GOH/PHI/dayze-mcp ~/.cursor/plugins/local/dayze
```

Reload Cursor → **Customize** → **Connect** → Dayze OAuth.

3. Open https://cursor.com/marketplace/publish
4. Submit: `https://github.com/gohluke/dayze-mcp`
5. Checklist: name `dayze`, description, logo, README, OAuth Connect tested.

---

## 2. Claude Connectors Directory

Requires Claude **Team/Enterprise**. Paste from dayze-webapp `docs/MCP_AGENT_PLATFORMS.md` § Anthropic:

- Server URL: `https://dayze.com/api/mcp`
- Privacy: https://dayze.com/privacy
- Docs: https://dayze.com/docs/agents

---

## 3. OpenAI Apps / Plugins Directory

Full packet: dayze-webapp `docs/CHATGPT_DIRECTORY_SUBMISSION.md`

- Portal Scan Tools: `https://dayze.com/api/mcp` (full annotations)
- User connector: `https://dayze.com/api/mcp?tools_profile=compact`
- Demo account: `mcptestbot` (portal only)

---

## 4. Official MCP Registry republish

After tagging `v1.32.0`, republish `server.json` with DNS Ed25519 (see dayze-webapp `mcp-registry/`).

---

## Smoke (after any deploy)

```bash
curl -sS https://dayze.com/api/mcp/health | jq '.version, .tools'
# expect 1.32.0 (after Dayze webapp deploy)
curl -sS -X POST https://dayze.com/api/mcp \
  -H 'Content-Type: application/json' \
  -d '{"jsonrpc":"2.0","id":1,"method":"tools/list","params":{}}' \
  | jq '.result.tools | length'
```
