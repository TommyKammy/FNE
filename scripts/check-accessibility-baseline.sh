#!/usr/bin/env sh
set -eu

script_dir=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)
doc="$script_dir/../docs/accessibility-baseline.md"
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
    printf 'missing required accessibility baseline content: %s\n' "$pattern" >&2
    exit 1
  fi
}

check_readme() {
  pattern="$1"
  if ! grep -Fq -- "$pattern" "$readme"; then
    printf 'missing README accessibility baseline pointer: %s\n' "$pattern" >&2
    exit 1
  fi
}

check_doc "Accessibility Baseline"
check_doc "Visual Clarity Baseline"
check_doc "Audio Dependence Fallback"
check_doc "Keyboard-First and Non-Pointer Play"
check_doc "Review Boundary"
check_doc "focus indicator"
check_doc "200%"
check_doc "mute"
check_doc "replay"
check_doc "without requiring audio"
check_doc "keyboard-only"
check_doc "without a mouse"
check_doc "core play"
check_doc "first implementation planning"
check_readme "docs/accessibility-baseline.md"

printf 'Accessibility baseline check passed\n'
