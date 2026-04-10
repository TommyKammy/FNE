#!/usr/bin/env sh
set -eu

script_dir=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)
doc="$script_dir/../docs/parent-observation.md"
readme="$script_dir/../README.md"

[ -f "$doc" ] || {
  printf 'missing required file: %s\n' "$doc" >&2
  exit 1
}

[ -f "$readme" ] || {
  printf 'missing required file: %s\n' "$readme" >&2
  exit 1
}

check_doc() {
  pattern="$1"
  if ! grep -Fq -- "$pattern" "$doc"; then
    printf 'missing required parent observation content: %s\n' "$pattern" >&2
    exit 1
  fi
}

check_readme() {
  pattern="$1"
  if ! grep -Fq -- "$pattern" "$readme"; then
    printf 'missing README parent observation pointer: %s\n' "$pattern" >&2
    exit 1
  fi
}

check_doc "Parent Observation Features"
check_doc "Candidate v1 Progress Metrics"
check_doc "V1 Planning Scope"
check_doc "Later Product Ideas"
check_doc "Review Boundary"
check_doc "stages started"
check_doc "stages completed"
check_doc "weak words still active"
check_doc "without requiring a parent account"
check_doc "without assuming a backend"
check_doc "child-focused learning loop"
check_readme "docs/parent-observation.md"

printf 'Parent observation check passed\n'
