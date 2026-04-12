#!/usr/bin/env sh
set -eu

script_dir=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)
doc="$script_dir/../docs/validation-first-generation-flow.md"
readme="$script_dir/../README.md"

check_doc() {
  pattern="$1"
  if ! grep -Fq -- "$pattern" "$doc"; then
    printf 'missing required validation-first generation flow content: %s\n' "$pattern" >&2
    exit 1
  fi
}

check_readme() {
  pattern="$1"
  if ! grep -Fq -- "$pattern" "$readme"; then
    printf 'missing README validation-first generation flow pointer: %s\n' "$pattern" >&2
    exit 1
  fi
}

if [ ! -f "$doc" ]; then
  printf 'missing validation-first generation flow doc: %s\n' "$doc" >&2
  exit 1
fi

if [ ! -f "$readme" ]; then
  printf 'missing README: %s\n' "$readme" >&2
  exit 1
fi

check_doc "Validation-First Generation Flow"
check_doc "Generation Order"
check_doc "Schema Gate"
check_doc "Asset Gate"
check_doc "Pack Gate"
check_doc "Failure Handling"
check_doc "Playable Handoff"
check_doc "Reject invalid vocabulary item JSON before image or audio generation begins."
check_doc "Reject generated assets that fail review, naming, or format rules before pack assembly continues."
check_doc "Reject the pack before it is treated as playable if schema or asset validation fails."
check_doc "Do not let runtime code repair, substitute, or silently ignore invalid generated content."
check_doc "docs/ai-content-generation-contract.md"
check_doc "docs/image-generation-pipeline.md"
check_doc "docs/audio-generation-pipeline.md"
check_doc "docs/pack-assembly-pipeline.md"
check_doc "docs/qa-strategy.md"
check_readme "docs/validation-first-generation-flow.md"

printf 'validation-first generation flow check passed\n'
