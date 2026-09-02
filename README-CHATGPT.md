# ChatGPT / Codex — Dayze plugin

Drop these files onto the root of https://github.com/gohluke/dayze-mcp (alongside the existing `.cursor-plugin/` and `mcp.json`).

```
.codex-plugin/plugin.json
.mcp.json
skills/dayze-life-context/SKILL.md
.agents/plugins/marketplace.json   # optional, local marketplace test
```

Keep `assets/logo.svg` from the repo. Do not add `.app.json` until ChatGPT developer mode has issued a real `plugin_asdk_app…` connection id.

## ChatGPT Apps Connector (no plugin zip required)

1. ChatGPT → Settings → Connectors → add custom connector.
2. URL: `https://dayze.com/api/mcp`
3. Connect and sign in to Dayze (OAuth). Callback form that Dayze DCR allowlists:
   - `https://chatgpt.com/connector/oauth/`
   - `https://chatgpt.com/connector/oauth/<id>`
   - **Not** `https://chatgpt.com/connector/oauth` (no trailing slash) — DCR 400.
4. Ask: “Use Dayze to pull my context pack for this week.”

Request scopes `openid email mcp context offline_access`. Default DCR scope is `mcp` only; private tools need `context`.

## ChatGPT / Codex plugin directory

This package follows https://developers.openai.com/plugins/build/plugins

- Manifest lives only in `.codex-plugin/plugin.json`.
- Remote MCP config is `.mcp.json` (URL-only Streamable HTTP).
- Skill is under `skills/`.

Local test: enable ChatGPT developer mode, add the connector URL above, and/or load `.agents/plugins/marketplace.json` as a repo marketplace.

Live server (2026-09-01): `GET https://dayze.com/api/mcp/health` → version **1.13.0**, **71 tools**.
