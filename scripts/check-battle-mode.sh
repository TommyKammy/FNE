#!/usr/bin/env sh
set -eu

script_dir=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)
doc="$script_dir/../docs/battle-mode.md"
readme="$script_dir/../README.md"

check_doc() {
  pattern="$1"
  if ! grep -Fq -- "$pattern" "$doc"; then
    printf 'missing required Battle Mode content: %s\n' "$pattern" >&2
    exit 1
  fi
}

check_readme() {
  pattern="$1"
  if ! grep -Fq -- "$pattern" "$readme"; then
    printf 'missing README Battle Mode pointer: %s\n' "$pattern" >&2
    exit 1
  fi
}

check_doc "Battle Mode"
check_doc "Lane Layout"
check_doc "Count Structure"
check_doc "Vocabulary Presentation Cadence"
check_doc "Feedback and Combo"
check_doc "First Exposure Feel-Win Plan"
check_doc "Fail State"
check_doc "Implementation Boundaries"
check_doc "four-lane"
check_doc "four-count loop"
check_doc "image and pronunciation preview"
check_doc "combo rises only on judged hits"
check_doc "first Battle Mode exposure"
check_doc "ultra-simple note patterns"
check_doc "high timing tolerance"
check_doc "guaranteed combo moment"
check_doc "strong audiovisual sync"
check_doc "learner should achieve a visible combo on the first attempt"
check_doc "avoid overwhelm by limiting the opening phrase"
check_doc "drains only on misses, late inputs, or empty measures"
check_readme "docs/battle-mode.md"

printf 'Battle Mode check passed\n'
