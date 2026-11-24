// Explicit opt-in metadata probe. No credentials, tools/call, payments or user records.
import { createUpstream, ENDPOINT } from '../lib/upstream.mjs';
const upstream = createUpstream();
try {
  const health = await fetch(`${ENDPOINT}/health`, { signal: AbortSignal.timeout(30000), redirect: 'error' });
  if (!health.ok) throw new Error('health');
  const data = await health.json();
  if (data.ok !== true || !data.version) throw new Error('health');
  const listing = await upstream.listTools();
  console.log(JSON.stringify({ endpoint: ENDPOINT, healthy: true, hostedVersion: data.version, listedTools: listing.tools.length, authenticated: false, toolCalls: 0 }, null, 2));
} catch {
  console.error('Dayze metadata smoke check failed. Check endpoint availability; no tool calls were made.');
  process.exitCode = 1;
} finally {
  await upstream.close();
}
