#!/usr/bin/env bash
# Sync the ad-free panel branches with upstream.
#
# Usage:
#   scripts/sync-upstream.sh            Rebase adfree onto origin/main, then local
#                                       onto adfree. Verify both and build local.
#   scripts/sync-upstream.sh --install  Also install the local build into the proxy.
#   scripts/sync-upstream.sh --push     Also force-push adfree and local to fork.
#
# You can use both flags. Set CLIPROXY_CONFIG to use a different proxy config.
# The script stops on a dirty tree, a rebase conflict, or a failed check. After
# you fix a conflict, run `git rebase --continue` and then run the script again.
# git rerere records each fix and uses it again on the next sync.
set -euo pipefail

CONFIG="${CLIPROXY_CONFIG:-$HOME/.local/share/cliproxyapi/cliproxyapi.conf}"

say() { printf '==> %s\n' "$*"; }
die() { printf 'error: %s\n' "$*" >&2; exit 1; }

rebase() {
  local branch=${*: -1}
  say "Rebasing $branch."
  git rebase "$@" || die "The rebase of $branch stopped on a conflict.
Fix the files, run 'git add <file>' and 'git rebase --continue', then run this script again.
To cancel, run 'git rebase --abort'."
}

verify() {
  say "Verifying $1."
  git switch --quiet "$1"
  bun install --frozen-lockfile
  scripts/verify.sh || die "Checks failed on $1."
}

main() {
  local install=0 push=0 arg
  for arg in "$@"; do
    case $arg in
      --install) install=1 ;;
      --push) push=1 ;;
      *) die "Unknown option: $arg. Use --install or --push." ;;
    esac
  done

  cd "$(git rev-parse --show-toplevel)"
  [ -z "$(git status --porcelain)" ] || die "The working tree is not clean."
  for dir in rebase-merge rebase-apply; do
    [ ! -d "$(git rev-parse --git-path "$dir")" ] || die "A rebase is in progress. Finish it first."
  done
  git rev-parse --verify --quiet local >/dev/null || die "The local branch does not exist."

  say "Fetching origin."
  git fetch --quiet origin
  rebase origin/main adfree
  # --fork-point finds the old adfree tip in the adfree reflog, so only the
  # local commits move.
  rebase --fork-point adfree local

  verify adfree
  verify local

  if [ "$install" = 1 ]; then
    say "Installing the local build."
    bun scripts/install-panel.mjs --config "$CONFIG" || die "The install failed."
  fi
  if [ "$push" = 1 ]; then
    say "Pushing adfree and local to fork."
    git push --force-with-lease fork adfree local
  fi
  say "Done. local is at $(git rev-parse --short local) on $(git rev-parse --short origin/main)."
}

# The rebase rewrites this file while it runs. Bash reads this whole line
# before it runs main, and exit stops it from reading the changed file.
main "$@"; exit $?
