#!/usr/bin/env sh
set -eu

script_dir=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)
doc="$script_dir/../docs/ai-content-generation-contract.md"
readme="$script_dir/../README.md"

check_doc() {
  pattern="$1"
  if ! grep -Fq -- "$pattern" "$doc"; then
    printf 'missing required AI content contract content: %s\n' "$pattern" >&2
    exit 1
  fi
}

check_readme() {
  pattern="$1"
  if ! grep -Fq -- "$pattern" "$readme"; then
    printf 'missing README AI content contract pointer: %s\n' "$pattern" >&2
    exit 1
  fi
}

check_doc "AI Content Generation Contract"
check_doc "Output Contract"
check_doc "Required Output Fields"
check_doc "Optional Output Fields"
check_doc "Validation Rules"
check_doc "Prompting Guidance"
check_doc "The AI output must satisfy docs/vocabulary-item-schema.md exactly."
check_doc "Unknown fields must be rejected."
check_doc "Do not wrap the JSON object in markdown fences."
check_doc '- `id`:'
check_doc '- `term`:'
check_doc '- `meaning`:'
check_doc '- `pronunciation`:'
check_doc '- `imageAssetId`:'
check_doc '- `audioAssetId`:'
check_readme "docs/ai-content-generation-contract.md"

printf 'AI content generation contract check passed\n'
