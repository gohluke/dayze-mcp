# Changelog

## 1.42.0 — unreleased

- Replace hand-written HTTP/SSE parsing with the official MCP client transport.
- Make stdio public-only without credentials; add explicit `DAYZE_API_KEY` forwarding for scoped private access.
- Preserve live discovery pagination and distinguish authentication, permission, payment, rate-limit, timeout and protocol failures without echoing raw failures or arguments.
- Add protocol/stdio regression tests, a Node 22/24 CI matrix, metadata checks and an opt-in metadata-only live probe.
- Refresh compatible dependencies and synchronize package/plugin versions.
- Refresh setup and architecture documentation; remove stale pricing, tool counts and directory-status claims.
- Install container dependencies from the lockfile and run the image as a non-root user.

Earlier Git history contains the integration and client-manifest changes before this changelog was introduced. The hosted API uses an independent version series.
