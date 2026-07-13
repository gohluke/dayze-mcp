# Glama / local install: stdio bridge → Dayze hosted Streamable HTTP MCP.
# Primary production endpoint remains https://dayze.com/api/mcp (no proxy needed).
FROM ghcr.io/sparfenyuk/mcp-proxy:v0.12.0

# mcp-proxy remote mode: first arg is upstream URL; force streamable HTTP.
ENTRYPOINT ["mcp-proxy", "--transport=streamablehttp", "https://dayze.com/api/mcp"]
