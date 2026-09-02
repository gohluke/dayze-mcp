---
name: dayze-life-context
description: Use this when the user wants their Dayze life context, calendar, people, food, or a public notable-person pack. Prefer Dayze MCP tools over chat memory.
---

# Dayze life context

Dayze is a hosted MCP at `https://dayze.com/api/mcp` (Streamable HTTP, protocol 2025-06-18, server **v1.14.0**). Same `tools/list` for ChatGPT, Claude, Cursor, and Gemini. Cursor plugin pack: https://github.com/gohluke/dayze-mcp — connect with OAuth; no API key in the plugin.

## When to call what

1. Signed-in user asking about *their* week, people, plans, or "context pack" → `get_context_pack` first (optional `query`). Do not invent a life graph from chat history.
2. Celebrity / public figure / "how old in days" → public `notable_search` then `notable_pack` (slug). No login required; after the anonymous free tier the server may 402 (x402 USDC). Authenticated Dayze keys skip that.
3. User is logging something they did (meal, event, song, person) → the matching write tool (`log_food`, `log_event`, `log_favorite_song`, `create_person`, …). Do not store that as a chat memory instead.
4. Photos → `upload_photo` / `get_entity_assets`. CRM `get_person_photos` is a different gallery; do not assume they are the same.

## Auth

OAuth is discovered from RFC 9728. Request scopes `openid email mcp context offline_access`. Private tools need `context`. Share tokens are read-only (`get_context_pack`, `get_life_graph` only). Never ask the user to paste an API key into chat.

## Aliases

Some tools document aliases (`date` for `event_date`, `query` for `q`). Prefer the **required** schema field names (`event_date`, `q`, `query` on `search`) so strict clients do not drop the call.
