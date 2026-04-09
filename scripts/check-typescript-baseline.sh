#!/usr/bin/env sh
set -eu

script_dir=$(CDPATH='' cd -- "$(dirname -- "$0")" && pwd)
file="$script_dir/../docs/typescript-baseline.md"

if [ ! -f "$file" ]; then
  printf 'missing TypeScript baseline doc: %s\n' "$file" >&2
  exit 1
fi

check_present() {
  pattern="$1"
  if ! grep -Fq "$pattern" "$file"; then
    printf 'missing required TypeScript baseline content: %s\n' "$pattern" >&2
    exit 1
  fi
}

check_present "TypeScript Baseline"
check_present '`strict: true`'
check_present '`noImplicitOverride: true`'
check_present '`noPropertyAccessFromIndexSignature: true`'
check_present '`exactOptionalPropertyTypes: true`'
check_present "apps/web/"
check_present "packages/runtime/"
check_present "packages/shared/"
check_present "ESM-first"
check_present '`verbatimModuleSyntax: true`'
check_present "moduleResolution"
check_present "future TypeScript"
check_present "Deprecated And Legacy Settings To Avoid"
check_present "Avoid module-shape assumptions that point back to CommonJS"
check_present '`importsNotUsedAsValues`'
check_present '`preserveValueImports`'
check_present '`noImplicitUseStrict`'
check_present '`charset`'
check_present '`target: ES3`'
check_present '`suppressExcessPropertyErrors`'
check_present '`suppressImplicitAnyIndexErrors`'
check_present '`out`'
check_present '`prepend`'

printf 'TypeScript baseline check passed\n'
