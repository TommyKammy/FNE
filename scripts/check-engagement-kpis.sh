#!/usr/bin/env sh
set -eu

script_dir=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)
doc="$script_dir/../docs/engagement-kpis.md"
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
    printf 'missing required engagement KPI content: %s\n' "$pattern" >&2
    exit 1
  fi
}

check_readme() {
  pattern="$1"
  if ! grep -Fq -- "$pattern" "$readme"; then
    printf 'missing README engagement KPI pointer: %s\n' "$pattern" >&2
    exit 1
  fi
}

check_doc "Engagement KPIs"
check_doc "Purpose"
check_doc "First 10-Minute Flow Anchor"
check_doc "Core Signals"
check_doc "Session Length"
check_doc "Replay Rate"
check_doc "First Battle Replay Intent"
check_doc "Short Novelty Session Versus Repeat Engagement"
check_doc "Review Boundary"
check_doc "launch action"
check_doc "first guided success"
check_doc "first Battle Mode"
check_doc "measurable from client-observable events"
check_doc "no account system"
check_doc "single-session"
check_doc "return session"
check_doc "replay within the same visit"
check_doc "Battle retry or replay action"
check_doc "without assuming a backend"
check_readme "docs/engagement-kpis.md"

printf 'Engagement KPI check passed\n'
