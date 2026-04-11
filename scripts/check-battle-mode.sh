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
check_doc "Chart Readability Plan"
check_doc "Timing Concept"
check_doc "Vocabulary Presentation Cadence"
check_doc "Feedback and Combo"
check_doc "Hit Feel and Sync Contract"
check_doc "First Exposure Feel-Win Plan"
check_doc "Fail State"
check_doc "Implementation Boundaries"
check_doc "four-lane"
check_doc "four-count loop"
check_doc "chart review should inspect note density, groove anchors, and escalation"
check_doc "one rhythmic idea at a time"
check_doc "Groove consistency should come from keeping one anchor pulse"
check_doc "return to a simpler recovery measure"
check_doc "mixing repeated anchors with short call-and-response variations"
check_doc "simplify density first, then syncopation, then lane movement"
check_doc "image and pronunciation preview"
check_doc "combo rises only on judged hits"
check_doc "Combo should pass through readable milestone steps"
check_doc "small early milestone"
check_doc "mid-combo milestone"
check_doc "high-combo milestone"
check_doc "feedback stack should escalate in a controlled order"
check_doc "Scale should rise by tier"
check_doc "Color and brightness may intensify"
check_doc "screen-wide flashes, full-screen color washes, or oversized text bursts should stay out of the core combo loop"
check_doc "strongest combo celebration should resolve in the lane and HUD layers"
check_doc "return to the normal readability baseline"
check_doc "same gameplay tick"
check_doc "same judged hit event"
check_doc "hit confirmation sound"
check_doc "measured against the judged hit moment"
check_doc "Receptor feedback should stay at the receptor"
check_doc "Lane feedback may reinforce the hit path"
check_doc "must not reuse the successful hit flash or sound"
check_doc "single miss should not freeze note scroll"
check_doc "pause the song"
check_doc "force an immediate restart while the meter still has room"
check_doc "Miss feedback should resolve quickly enough"
check_doc "next incoming note remains readable and playable on time"
check_doc "Recovery should come from the very next judged notes"
check_doc "not from a separate interruption, countdown, or modal"
check_doc "first Battle Mode exposure"
check_doc "ultra-simple note patterns"
check_doc "high timing tolerance"
check_doc "guaranteed combo moment"
check_doc "strong audiovisual sync"
check_doc "learner should achieve a visible combo on the first attempt"
check_doc "avoid overwhelm by limiting the opening phrase"
check_doc "drains only on misses, late inputs, or empty measures"
check_doc "Battle Mode baseline review should confirm the hit-feel spec keeps the sync contract explicit"
check_readme "docs/battle-mode.md"

printf 'Battle Mode check passed\n'
