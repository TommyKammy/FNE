#!/usr/bin/env sh
set -eu

script_dir=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)
doc="$script_dir/../docs/battle-mode.md"

check_doc() {
  pattern="$1"
  if ! grep -Fq -- "$pattern" "$doc"; then
    printf 'missing required beat-pattern rule: %s\n' "$pattern" >&2
    exit 1
  fi
}

check_doc "Beat Pattern Generation Rules"
check_doc "syllable count should set the phrase footprint"
check_doc "One-syllable words should usually map to a single anchor hit"
check_doc "Two-syllable words should usually map to two evenly readable hits"
check_doc "Three-syllable words may use three hits across one measure group"
check_doc "Words with four or more syllables should not force one hit per syllable"
check_doc "cap the learner-facing pattern at four played hits"
check_doc "reuse one of the stronger syllables as the musical anchor"
check_doc "Default beginner Battle Mode tempo should stay in a narrow mid-tempo band"
check_doc "roughly 92 to 116 BPM"
check_doc "Below that band"
check_doc "Above that band"
check_doc "same target word should keep the same base beat identity"
check_doc "density should escalate by adding subdivision or lane variation"
check_doc "readable on first sight and musically aligned to the word cue"

printf 'Beat pattern generation check passed\n'
