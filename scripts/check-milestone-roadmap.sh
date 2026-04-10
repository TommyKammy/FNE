#!/usr/bin/env sh
set -eu

script_dir=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)
file="$script_dir/../docs/milestone-roadmap.md"

check() {
  pattern="$1"
  if ! grep -Fq "$pattern" "$file"; then
    printf 'missing required milestone roadmap content: %s\n' "$pattern" >&2
    exit 1
  fi
}

check "# Milestone Roadmap from Planning Docs to First PoC"
check "## Milestone 1 - Planning Baseline Locked"
check "## Milestone 2 - Content and Runtime Contracts Locked"
check "## Milestone 3 - Learn Mode Vertical Slice Playable"
check "## Milestone 4 - Stage Loop Expansion Ready"
check "## Milestone 5 - Browser PoC Ready for First External Playtest"
check "### Exit Criteria"
check "Learn Mode"
check "Listen & Match Mode"
check "Battle Mode"
check "Parent Observation Features"
check "Validation Gates"
check "Architecture Decision Record: Browser-First Stack"

line_number() {
  pattern="$1"
  grep -nF "$pattern" "$file" | head -n 1 | cut -d: -f1
}

m1=$(line_number "## Milestone 1 - Planning Baseline Locked")
m2=$(line_number "## Milestone 2 - Content and Runtime Contracts Locked")
m3=$(line_number "## Milestone 3 - Learn Mode Vertical Slice Playable")
m4=$(line_number "## Milestone 4 - Stage Loop Expansion Ready")
m5=$(line_number "## Milestone 5 - Browser PoC Ready for First External Playtest")

if [ "$m1" -ge "$m2" ] || [ "$m2" -ge "$m3" ] || [ "$m3" -ge "$m4" ] || [ "$m4" -ge "$m5" ]; then
  printf 'milestone roadmap headings are out of order\n' >&2
  exit 1
fi

exit_count=$(grep -c '^### Exit Criteria$' "$file")
if [ "$exit_count" -ne 5 ]; then
  printf 'expected 5 exit criteria sections, found %s\n' "$exit_count" >&2
  exit 1
fi

printf 'milestone roadmap check passed\n'
