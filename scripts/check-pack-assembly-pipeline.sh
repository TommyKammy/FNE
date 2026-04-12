#!/usr/bin/env sh
set -eu

script_dir=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)
doc="$script_dir/../docs/pack-assembly-pipeline.md"
readme="$script_dir/../README.md"

check_doc() {
  pattern="$1"
  if ! grep -Fq -- "$pattern" "$doc"; then
    printf 'missing required pack assembly pipeline content: %s\n' "$pattern" >&2
    exit 1
  fi
}

check_readme() {
  pattern="$1"
  if ! grep -Fq -- "$pattern" "$readme"; then
    printf 'missing README pack assembly pipeline pointer: %s\n' "$pattern" >&2
    exit 1
  fi
}

if [ ! -f "$doc" ]; then
  printf 'missing pack assembly pipeline doc: %s\n' "$doc" >&2
  exit 1
fi

if [ ! -f "$readme" ]; then
  printf 'missing README file: %s\n' "$readme" >&2
  exit 1
fi

check_doc "Pack Assembly Pipeline"
check_doc "Manifest Generation"
check_doc "Stage Assignment"
check_doc "Assembly Inputs"
check_doc "Structural Validation"
check_doc "without manual stitching"
check_doc "docs/pack-schema.md"
check_doc "docs/stage-schema.md"
check_doc "content/packs/<pack-id>/"
check_readme "docs/pack-assembly-pipeline.md"

printf 'pack assembly pipeline check passed\n'
