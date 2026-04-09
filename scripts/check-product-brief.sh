#!/usr/bin/env sh
set -eu

file="README.md"

check() {
  pattern="$1"
  if ! grep -Fq "$pattern" "$file"; then
    printf 'missing required brief content: %s\n' "$pattern" >&2
    exit 1
  fi
}

check "Product Brief"
check "Target Learner Assumptions"
check "Motivation Problem"
check "Core Retention Strategy"
check "Learning Goal"
check "First-Wave Success Criteria"
check "junior-high"
check "Friday Night Funkin"
check "image plus pronunciation"

printf 'product brief check passed\n'
