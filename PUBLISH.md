# Maintainer release checklist

This repository releases the adapter and client integration files. It does not deploy the Dayze backend or automatically publish an external directory listing.

## Prepare a version

1. Change the package version, lockfile root versions and all plugin/server metadata together. `npm run check` rejects drift. Hosted API versions are independent.
2. Run `npm ci --ignore-scripts`, `npm run check`, `npm test`, `npm audit --omit=dev` and `npm pack --dry-run` from a clean checkout. Confirm the supported Node matrix in CI.
3. Inspect the packed files. Include `server.mjs`, `lib/` (including public schemas), package metadata, README and license; exclude secrets, node_modules, private data and local artifacts.
4. Optionally run `npm run smoke:live`. It checks only unauthenticated metadata. Record authenticated client acceptance separately; never use health alone as proof that sign-in and tool calls work.
5. Review README/setup links, current public schemas and permissions language. Never turn a profile label or listing snapshot into a claim about authorization.

## Client acceptance

Use the existing Claude Code, Cursor and Codex compatibility layouts. Test the intended client before announcing that client as validated. For hosted OAuth: sign in, read a known disposable test record, check a denied scope and revoke. Test writes only in an expressly authorized test account. Never attach private records or tokens to release notes.

For stdio hosts such as Glama, use `npm ci --ignore-scripts` and `node ./server.mjs`, or the included Dockerfile. Unauthenticated discovery is intentionally limited to public tools. Do not force a remote branch checkout during an external build: the selected reviewed commit should be reproducible.

## Publish only with release authorization

A merged PR is not an npm release, marketplace approval or hosted backend deployment. After owner authorization, publish the reviewed package/tag using the existing account and registry, and verify the installed package contents. Directory submissions are separate actions with their own review policies.

- [MCP Registry publishing](https://modelcontextprotocol.io/registry/quickstart)
- [Claude Code plugins](https://code.claude.com/docs/en/plugins)
- [Claude connector submissions](https://claude.com/docs/connectors/building/submission)
- [OpenAI plugin publication](https://developers.openai.com/plugins/deploy/submission)
- [Cursor plugins](https://cursor.com/docs/reference/plugins)

Check the relevant dashboard before claiming a submission is approved or pending. Do not commit review case IDs, account credentials or operator machine paths.
