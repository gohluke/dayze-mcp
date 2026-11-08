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
| ChatGPT Apps Directory | **In review** — case `C-oTlKSZznSzi0` (Gmail 2026-09-17) |
| Cursor Marketplace | **In review** — submitted 2026-09-19 (`gohluke/dayze-mcp`) |
| Claude Connectors | **Preparation** — any paid Claude plan, including Max, can submit; the Claude Code plugin is a separate distribution |
| Claude Code plugin | Self-hosted marketplace in this repo (`.claude-plugin/`); `claude plugin marketplace add gohluke/dayze-mcp` |

## Best method by client

| Client | Method | URL |
|--------|--------|-----|
| ChatGPT | OAuth + compact | `https://dayze.com/api/mcp?tools_profile=compact` |
| Claude | OAuth connector | `https://dayze.com/api/mcp` |
| Claude Code | OAuth (this plugin) | `https://dayze.com/api/mcp` (override with `DAYZE_MCP_URL`) |
| Cursor | OAuth (this plugin) or API key | `/api/mcp` · `/api/mcp/key` |
| Gemini Spark | OAuth or Dayze CLI | `https://dayze.com/api/mcp` |
| Codex | CLI + API key | `/api/mcp/key` |

## Plugin pack

```
.claude-plugin/plugin.json      # Claude Code plugin (inline MCP server)
.claude-plugin/marketplace.json # Claude Code marketplace: this repo
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

2. Sign in → https://cursor.com/marketplace/publish  
3. Submit: `https://github.com/gohluke/dayze-mcp`  
4. ChatGPT is already in review — Cursor is the next public listing.

---

## 2. Claude Connectors Directory

Any **paid Claude plan**, including Pro or Max, can submit. Team/Enterprise accounts have organization-role requirements; a personal Max account does not need a Team upgrade. See [Anthropic's current submission guide](https://claude.com/docs/connectors/building/submission).

Packet: `dayze-webapp-main/docs/qa/CLAUDE-CONNECTORS-SUBMISSION.md`. Finish OAuth and every-tool QA, reviewer access and the owner's policy review before submission. Installing this repo's Claude Code plugin does not submit or publish a connector listing. Verify the actual state in https://claude.ai/directory/manage.

---

## 3. OpenAI Apps / Plugins Directory

Packet: `dayze-webapp-main/docs/CHATGPT_DIRECTORY_SUBMISSION.md`  
Operator: `dayze-webapp-main/docs/qa/SUBMIT-NOW.md`  
Scan + listing URL: `https://dayze.com/api/mcp?tools_profile=compact`  
Logo: `assets/logo-1024.png`
