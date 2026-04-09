#!/usr/bin/env sh
set -eu

script_dir=$(CDPATH='' cd -- "$(dirname -- "$0")" && pwd)
file="$script_dir/../docs/validation-gates.md"

if [ ! -f "$file" ]; then
  printf 'missing validation gate doc: %s\n' "$file" >&2
  exit 1
fi

check_present() {
  pattern="$1"
  if ! grep -Fq "$pattern" "$file"; then
    printf 'missing required validation gate content: %s\n' "$pattern" >&2
    exit 1
  fi
}

check_present "Validation Gates"
check_present "Typecheck Gate"
check_present "Lint Gate"
check_present "No-Merge Conditions"
check_present "TypeScript hygiene failures"
check_present "future implementation issues"

printf 'Validation gates check passed\n'
