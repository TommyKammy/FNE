#!/usr/bin/env sh
set -eu

script_dir=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)
doc="$script_dir/../docs/first-launch-flow.md"
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
    printf 'missing required first-launch flow content: %s\n' "$pattern" >&2
    exit 1
  fi
}

check_readme() {
  pattern="$1"
  if ! grep -Fq -- "$pattern" "$readme"; then
    printf 'missing README first-launch flow pointer: %s\n' "$pattern" >&2
    exit 1
  fi
}

check_doc "First-Launch Flow"
check_doc "Launch Goal"
check_doc "Entry Sequence"
check_doc "Transition to the First Item"
check_doc "First Success Loop"
check_doc "Learn Mode"
check_doc "one action"
check_doc "no setup"
check_doc "single primary action"
check_doc "directly into gameplay"
check_doc "first item"
check_doc "under 30 seconds"
check_doc "deterministic"
check_doc "success feedback"
check_doc "settings"
check_doc "mute"
check_doc "exit"
check_readme "docs/first-launch-flow.md"

printf 'First-launch flow check passed\n'
