#!/usr/bin/env sh
set -eu

script_dir=$(CDPATH='' cd -- "$(dirname -- "$0")" && pwd)
file="$script_dir/../docs/typescript-policy.md"

if [ ! -f "$file" ]; then
  printf 'missing TypeScript policy doc: %s\n' "$file" >&2
  exit 1
fi

check() {
  pattern="$1"
  if ! grep -Fq "$pattern" "$file"; then
    printf 'missing required TypeScript policy content: %s\n' "$pattern" >&2
    exit 1
  fi
}

check "TypeScript Usage Policy"
check "browser-first"
check "apps/web/"
check "packages/runtime/"
check "packages/shared/"
check "ES modules"
check "CommonJS"
check "strict"
check "ts-ignore"
check "namespace"
check "const enum"

printf 'TypeScript policy check passed\n'
