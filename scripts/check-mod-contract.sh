#!/usr/bin/env sh
set -eu

script_dir=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)
doc="$script_dir/../docs/mod-contract.md"
readme="$script_dir/../README.md"

check_doc() {
  pattern="$1"
  if ! grep -Fq -- "$pattern" "$doc"; then
    printf 'missing required mod-contract content: %s\n' "$pattern" >&2
    exit 1
  fi
}

check_readme() {
  pattern="$1"
  if ! grep -Fq -- "$pattern" "$readme"; then
    printf 'missing README mod-contract pointer: %s\n' "$pattern" >&2
    exit 1
  fi
}

check_doc "Mod Contract v1"
check_doc "data-only surface"
check_doc "arbitrary code execution"
check_doc "schemaVersion"
check_doc 'Version `1` is intentionally narrow and data-only.'
check_doc "Reject any mod that requires code execution"
check_doc "enforcement can be implemented without executing mod-provided code"
check_readme "docs/mod-contract.md"

printf 'mod contract check passed\n'
