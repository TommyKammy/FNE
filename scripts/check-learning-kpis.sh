#!/usr/bin/env sh
set -eu

script_dir=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)
doc="$script_dir/../docs/learning-kpis.md"
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
    printf 'missing required learning KPI content: %s\n' "$pattern" >&2
    exit 1
  fi
}

check_readme() {
  pattern="$1"
  if ! grep -Fq -- "$pattern" "$readme"; then
    printf 'missing README learning KPI pointer: %s\n' "$pattern" >&2
    exit 1
  fi
}

check_doc "Learning KPIs"
check_doc "Recognition Accuracy"
check_doc "Retry Rate"
check_doc "Weak Word Frequency"
check_doc "Measurement Rules"
check_doc "Review Boundary"
check_doc "first-attempt recognition outcomes"
check_doc "supported repeats"
check_doc "weak words produced per stage run"
check_doc "distinguish recognition from repetition behavior"
check_doc "Learn Mode"
check_doc "Review and Weak-Word Loop"
check_readme "docs/learning-kpis.md"

printf 'Learning KPI check passed\n'
