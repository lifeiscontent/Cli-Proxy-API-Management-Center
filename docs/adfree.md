# Ad-free build

This fork keeps a build of the panel without promotions. Two branches hold it:

- `adfree` is upstream `main` plus a small patch and the fork tools. The patch removes referral links, campaigns, sponsor cards, the sponsor quick-start page, and sponsor placement in the provider list. Every provider stays configurable.
- `local` is `adfree` plus UI changes that are not upstream yet. Build and install this branch.

## How the patch works

The patch does not delete upstream code. It empties the sponsor data where upstream keeps it:

- The affiliate URLs in `src/features/providers/{sponsor,kimi,fennoAI,qiniuCloud,aiCodeMirror}.ts` are empty strings, so no signup link renders. An OAuth provider without a signup URL is not a sponsor, so Kimi shows as two ordinary tiles.
- `SPONSORS` in `src/features/config/sponsors.ts` is empty, so the proxy field shows no recommendation.
- `APIKEY_FUN_QUICK_START_ENABLED` hides the quick-start sidebar link. `/quick-start` goes to AI Providers, which lists APIKEY.FUN with the other providers.
- The provider list shows configured providers first, then the others by name, behind an Add provider control.

The sponsor code stays in the source, so the check looks at the build. `scripts/check-promotions.mjs` scans `dist/index.html`. It fails on a referral parameter, a signup or campaign path, or a host that is not in `scripts/promotion-allowed-hosts.txt`. When upstream adds a new host, find where it comes from. Neutralize it, or add the host to the list if it is not a promotion.

## Sync with upstream

Run this from a clean tree:

```sh
scripts/sync-upstream.sh            # rebase and verify both branches, build local
scripts/sync-upstream.sh --install  # also install the build into the proxy
scripts/sync-upstream.sh --push     # also force-push adfree and local to fork
```

The script fetches `origin`, rebases `adfree` onto `origin/main`, and rebases `local` onto `adfree`. Then it runs `bun install --frozen-lockfile` and `scripts/verify.sh` on each branch. `scripts/verify.sh` runs `bun run verify`, `bun run type-check`, and the promotion scan.

If a rebase stops on a conflict, fix the files, run `git add` and `git rebase --continue`, and run the script again. `git rerere` records each fix, so the same conflict resolves itself next time.

## Install

`--install` runs `bun scripts/install-panel.mjs` with the config at `~/.local/share/cliproxyapi/cliproxyapi.conf`. Set `CLIPROXY_CONFIG` for a different config. You can also run the installer yourself:

```sh
bun scripts/install-panel.mjs --config /path/to/config.yaml [--panel /path/to/management.html]
```

The installer replaces `static/management.html` beside the config and sets `disable-auto-update-panel: true`, so that the proxy does not download the upstream panel again. Then it fetches the live panel and compares its SHA-256 with the build. It does not restart the proxy.

During the install, the installer keeps the previous panel and config in a temporary directory. It deletes the directory when the install passes. If a step fails, it restores the previous panel and panel settings, then deletes the directory. It keeps the directory only if the restore fails, and prints its path. That copy of the config contains credentials. Keep it private.
