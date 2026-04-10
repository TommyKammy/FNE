#!/usr/bin/env sh
set -eu

script_dir=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)
doc="$script_dir/../docs/vocabulary-item-schema.md"
readme="$script_dir/../README.md"

check_doc() {
  pattern="$1"
  if ! grep -Fq "$pattern" "$doc"; then
    printf 'missing required vocabulary schema content: %s\n' "$pattern" >&2
    exit 1
  fi
}

check_readme() {
  pattern="$1"
  if ! grep -Fq "$pattern" "$readme"; then
    printf 'missing README vocabulary-schema pointer: %s\n' "$pattern" >&2
    exit 1
  fi
}

check_doc "Vocabulary Item Schema"
check_doc "canonical JSON schema"
check_doc "Required Fields"
check_doc "Optional Fields"
check_doc "Validation Behavior"
check_doc "Reusability"
check_doc "id"
check_doc "term"
check_doc "meaning"
check_doc "imageAssetId"
check_doc "audioAssetId"
check_doc "Unknown fields are rejected"
check_doc "Reject the item if any required field is missing."
check_readme "docs/vocabulary-item-schema.md"

printf 'vocabulary item schema check passed\n'
