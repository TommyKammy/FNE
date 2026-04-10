#!/usr/bin/env sh
set -eu

script_dir=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)
doc="$script_dir/../docs/learn-mode.md"
readme="$script_dir/../README.md"

check_doc() {
  pattern="$1"
  if ! grep -Fq -- "$pattern" "$doc"; then
    printf 'missing required Learn Mode content: %s\n' "$pattern" >&2
    exit 1
  fi
}

check_readme() {
  pattern="$1"
  if ! grep -Fq -- "$pattern" "$readme"; then
    printf 'missing README Learn Mode pointer: %s\n' "$pattern" >&2
    exit 1
  fi
}

check_doc "Learn Mode"
check_doc "Learner Flow"
check_doc "Presentation Timeline"
check_doc "Timing Cues"
check_doc "Learner Feedback"
check_doc "Difficulty Assumptions"
check_doc "Pass Conditions"
check_doc "independent from any specific content pack"
check_doc "image, then pronunciation, then text, then response prompt"
check_doc "forgiving enough for beginners"
check_doc "miss does not fail the item permanently"
check_doc "every scheduled item has been passed at least once"
check_readme "docs/learn-mode.md"

printf 'Learn Mode check passed\n'
