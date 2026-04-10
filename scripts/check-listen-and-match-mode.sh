#!/usr/bin/env sh
set -eu

script_dir=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)
doc="$script_dir/../docs/listen-and-match-mode.md"
readme="$script_dir/../README.md"

check_doc() {
  pattern="$1"
  if ! grep -Fq -- "$pattern" "$doc"; then
    printf 'missing required Listen & Match Mode content: %s\n' "$pattern" >&2
    exit 1
  fi
}

check_readme() {
  pattern="$1"
  if ! grep -Fq -- "$pattern" "$readme"; then
    printf 'missing README Listen & Match Mode pointer: %s\n' "$pattern" >&2
    exit 1
  fi
}

check_doc "Listen & Match Mode"
check_doc "Mode Role"
check_doc "Choice Presentation"
check_doc "Distractor Rules"
check_doc "Scoring and Retry Behavior"
check_doc "Standalone and Stage Use"
check_doc "Implementation Boundaries"
check_doc "pronunciation-first recognition mode"
check_doc "single spoken target"
check_doc "same response set"
check_doc "challenging but fair"
check_doc "without changing the core content schema"
check_readme "docs/listen-and-match-mode.md"

printf 'Listen & Match Mode check passed\n'
