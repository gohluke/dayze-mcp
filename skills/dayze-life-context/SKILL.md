---
name: dayze-life-context
description: Use this when the user wants their Dayze life context, calendar, Dayze Contacts, food, money, places, travel, sleep, or a public notable-person pack, or wants to log or correct something in Dayze. Prefer Dayze MCP tools over chat memory.
---

# Dayze life context

Dayze is a hosted MCP at `https://dayze.com/api/mcp` (Streamable HTTP, protocol 2025-06-18). Plugin pack for Claude Code, Cursor and Codex: https://github.com/gohluke/dayze-mcp. Connect with OAuth; no API key in the plugin.

Private CRM is **Dayze Contacts**. Advertised MCP names stay `get_people` / `create_person` / `update_person` / `resolve_person` (stable for connectors). Call aliases `get_contacts` / `create_contact` / `update_contact` / `resolve_contact` also work. Public notable catalog is **People** (`notable_*`). Do not tell the user to open “My People.”

## When to call what

1. Signed-in user asking about *their* week, people, plans, or "context pack" → `get_context_pack` first (optional `query`). Do not invent a life graph from chat history.
2. Celebrity / public figure / "how old in days" → public `notable_search` then `notable_pack` (slug). No login required; after the anonymous free tier the server may 402 (x402 USDC). Authenticated Dayze keys skip that.
3. User is logging something they did (meal, event, song, person, expense, sleep, place visit) → the matching write tool (`log_food`, `log_event`, `log_favorite_song`, `create_person`, `log_expense`, `log_sleep`, `log_place_visit`, …). Do not store that as a chat memory instead.
4. Correcting a record → read it first (`get_events`, `resolve_person`, `get_places`, …), then call the matching `update_*` tool with the returned id. Never guess ids.
5. Photos → `upload_photo` / `get_entity_assets`. CRM `get_person_photos` is a different gallery; do not assume they are the same.

## Writes

- Every OAuth write needs a client-generated `request_id` (or `idempotency_key`). Use a fresh UUID per change; reuse it only when retrying that same change.
- Prefer `archive_event` / `archive_expense` / `archive_trip` over hard deletes; they return an id for `restore_event` / `restore_expense` / `restore_trip`.
- Contact deletes and merges need a preview first (`delete_person_preview`, `merge_people_preview`); `undo_contact_change` restores them for 30 days. Place-visit deletes use `preview_destructive_change`, undone with `restore_change`.
- Confirm with the user before any destructive call, and say what will change.
- If a write returns `USER_ACTION_REQUIRED` or `INSUFFICIENT_SCOPE`, this connection is read-only. Tell the user instead of retrying.

## Auth

OAuth is discovered from RFC 9728. Request scopes `openid email mcp context offline_access`. Private tools need `context`. Share tokens are read-only (`get_context_pack`, `get_life_graph` only). Never ask the user to paste an API key into chat.

## Aliases

- **Tool names (Contacts):** prefer advertised `get_people` / `create_person` / `update_person` / `resolve_person`. Hosted MCP also accepts `get_contacts` / `create_contact` / `update_contact` / `resolve_contact` on `tools/call` only.
- **Input fields:** some tools document aliases (`date` for `event_date`, `query` for `q`). Prefer the **required** schema field names (`event_date`, `q`, `query` on `search`) so strict clients do not drop the call.
