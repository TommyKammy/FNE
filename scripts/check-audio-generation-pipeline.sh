#!/usr/bin/env sh
set -eu

script_dir=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)
doc="$script_dir/../docs/audio-generation-pipeline.md"
readme="$script_dir/../README.md"

check_doc() {
  pattern="$1"
  if ! grep -Fq -- "$pattern" "$doc"; then
    printf 'missing required audio generation pipeline content: %s\n' "$pattern" >&2
    exit 1
  fi
}

check_readme() {
  pattern="$1"
  if ! grep -Fq -- "$pattern" "$readme"; then
    printf 'missing README audio generation pipeline pointer: %s\n' "$pattern" >&2
    exit 1
  fi
}

if [ ! -f "$doc" ]; then
  printf 'missing audio generation pipeline doc: %s\n' "$doc" >&2
  exit 1
fi

if [ ! -f "$readme" ]; then
  printf 'missing README: %s\n' "$readme" >&2
  exit 1
fi

check_doc "Audio Generation Pipeline"
check_doc "TTS"
check_doc "Input Fields"
check_doc "Generation Steps"
check_doc "Script Template"
check_doc "{{term}}"
check_doc "{{pronunciation}}"
check_doc "{{audioAssetId}}"
check_doc "Normalization Rules"
check_doc "peak normalization"
check_doc "trailing silence"
check_doc "Asset Naming and Handoff"
check_doc "Validation and Review"
check_doc "short and consistent"
check_doc "docs/asset-conventions.md"
check_doc "docs/vocabulary-item-schema.md"
check_readme "docs/audio-generation-pipeline.md"

printf 'audio generation pipeline check passed\n'
