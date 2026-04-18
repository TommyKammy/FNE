#!/usr/bin/env sh
set -eu

script_dir=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)
doc="$script_dir/../docs/poc-evaluation-criteria.md"
readme="$script_dir/../README.md"

check_doc() {
  pattern="$1"
  if ! grep -Fq -- "$pattern" "$doc"; then
    printf 'missing required PoC evaluation criteria content: %s\n' "$pattern" >&2
    exit 1
  fi
}

check_readme() {
  pattern="$1"
  if ! grep -Fq -- "$pattern" "$readme"; then
    printf 'missing README PoC evaluation criteria pointer: %s\n' "$pattern" >&2
    exit 1
  fi
}

if [ ! -f "$doc" ]; then
  printf 'missing PoC evaluation criteria doc: %s\n' "$doc" >&2
  exit 1
fi

if [ ! -f "$readme" ]; then
  printf 'missing README file: %s\n' "$readme" >&2
  exit 1
fi

check_doc "# PoC Evaluation Criteria for First External Playtests"
check_doc "## Quantitative Success Thresholds"
check_doc "## Qualitative Feedback Collection Path"
check_doc "## Application to a Playable Build"
check_doc "one end-to-end learner loop from entry to completion"
check_doc "Apply privacy constraints to every playtest notes record:"
check_doc "do not record names, exact ages, birthdates, contact details, school names, classroom identifiers, or precise locations"
check_doc "raw notes review-scoped with limited reviewer access"
check_doc "build scores 5 of 5"
check_doc "build scores 4 of 5, the missed check is not the end-to-end completion gate"
check_doc "under 30 seconds"
check_doc "playtest notes"
check_doc "what is playable now, what is observable now, and what is intentionally deferred"
check_readme "docs/poc-evaluation-criteria.md"

printf 'PoC evaluation criteria check passed\n'
