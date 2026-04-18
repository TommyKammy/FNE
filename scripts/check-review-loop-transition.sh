#!/usr/bin/env sh
set -eu

script_dir=$(CDPATH='' cd -- "$(dirname -- "$0")" && pwd)
doc="$script_dir/../docs/review-loop-transition.md"
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
    printf 'missing required review loop transition content: %s\n' "$pattern" >&2
    exit 1
  fi
}

check_readme() {
  pattern="$1"
  if ! grep -Fq -- "$pattern" "$readme"; then
    printf 'missing README review loop transition pointer: %s\n' "$pattern" >&2
    exit 1
  fi
}

check_doc "Review Loop Transition to Future Systems"
check_doc "Current V1 Boundary"
check_doc "Persistence Compatibility"
check_doc "Future Spaced Repetition Compatibility"
check_doc "Measurement and Handoff Compatibility"
check_doc "Review Boundary"
check_doc "short in-stage review loop"
check_doc "must not require persistent learner identity"
check_doc "should persist the same weak-word outcomes"
check_doc "same weak-word state"
check_doc "must not reopen or rewrite first-pass mode rules"
check_doc "authoritative gameplay outcome records"
check_doc "single-session browser run"
check_doc "cross-session scheduler"
check_doc "summary or future follow-up"
check_readme "docs/review-loop-transition.md"

printf 'Review loop transition check passed\n'
