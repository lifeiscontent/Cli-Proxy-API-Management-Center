// Install dist/index.html as the proxy's management panel and verify it live.
//
// Usage: bun scripts/install-panel.mjs [--config <path>] [--panel <path>]
//          [--artifact <path>] [--verify-url <url>]
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { installPanel } from './panel-installation.mjs';

const project = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const args = process.argv.slice(2);
function option(name, fallback, path = true) {
  const index = args.indexOf(name);
  if (index < 0) return fallback;
  if (!args[index + 1] || args[index + 1].startsWith('--'))
    throw new Error(`Missing value for ${name}`);
  return path ? resolve(args[index + 1]) : args[index + 1];
}
try {
  const configPath = option('--config', '/opt/homebrew/etc/cliproxyapi.conf');
  await installPanel({
    configPath,
    panelPath: option('--panel', resolve(dirname(configPath), 'static/management.html')),
    artifactPath: option('--artifact', resolve(project, 'dist/index.html')),
    verifyUrl: option('--verify-url', undefined, false),
  });
  console.log('Installed and live-verified the panel.');
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
}
