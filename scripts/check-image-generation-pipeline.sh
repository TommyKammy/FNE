#!/usr/bin/env sh
set -eu

script_dir=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)
doc="$script_dir/../docs/image-generation-pipeline.md"
readme="$script_dir/../README.md"

check_doc() {
  pattern="$1"
  if ! grep -Fq -- "$pattern" "$doc"; then
    printf 'missing required image generation pipeline content: %s\n' "$pattern" >&2
    exit 1
  fi
}

check_readme() {
  pattern="$1"
  if ! grep -Fq -- "$pattern" "$readme"; then
    printf 'missing README image generation pipeline pointer: %s\n' "$pattern" >&2
    exit 1
  fi
}

if [ ! -f "$doc" ]; then
  printf 'missing image generation pipeline doc: %s\n' "$doc" >&2
  exit 1
fi

check_doc "Image Generation Pipeline"
check_doc "Prompt Template"
check_doc "Style Contract"
check_doc "Asset Naming and Handoff"
check_doc "Generation Steps"
check_doc "Validation and Review"
check_doc "{{term}}"
check_doc "{{meaning}}"
check_doc "{{notes}}"
check_doc "imageAssetId"
check_doc "docs/asset-conventions.md"
check_doc "consistent and valid"
check_doc "Use \`notes\` only as optional editorial guidance"
check_readme "docs/image-generation-pipeline.md"

printf 'image generation pipeline check passed\n'
