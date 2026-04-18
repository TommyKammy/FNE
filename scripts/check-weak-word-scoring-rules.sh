#!/usr/bin/env sh
set -eu

script_dir=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)
learn_doc="$script_dir/../docs/learn-mode.md"
listen_doc="$script_dir/../docs/listen-and-match-mode.md"
battle_doc="$script_dir/../docs/battle-mode.md"
review_doc="$script_dir/../docs/review-loop.md"

check_file() {
  file="$1"
  [ -f "$file" ] || {
    printf 'missing required file: %s\n' "$file" >&2
    exit 1
  }
}

check_contains() {
  file="$1"
  label="$2"
  pattern="$3"
  if ! grep -Fq -- "$pattern" "$file"; then
    printf 'missing required %s content: %s\n' "$label" "$pattern" >&2
    exit 1
  fi
}

check_file "$learn_doc"
check_file "$listen_doc"
check_file "$battle_doc"
check_file "$review_doc"

check_contains "$learn_doc" "Learn Mode" "Weak-Word Scoring Boundary"
check_contains "$learn_doc" "Learn Mode" "A first-try success is a clean first-pass clear and does not mark the item as weak."
check_contains "$learn_doc" "Learn Mode" "A supported repeat clears the item for immediate progression but still marks it as a weak word for the current stage."

check_contains "$listen_doc" "Listen & Match Mode" "Weak-Word Scoring Boundary"
check_contains "$listen_doc" "Listen & Match Mode" "A correct first selection is a clean first-pass clear and does not mark the target as weak."
check_contains "$listen_doc" "Listen & Match Mode" "A correct retry clears the target with reduced credit but still marks it as a weak word for the current stage."
check_contains "$listen_doc" "Listen & Match Mode" "A second miss after the supported retry marks the target as a weak word and leaves it unresolved for this pass."

check_contains "$battle_doc" "Battle Mode" "Weak-Word Scoring Boundary"
check_contains "$battle_doc" "Battle Mode" "A phrase-resolved result without meter failure is a clean first-pass clear for that active vocabulary item and does not mark it as weak."
check_contains "$battle_doc" "Battle Mode" "A phrase-weakened result marks the active vocabulary item as a weak word even if the stage continues."
check_contains "$battle_doc" "Battle Mode" "A stage-ending meter failure marks the active vocabulary item as a weak word and leaves the stage unresolved."

check_contains "$review_doc" "Review loop" "supported repeat in Learn Mode or Listen & Match retry clear"
check_contains "$review_doc" "Review loop" "Battle Mode phrase-weakened result"
check_contains "$review_doc" "Review loop" "same clean, supported, weakened, or unresolved outcome labels"

printf 'Weak word scoring rules check passed\n'
