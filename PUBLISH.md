# Publish Dayze plugin (1.14.0)

Live MCP: `GET https://dayze.com/api/mcp/health` → version **1.14.0**, **71 tools**.

## Already live
- ChatGPT plugin: https://chatgpt.com/plugins/plugin_asdk_app_6a95dc80b2f081918592ac779de57ba0
- Hosted MCP: https://dayze.com/api/mcp (OAuth, no key in the plugin)
- OpenAI Apps domain verification: `https://dayze.com/.well-known/openai-apps`

## Plugin pack (repo root)

```
.cursor-plugin/plugin.json   # Cursor Marketplace (v1.14.0)
mcp.json                     # URL-only Streamable HTTP — no API keys
.codex-plugin/plugin.json    # ChatGPT / Codex
.mcp.json                    # Codex http type
skills/dayze-life-context/SKILL.md
assets/logo.svg
```

Keep `assets/logo.svg`. Do not add API keys or `.app.json`.

## Cursor marketplace (submit now)

1. Confirm `main` on https://github.com/gohluke/dayze-mcp includes **v1.14.0**.
2. Local smoke test (optional but recommended):

```bash
mkdir -p ~/.cursor/plugins/local
ln -sf /path/to/dayze-mcp ~/.cursor/plugins/local/dayze
```

Reload Cursor (`Developer: Reload Window`) → **Customize** → **Connect** → sign in with Dayze OAuth.

3. Open https://cursor.com/marketplace/publish
4. Submit repository URL: `https://github.com/gohluke/dayze-mcp`
5. Checklist: kebab-case `name` (`dayze`), description, logo path, README, OAuth Connect tested.

Until review lands, Dayze will not appear in Cursor Search / marketplace browse. Symlink install works today.

## OpenAI public directory (separate from Cursor)

Portal **Scan Tools** URL: `https://dayze.com/api/mcp` (full `tools/list` with top-level hints).

ChatGPT **connector** URL: `https://dayze.com/api/mcp?tools_profile=compact`

Full packet: https://github.com/gohluke/dayze-webapp/blob/main/docs/CHATGPT_DIRECTORY_SUBMISSION.md

Scopes: `openid email mcp context offline_access`

## Smoke (after any deploy)

```bash
curl -sS https://dayze.com/api/mcp/health | jq '.version, .tools'
curl -sS -X POST https://dayze.com/api/mcp \
  -H 'Content-Type: application/json' \
  -d '{"jsonrpc":"2.0","id":1,"method":"tools/list","params":{}}' \
  | jq '.result.tools[] | select(.name=="notable_search") | {readOnlyHint, openWorldHint, destructiveHint}'
```
