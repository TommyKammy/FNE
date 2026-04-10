#!/usr/bin/env sh
set -eu

script_dir=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)
doc="$script_dir/../docs/ux-rules.md"
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
    printf 'missing required UX rules content: %s\n' "$pattern" >&2
    exit 1
  fi
}

check_readme() {
  pattern="$1"
  if ! grep -Fq -- "$pattern" "$readme"; then
    printf 'missing README UX rules pointer: %s\n' "$pattern" >&2
    exit 1
  fi
}

check_doc "Visual Readability and Input Simplicity Rules"
check_doc "Visual Readability Rules"
check_doc "Input Simplicity Rules"
check_doc "Failure and Retry Feedback"
check_doc "Cross-Mode Application"
check_doc "Implementation Boundary"
check_doc "junior-high learner"
check_doc "high-contrast"
check_doc "single primary action"
check_doc "no more than two"
check_doc "what happened"
check_doc "what to do next"
check_doc "browser-first learning loop"
check_readme "docs/ux-rules.md"

printf 'UX rules check passed\n'
