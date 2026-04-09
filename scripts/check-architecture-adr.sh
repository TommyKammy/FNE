#!/usr/bin/env sh
set -eu

script_dir=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)
file="$script_dir/../docs/architecture.md"

check() {
  pattern="$1"
  if ! grep -Fq "$pattern" "$file"; then
    printf 'missing required architecture ADR content: %s\n' "$pattern" >&2
    exit 1
  fi
}

check "Browser-First Stack"
check "Accepted"
check "TypeScript"
check "React"
check "Vite"
check "Phaser"
check "Howler.js"
check "PWA"
check "Unity"
check "Unreal"
check "Native-first app development"
check "React owns"
check "Phaser owns"
check "Howler.js owns"
check "future TypeScript versions"
check "browser-only PoC"

printf 'architecture ADR check passed\n'
