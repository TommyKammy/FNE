#!/usr/bin/env sh
set -eu

script_dir=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)
doc="$script_dir/../docs/asset-conventions.md"
readme="$script_dir/../README.md"

check_doc() {
  pattern="$1"
  if ! grep -Fq -- "$pattern" "$doc"; then
    printf 'missing required asset convention content: %s\n' "$pattern" >&2
    exit 1
  fi
}

check_readme() {
  pattern="$1"
  if ! grep -Fq -- "$pattern" "$readme"; then
    printf 'missing README asset-convention pointer: %s\n' "$pattern" >&2
    exit 1
  fi
}

check_doc "Asset Conventions"
check_doc "Pack-Local Layout"
check_doc "assets/images/"
check_doc "assets/audio/"
check_doc "lowercase kebab-case"
check_doc "imageAssetId"
check_doc "audioAssetId"
check_doc "png"
check_doc "webp"
check_doc "mp3"
check_doc "ogg"
check_doc "Missing-Asset Failure Behavior"
check_doc "fail fast"
check_doc "docs/pack-schema.md"
check_doc "docs/stage-schema.md"
check_readme "docs/asset-conventions.md"

printf 'asset conventions check passed\n'
