#!/usr/bin/env sh
set -eu

script_dir=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)
doc="$script_dir/../docs/review-loop.md"
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
    printf 'missing required review loop content: %s\n' "$pattern" >&2
    exit 1
  fi
}

check_readme() {
  pattern="$1"
  if ! grep -Fq -- "$pattern" "$readme"; then
    printf 'missing README review loop pointer: %s\n' "$pattern" >&2
    exit 1
  fi
}

check_doc "Review and Weak-Word Loop"
check_doc "Weak Word Entry Criteria"
check_doc "Re-entry Rules"
check_doc "Review Session Behavior"
check_doc "Mode Compatibility"
check_doc "Future Extension Boundary"
check_doc "needs end-of-cycle review"
check_doc "supported repeat in Learn Mode"
check_doc "unresolved target in Listen & Match"
check_doc "Battle Mode stage-ending meter failure"
check_doc "queue weak words only after the stage has offered each scheduled item one first-pass exposure"
check_doc "fresh prompt under that mode's normal rules"
check_doc "closes the first learning cycle cleanly"
check_doc "future spaced repetition layers should extend this same weak-word state"
check_doc "at most two review resurfacing passes in the same stage"
check_doc "can appear no more than twice in the review loop after its first-pass exposure"
check_doc "must move to summary or future follow-up instead of entering a third review resurfacing pass"
check_doc "prioritize weak words by the order their first-pass outcomes marked them weak"
check_doc "supported-repeat and unresolved items share the same review queue"
check_doc "must not let one failure pattern monopolize the limited review slots"
check_doc "when review capacity runs short, every queued weak word should receive its first resurfacing before any item claims a second review resurfacing"
check_readme "docs/review-loop.md"

printf 'Review loop check passed\n'
