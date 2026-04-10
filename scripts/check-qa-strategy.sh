#!/usr/bin/env sh
set -eu

script_dir=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)
doc="$script_dir/../docs/qa-strategy.md"
readme="$script_dir/../README.md"

check_doc() {
  pattern="$1"
  if ! grep -Fq -- "$pattern" "$doc"; then
    printf 'missing required QA strategy content: %s\n' "$pattern" >&2
    exit 1
  fi
}

check_readme() {
  pattern="$1"
  if ! grep -Fq -- "$pattern" "$readme"; then
    printf 'missing README QA strategy pointer: %s\n' "$pattern" >&2
    exit 1
  fi
}

if [ ! -f "$doc" ]; then
  printf 'missing QA strategy doc: %s\n' "$doc" >&2
  exit 1
fi

if [ ! -f "$readme" ]; then
  printf 'missing README file: %s\n' "$readme" >&2
  exit 1
fi

check_doc "QA Strategy for Content and Gameplay Logic"
check_doc "Schema Validation for Content Files"
check_doc "Content QA"
check_doc "Gameplay QA"
check_doc "Manual Playtest Expectations"
check_doc "first-playable"
check_doc "asset validity"
check_doc "separate from gameplay logic"
check_doc "planning-stage repo structure"
check_readme "docs/qa-strategy.md"

printf 'QA strategy check passed\n'
