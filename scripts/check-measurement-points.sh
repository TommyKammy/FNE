#!/usr/bin/env sh
set -eu

script_dir=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)
doc="$script_dir/../docs/measurement-points.md"
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
    printf 'missing required measurement points content: %s\n' "$pattern" >&2
    exit 1
  fi
}

check_readme() {
  pattern="$1"
  if ! grep -Fq -- "$pattern" "$readme"; then
    printf 'missing README measurement points pointer: %s\n' "$pattern" >&2
    exit 1
  fi
}

check_doc "Measurement Points"
check_doc "KPI Inventory"
check_doc "Capture Principles"
check_doc "KPI-to-Capture Map"
check_doc "Mode Event Map"
check_doc "Review Boundary"
check_doc "stages started"
check_doc "stages completed"
check_doc "weak words still active"
check_doc "clean first-pass items versus supported clears"
check_doc "most recent practice date"
check_doc "stage state changes from ready to active"
check_doc "stage state changes from active to summary-cleared"
check_doc "review queue closes with unresolved weak words still present"
check_doc "capture points must bind to gameplay state changes"
check_doc "Learn Mode"
check_doc "Listen & Match Mode"
check_doc "Battle Mode"
check_doc "Review Loop"
check_doc "mode-entered"
check_doc "mode-completed"
check_doc "mode-failed"
check_readme "docs/measurement-points.md"

printf 'Measurement points check passed\n'
