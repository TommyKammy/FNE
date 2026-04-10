#!/usr/bin/env sh
set -eu

script_dir=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)
pack_doc="$script_dir/../docs/pack-schema.md"
stage_doc="$script_dir/../docs/stage-schema.md"
readme="$script_dir/../README.md"

check_doc() {
  file="$1"
  pattern="$2"
  if ! grep -Fq -- "$pattern" "$file"; then
    printf 'missing required schema content in %s: %s\n' "$file" "$pattern" >&2
    exit 1
  fi
}

check_readme() {
  pattern="$1"
  if ! grep -Fq -- "$pattern" "$readme"; then
    printf 'missing README pack/stage-schema pointer: %s\n' "$pattern" >&2
    exit 1
  fi
}

check_doc "$pack_doc" "Pack Schema"
check_doc "$pack_doc" "Pack Manifest Shape"
check_doc "$pack_doc" "Pack Manifest Fields"
check_doc "$pack_doc" "Stage Collection"
check_doc "$pack_doc" "Mode Collection"
check_doc "$pack_doc" "Compatible with the canonical vocabulary item schema"
check_doc "$pack_doc" "multiple stages"
check_doc "$stage_doc" "Stage Schema"
check_doc "$stage_doc" "Stage Fields"
check_doc "$stage_doc" "Vocabulary Item References"
check_doc "$stage_doc" "Unlock Metadata"
check_doc "$stage_doc" "Pass Metadata"
check_doc "$stage_doc" "stage should reject unknown fields"
check_readme "docs/pack-schema.md"
check_readme "docs/stage-schema.md"

printf 'pack and stage schema check passed\n'
