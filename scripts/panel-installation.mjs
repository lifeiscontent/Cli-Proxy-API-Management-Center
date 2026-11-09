import { mkdtempSync, readFileSync, renameSync, rmSync, statSync, writeFileSync } from 'node:fs';
import { createHash, randomUUID } from 'node:crypto';
import { tmpdir } from 'node:os';
import { resolve } from 'node:path';
import { parseDocument } from 'yaml';

export const hash = (value) => createHash('sha256').update(value).digest('hex');
const settingKeys = ['disable-auto-update-panel', 'disable-control-panel'];
export function atomicWrite(path, content, mode) {
  const temporary = `${path}.${randomUUID()}.tmp`;
  try {
    writeFileSync(temporary, content, { mode, flag: 'wx' });
    renameSync(temporary, path);
  } finally {
    rmSync(temporary, { force: true });
  }
}
export function readConfig(path) {
  const document = parseDocument(readFileSync(path, 'utf8'));
  if (document.errors.length) throw new Error('Configuration YAML is invalid; no changes made.');
  if (document.get('config-version') !== 8 || !document.has('management')) {
    throw new Error('This installer requires the v8 management configuration.');
  }
  return document;
}
function restoreSettings(configPath, settings) {
  const document = readConfig(configPath);
  for (const [key, value] of Object.entries(settings)) {
    if (value === null) document.deleteIn(['management', key]);
    else document.setIn(['management', key], value);
  }
  atomicWrite(configPath, document.toString(), statSync(configPath).mode & 0o777);
}
export async function verifyPanel(url, expectedHash) {
  const target = new URL(url);
  if (
    !['http:', 'https:'].includes(target.protocol) ||
    !['localhost', '127.0.0.1', '[::1]'].includes(target.hostname)
  ) {
    throw new Error('Live verification must use a loopback HTTP(S) URL.');
  }
  const response = await fetch(target, {
    redirect: 'error',
    signal: AbortSignal.timeout(10000),
    cache: 'no-store',
  });
  if (!response.ok || hash(Buffer.from(await response.arrayBuffer())) !== expectedHash) {
    throw new Error('Live dashboard does not match the new build.');
  }
}
/**
 * Install the panel and verify it live. The previous panel and config go to a
 * temporary directory for the duration of the install. The directory is removed
 * after success or after a complete rollback. It stays only if the rollback fails.
 */
export async function installPanel({
  configPath,
  panelPath,
  artifactPath,
  verifyUrl,
  backupRoot = tmpdir(),
  write = atomicWrite,
  verify = verifyPanel,
}) {
  const config = readConfig(configPath);
  const artifact = readFileSync(artifactPath);
  if (!artifact.includes(Buffer.from('<html')) || !artifact.includes(Buffer.from('</html>'))) {
    throw new Error('Build artifact is not a complete HTML document.');
  }
  const originalPanel = readFileSync(panelPath);
  const panelMode = statSync(panelPath).mode & 0o777;
  const configMode = statSync(configPath).mode & 0o777;
  const previousSettings = Object.fromEntries(
    settingKeys.map((key) => [key, config.getIn(['management', key]) ?? null])
  );
  config.setIn(['management', 'disable-auto-update-panel'], true);
  config.setIn(['management', 'disable-control-panel'], false);
  const backup = mkdtempSync(resolve(backupRoot, 'cliproxy-panel-'));
  writeFileSync(resolve(backup, 'config.yaml'), readFileSync(configPath), { mode: 0o600 });
  writeFileSync(resolve(backup, 'management.html'), originalPanel, { mode: 0o600 });
  let configWritten = false;
  let panelWritten = false;
  try {
    write(configPath, config.toString(), configMode);
    configWritten = true;
    write(panelPath, artifact, panelMode);
    panelWritten = true;
    const port = config.getIn(['server', 'port']) ?? 8317;
    const protocol = config.getIn(['server', 'tls', 'enable']) ? 'https' : 'http';
    await verify(verifyUrl ?? `${protocol}://127.0.0.1:${port}/management.html`, hash(artifact));
  } catch (error) {
    const failures = [];
    if (panelWritten) {
      try {
        atomicWrite(panelPath, originalPanel, panelMode);
      } catch {
        failures.push('panel');
      }
    }
    if (configWritten) {
      try {
        restoreSettings(configPath, previousSettings);
      } catch {
        failures.push('panel settings');
      }
    }
    if (failures.length) {
      throw new Error(
        `Installation failed; could not restore ${failures.join(' and ')}. Backup: ${backup}`
      );
    }
    rmSync(backup, { recursive: true, force: true });
    throw new Error(`Installation failed; previous panel and settings restored. ${error.message}`);
  }
  rmSync(backup, { recursive: true, force: true });
}
