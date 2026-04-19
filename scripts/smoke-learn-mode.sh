#!/usr/bin/env sh
set -eu

script_dir=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)
repo_root=$(CDPATH= cd -- "$script_dir/.." && pwd)

printf 'Running Learn Mode doc contract check...\n'
"$script_dir/check-learn-mode.sh"

printf 'Running Learn Mode runtime contract tests...\n'
cd "$repo_root"
pnpm --filter @fne/web test -- src/revealRound.test.ts src/learnStage.test.ts
