#!/usr/bin/env bash
# Verify the ad-free panel: upstream tests, lint, and build, then the type check
# and the promotion scan of the built dist/index.html.
#
# Usage: scripts/verify.sh
set -euo pipefail
cd "$(git rev-parse --show-toplevel)"
bun run verify
bun run type-check
bun scripts/check-promotions.mjs dist/index.html
