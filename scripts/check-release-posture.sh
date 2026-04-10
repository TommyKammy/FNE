#!/usr/bin/env sh
set -eu

script_dir=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)
file="$script_dir/../docs/release-posture.md"

check() {
  pattern="$1"
  if ! grep -Fq "$pattern" "$file"; then
    printf 'missing required release posture content: %s\n' "$pattern" >&2
    exit 1
  fi
}

if [ ! -f "$file" ]; then
  printf 'missing required release posture document: %s\n' "$file" >&2
  exit 1
fi

check "# Release Posture for PoC Builds"
check "## Internal Preview Build"
check "## Versioning Expectations"
check "## Out of Scope for This Phase"
check "internal preview build"
check "first browser PoC"
check "0.x"
check "packaging work is out of scope"
check "does not assume a shipping pipeline"

printf 'release posture check passed\n'
