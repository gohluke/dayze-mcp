import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
const root = new URL('../', import.meta.url);
const read = (path) => JSON.parse(readFileSync(new URL(path, root)));
const pkg = read('package.json');
const lock = read('package-lock.json');
assert.equal(lock.version, pkg.version);
assert.equal(lock.packages[''].version, pkg.version);
assert.deepEqual(lock.packages[''].dependencies, pkg.dependencies);
for (const path of ['server.json', 'server-card.json', '.claude-plugin/plugin.json', '.codex-plugin/plugin.json', '.cursor-plugin/plugin.json']) {
  assert.equal(read(path).version, pkg.version, `${path} version drift`);
}
assert.equal(read('.claude-plugin/marketplace.json').plugins[0].version, pkg.version);
for (const path of ['mcp.json', '.mcp.json']) {
  assert.equal(read(path).mcpServers.dayze.url, 'https://dayze.com/api/mcp');
}
for (const path of ['.codex-plugin/plugin.json', '.cursor-plugin/plugin.json']) {
  const plugin = read(path);
  for (const resource of [plugin.skills, plugin.mcpServers, plugin.logo ?? plugin.interface.logo]) {
    assert.ok(existsSync(new URL(resource, root)), `${path} missing resource ${resource}`);
  }
}
assert.ok(read('.codex-plugin/plugin.json').interface.shortDescription.length <= 30);
const tools = read('lib/public-tools.json');
assert.equal(new Set(tools.map((tool) => tool.name)).size, tools.length);
assert.ok(tools.every((tool) => tool.name.startsWith('notable_') && tool.annotations.readOnlyHint === true));
console.log(`Package and plugin metadata consistent at ${pkg.version}; ${tools.length} public schemas.`);
