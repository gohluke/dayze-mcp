# Contributing

Dayze MCP is a small integration layer. Changes should preserve hosted connection compatibility and keep personal data out of fixtures, screenshots and logs.

## Develop

Use Node 22 or 24 and `npm ci --ignore-scripts`. Run `npm run check` and the **whole** `npm test` suite. Tests use Node's built-in runner, the actual stdio entry point and synthetic HTTP fixtures; no Dayze account, network access or production credentials are required. `npm run smoke:live` is a separate opt-in network check.

- `server.mjs`: executable and process lifecycle.
- `lib/adapter.mjs`: stdio-facing discovery and call policy.
- `lib/upstream.mjs`: official SDK client, credential forwarding and safe errors.
- `lib/public-tools.json`: public-only schema snapshot.
- `test/`: protocol and failure-path checks.
- `scripts/check-package.mjs`: version and reference consistency.

Add a regression test for meaningful behavior changes, especially authentication, cancellation, retries and error handling. A write must never be automatically repeated merely because its response was lost. Keep stdout exclusively for MCP messages.

## Pull requests

Explain the problem, resulting behavior, validation and any untested host-specific flow. Keep dependency lockfile changes intentional. If a client manifest changes, check it in that client when available and state what you could not verify. Do not change marketplace approval claims based on assumptions.

For bugs, provide Node/client versions, operating system, reproduction steps and redacted errors. Do not post tokens, private contact details or production payloads. Security issues belong in the private reporting route in [SECURITY.md](SECURITY.md).
