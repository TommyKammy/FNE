#!/usr/bin/env sh
set -eu

script_dir=$(CDPATH='' cd -- "$(dirname -- "$0")" && pwd)
file="$script_dir/../docs/typescript-review-checklist.md"

if [ ! -f "$file" ]; then
  printf 'missing TypeScript review checklist doc: %s\n' "$file" >&2
  exit 1
fi

check_present() {
  pattern="$1"
  if ! grep -Fq "$pattern" "$file"; then
    printf 'missing required TypeScript review checklist content: %s\n' "$pattern" >&2
    exit 1
  fi
}

check_present "TypeScript Compatibility Review Checklist"
check_present "Module Shape"
check_present "Import Hygiene"
check_present "Config Hygiene"
check_present "Asset Loading Hygiene"
check_present "Typing Hygiene"
check_present "ES modules only"
check_present "strict TypeScript settings"
check_present 'No `any`'
check_present "typed loader or manifest"

printf 'TypeScript review checklist check passed\n'
