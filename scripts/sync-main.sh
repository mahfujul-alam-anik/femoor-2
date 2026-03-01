#!/usr/bin/env bash
set -euo pipefail

if ! git remote | rg -q '^origin$'; then
  echo "Error: origin remote is not configured."
  exit 1
fi

current_branch="$(git rev-parse --abbrev-ref HEAD)"
if [[ "$current_branch" == "HEAD" ]]; then
  echo "Error: detached HEAD. Checkout your feature branch first."
  exit 1
fi

echo "Fetching latest main from origin..."
git fetch origin main

echo "Rebasing ${current_branch} onto origin/main..."
git rebase origin/main

echo "Done. If this branch is already on remote, push with:"
echo "  git push --force-with-lease origin ${current_branch}"
