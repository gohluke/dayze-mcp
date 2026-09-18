# Publish Dayze plugin (1.33.0)

Live MCP: `GET https://dayze.com/api/mcp/health` — expect **1.33.0**.

Human connect UI: https://dayze.com/mcp  
Best methods: https://dayze.com/docs/agents · operator kit: `dayze-webapp-main/docs/qa/SUBMIT-NOW.md`

## Already live

| Surface | Status |
|---------|--------|
| Hosted MCP | https://dayze.com/api/mcp (OAuth) · https://dayze.com/api/mcp/key (API key) |
| Compact ChatGPT | https://dayze.com/api/mcp?tools_profile=compact (6 read-only) |
| Official MCP Registry | `com.dayze/life-context` |
| OpenAI domain verify | `https://dayze.com/.well-known/openai-apps` |
| ChatGPT Apps Directory | **Ready to submit** — screenshots + portal paste left — see `dayze-webapp-main/docs/SHIP_AI_DIRECTORIES.md` |
| Cursor Marketplace | **Submit this repo** (below) — after ChatGPT filed |
| Claude Connectors | **Packet ready** — Team/Enterprise admin |

## Best method by client

| Client | Method | URL |
|--------|--------|-----|
| ChatGPT | OAuth + compact | `https://dayze.com/api/mcp?tools_profile=compact` |
| Claude | OAuth connector | `https://dayze.com/api/mcp` |
| Cursor | OAuth (this plugin) or API key | `/api/mcp` · `/api/mcp/key` |
| Gemini Spark | OAuth or Dayze CLI | `https://dayze.com/api/mcp` |
| Codex | CLI + API key | `/api/mcp/key` |

## Plugin pack

```
.cursor-plugin/plugin.json
mcp.json
.codex-plugin/plugin.json
.mcp.json
skills/dayze-life-context/SKILL.md
assets/logo.svg
assets/logo-1024.png
assets/chatgpt-screenshots/   # drop 706×800 PNGs before OpenAI upload
```

Keep logos. Never add API keys.

---

## 1. Cursor Marketplace

1. Optional local smoke:

```bash
mkdir -p ~/.cursor/plugins/local
ln -sf /Users/gluke/Documents/GOH/PHI/dayze-mcp ~/.cursor/plugins/local/dayze
```

Reload → Customize → Connect → Dayze OAuth.

2. Open https://cursor.com/marketplace/publish  
3. Submit: `https://github.com/gohluke/dayze-mcp`  
4. Prefer filing **after** ChatGPT is in review (GTM order).

---

## 2. Claude Connectors

Packet: `dayze-webapp-main/docs/qa/CLAUDE-CONNECTORS-SUBMISSION.md`  
Server: `https://dayze.com/api/mcp`

---

## 3. OpenAI Apps / Plugins Directory

Packet: `dayze-webapp-main/docs/CHATGPT_DIRECTORY_SUBMISSION.md`  
Operator: `dayze-webapp-main/docs/qa/SUBMIT-NOW.md`  
Scan + listing URL: `https://dayze.com/api/mcp?tools_profile=compact`  
Logo: `assets/logo-1024.png`
