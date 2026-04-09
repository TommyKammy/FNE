#!/usr/bin/env sh
set -eu

script_dir=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)
doc="$script_dir/../docs/planning-glossary.md"
readme="$script_dir/../README.md"

check_doc() {
  pattern="$1"
  if ! grep -Fq "$pattern" "$doc"; then
    printf 'missing required glossary content: %s\n' "$pattern" >&2
    exit 1
  fi
}

check_readme() {
  pattern="$1"
  if ! grep -Fq "$pattern" "$readme"; then
    printf 'missing README glossary pointer: %s\n' "$pattern" >&2
    exit 1
  fi
}

check_doc "Planning Glossary"
check_doc "## Content Terms"
check_doc "## Gameplay Terms"
check_doc "Pack"
check_doc "Stage"
check_doc "Mode"
check_doc "Weak Word"
check_doc "Review Loop"
check_doc "Hit Window"
check_doc "content bundle that ships as one unit"
check_doc "playable slice inside a pack"
check_doc "rule set or presentation profile"
check_doc "word the learner has not yet secured"
check_doc "repeat cycle that brings weak words back into practice"
check_doc "timing range in which an input counts as a successful hit"
check_readme "docs/planning-glossary.md"

printf 'planning glossary check passed\n'
