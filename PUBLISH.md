# Publish Dayze plugin (1.13.0)

Live MCP: `GET https://dayze.com/api/mcp/health` → version **1.13.0**, **71 tools**.

## Already live
- ChatGPT plugin: https://chatgpt.com/plugins/plugin_asdk_app_6a95dc80b2f081918592ac779de57ba0
- Hosted MCP: https://dayze.com/api/mcp (OAuth, no key in the plugin)

## Drop onto https://github.com/gohluke/dayze-mcp (repo root)

```
.cursor-plugin/plugin.json   # bump to 1.13.0 + skills
mcp.json                     # already exists; keep url-only
.codex-plugin/plugin.json    # ChatGPT / Codex
.mcp.json                    # Codex http type
skills/dayze-life-context/SKILL.md
```

Keep existing `assets/logo.svg`. Do not add API keys or `.app.json`.

## Cursor marketplace (the remaining publish click)

1. Merge the files to `main` on the public repo.
2. Open https://cursor.com/marketplace/publish
3. Submit repository URL: `https://github.com/gohluke/dayze-mcp`
4. Checklist: unique kebab-case `name` (`dayze`), description, logo relative path, README, tested OAuth Connect locally.

Until review lands, Dayze will not appear in Grok Bot / Cursor SearchPlugins.

## ChatGPT custom connector (already works)

Settings → Connectors → `https://dayze.com/api/mcp`
DCR allowlist needs trailing slash: `https://chatgpt.com/connector/oauth/`
Scopes: `openid email mcp context offline_access`
