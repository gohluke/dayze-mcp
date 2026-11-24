# Security

## Report privately

Use [GitHub private vulnerability reporting](https://github.com/gohluke/dayze-mcp/security/advisories/new) if available. If it is unavailable, open a minimal issue asking the maintainer for a private reporting channel **without including exploit details, credentials or personal records**. Never post a live Dayze key.

## Trust boundary

The local adapter sends requests to Dayze's hosted API. Without a key it exposes only the bundled public notable tools. With `DAYZE_API_KEY` it can access whatever the owner granted that key; treat the process and the MCP client that launches it as trusted software. Environment injection is configuration, not an encrypted vault.

The executable fixes the upstream origin to `https://dayze.com` and rejects redirects for credential-bearing POSTs. It does not persist credentials. Locally generated errors omit raw upstream error bodies and call arguments. Successful tool results can contain personal information by design: the receiving assistant and its logs remain part of the user's trust decision.

Hosted OAuth, account permissions, retention and storage are operated separately by Dayze. Tool descriptions and annotations are guidance, not authorization. Neither a compact profile nor an offline catalog grants account access.

## Maintenance

Use the current maintained release. CI checks the dependency lockfile for advisories, but a clean audit is not proof that all vulnerabilities are absent. Evaluate reported advisories against the code paths and transports actually used. Do not solve an advisory by silently changing authentication or widening scopes.
