#!/usr/bin/env sh
set -eu

script_dir=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)
doc="$script_dir/../docs/repo-boundaries.md"
readme="$script_dir/../README.md"

check_doc() {
  pattern="$1"
  if ! grep -Fq "$pattern" "$doc"; then
    printf 'missing required repo-boundary content: %s\n' "$pattern" >&2
    exit 1
  fi
}

check_readme() {
  pattern="$1"
  if ! grep -Fq "$pattern" "$readme"; then
    printf 'missing README repo-layout pointer: %s\n' "$pattern" >&2
    exit 1
  fi
}

check_doc "Repository Boundaries and Package Ownership"
check_doc "apps/"
check_doc "packages/runtime/"
check_doc "packages/shared/"
check_doc "content/packs/"
check_doc "apps/web/"
check_doc '`packages/runtime/` may import from `packages/shared/`'
check_doc '`content/` should not import application code at all'
check_doc "engine must not embed lesson content directly"
check_doc "new mod pack"
check_readme "docs/repo-boundaries.md"

printf 'repo-boundaries check passed\n'
