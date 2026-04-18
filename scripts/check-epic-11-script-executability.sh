#!/usr/bin/env sh
set -eu

script_dir=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)
repo_root=$(CDPATH= cd -- "$script_dir/.." && pwd)

check_mode() {
  path="$1"
  expected="100755"
  mode=$(git -C "$repo_root" ls-files --stage -- "$path" | awk 'NR==1 { print $1 }')

  if [ -z "$mode" ]; then
    printf 'script is not tracked: %s\n' "$path" >&2
    exit 1
  fi

  if [ "$mode" != "$expected" ]; then
    printf 'unexpected mode for %s: got %s, want %s\n' "$path" "$mode" "$expected" >&2
    exit 1
  fi
}

run_direct() {
  path="$1"
  "$repo_root/$path"
}

check_mode "scripts/check-review-loop.sh"
check_mode "scripts/check-review-loop-transition.sh"

run_direct "scripts/check-review-loop.sh"
run_direct "scripts/check-review-loop-transition.sh"

printf 'Epic 11 script executability check passed\n'
