import { describe, expect, test } from 'bun:test';
import { mkdirSync, mkdtempSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { resolve } from 'node:path';
import { parse } from 'yaml';
import { atomicWrite, hash, installPanel, verifyPanel } from '../../scripts/panel-installation.mjs';

function fixture() {
  const directory = mkdtempSync(resolve(tmpdir(), 'clean-panel-install-'));
  const configPath = resolve(directory, 'config.yaml');
  const panelPath = resolve(directory, 'management.html');
  const artifactPath = resolve(directory, 'clean.html');
  const backupRoot = resolve(directory, 'backups');
  mkdirSync(backupRoot);
  writeFileSync(
    configPath,
    'config-version: 8\nmanagement:\n  secret-key: fixture-only\n  disable-control-panel: false\nserver:\n  port: 8317\n',
    { mode: 0o600 }
  );
  writeFileSync(panelPath, '<html>Original panel</html>');
  writeFileSync(artifactPath, '<html>Clean panel</html>');
  return { directory, configPath, panelPath, artifactPath, backupRoot };
}

describe('local panel installation', () => {
  test('installs, verifies, and removes the temporary backup', async () => {
    const paths = fixture();
    try {
      await installPanel({
        ...paths,
        verify: async (_url: string, expected: string) => {
          expect(hash(readFileSync(paths.panelPath))).toBe(expected);
        },
      });
      expect(readFileSync(paths.panelPath, 'utf8')).toBe('<html>Clean panel</html>');
      const config = parse(readFileSync(paths.configPath, 'utf8'));
      expect(config.management['disable-auto-update-panel']).toBe(true);
      expect(config.management['secret-key']).toBe('fixture-only');
      expect(readdirSync(paths.backupRoot)).toEqual([]);
    } finally {
      rmSync(paths.directory, { recursive: true, force: true });
    }
  });

  test('rolls settings back when replacing the panel fails', async () => {
    const paths = fixture();
    try {
      await expect(
        installPanel({
          ...paths,
          write: (path: string, value: string, mode: number) => {
            if (path === paths.panelPath) throw new Error('simulated write failure');
            atomicWrite(path, value, mode);
          },
        })
      ).rejects.toThrow('previous panel and settings restored');
      expect(readFileSync(paths.panelPath, 'utf8')).toBe('<html>Original panel</html>');
      expect(
        parse(readFileSync(paths.configPath, 'utf8')).management['disable-auto-update-panel']
      ).toBeUndefined();
      expect(readdirSync(paths.backupRoot)).toEqual([]);
    } finally {
      rmSync(paths.directory, { recursive: true, force: true });
    }
  });

  test('restores both files if live verification fails and keeps unrelated concurrent edits', async () => {
    const paths = fixture();
    try {
      await expect(
        installPanel({
          ...paths,
          verify: async () => {
            writeFileSync(
              paths.configPath,
              readFileSync(paths.configPath, 'utf8').replace('8317', '9000')
            );
            throw new Error('live hash mismatch');
          },
        })
      ).rejects.toThrow('previous panel and settings restored');
      expect(readFileSync(paths.panelPath, 'utf8')).toBe('<html>Original panel</html>');
      const config = parse(readFileSync(paths.configPath, 'utf8'));
      expect(config.server.port).toBe(9000);
      expect(config.management['disable-auto-update-panel']).toBeUndefined();
      expect(config.management['secret-key']).toBe('fixture-only');
    } finally {
      rmSync(paths.directory, { recursive: true, force: true });
    }
  });
});

test('live verification rejects wrong content and non-loopback targets', async () => {
  const server = Bun.serve({
    hostname: '127.0.0.1',
    port: 0,
    fetch: () => new Response('<html>served</html>'),
  });
  try {
    await verifyPanel(server.url.toString(), hash(Buffer.from('<html>served</html>')));
    await expect(
      verifyPanel(server.url.toString(), hash(Buffer.from('different')))
    ).rejects.toThrow('does not match');
    await expect(verifyPanel('https://example.com/management.html', 'irrelevant')).rejects.toThrow(
      'loopback'
    );
  } finally {
    await server.stop(true);
  }
});
