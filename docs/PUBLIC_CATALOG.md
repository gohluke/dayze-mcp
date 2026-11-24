# Bundled public schemas

`lib/public-tools.json` is the stdio adapter's intentionally small public catalog:

- `notable_search`
- `notable_profile`
- `notable_pack`
- `notable_pack_premium`

These read public notable-person information, not private Dayze Contacts. The snapshot contains schemas and annotations, not results or an offline data cache. Calls still go to the hosted service, whose validation, availability and payment rules apply.

Reviewed on **2026-11-24** against `lib/mcp/discovery.ts` in Dayze's hosted implementation at commit `4d31ecdc2fec59c8a9a23885a6ab4b9804dd8609`. Schemas retain the public inputs, including `q` / `query` search aliases; descriptions omit per-call prices so this file does not publish stale billing terms. The operator can compare it with current discovery metadata before a release.

With `DAYZE_API_KEY`, discovery comes from the live, scoped server instead. It preserves the upstream cursor; no private fallback catalog is used on failure. The full hosted service can expose additional tools and profiles that this static public snapshot does not represent.
