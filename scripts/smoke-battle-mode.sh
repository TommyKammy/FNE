#!/usr/bin/env sh
set -eu

script_dir=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)
repo_root=$(CDPATH= cd -- "$script_dir/.." && pwd)

printf 'Running Battle Mode doc contract check...\n'
"$script_dir/check-battle-mode.sh"

printf 'Running Battle Mode runtime contract tests...\n'
cd "$repo_root"
pnpm --filter @fne/web test -- src/battleStage.test.ts
