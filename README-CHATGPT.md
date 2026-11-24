# Connect Dayze to ChatGPT

Dayze provides personal life context through the hosted MCP endpoint:

```text
https://dayze.com/api/mcp
```

Use **OAuth** and sign in through Dayze. Do not paste a Dayze API key into a chat.

## Set up the connection

Follow [OpenAI's current custom MCP connection instructions](https://developers.openai.com/plugins/deploy/connect-chatgpt). Account and workspace policies apply. At the time of this documentation update, the guide uses ChatGPT Plugins → plus → Add custom MCP server. Enter the Dayze endpoint, choose OAuth, review the connection and install it. Then select the connection in a new conversation.

Try: “Use Dayze to pull my context pack for this week.” Verify that the answer comes from a successful tool result, includes source links where returned and acknowledges missing context.

The optional `?tools_profile=compact` endpoint uses a curated catalog. It is **not a read-only security boundary**: its tools can include writes. Review the scopes you grant, the listed tools and any action confirmations. A denied action requires appropriate permission; changing the prompt does not grant it.

## Check the complete flow

- Sign in to the intended Dayze account and read your context pack.
- Ask about a saved plan or contact and check the cited source.
- Try a request requiring an ungranted permission; the assistant should explain the limitation.
- If you deliberately authorize a test write, use a disposable record and inspect the actual receipt in Dayze. Automated tests in this repo do not run this step.
- Revoke the connection in Dayze, then confirm it no longer reads private context.

When hosted tool metadata changes, use the client's refresh/reconnect flow and start a new conversation. Follow the official guide if controls have moved.

## Scope of this repository

The `.codex-plugin/` compatibility metadata, `.mcp.json` connection configuration and `skills/dayze-life-context/` instructions live here. They do not deploy the hosted API or prove an external directory listing is approved. No account-specific app ID or credential is bundled.
