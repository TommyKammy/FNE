#!/usr/bin/env sh
set -eu

script_dir=$(CDPATH='' cd -- "$(dirname -- "$0")" && pwd)
doc="$script_dir/../docs/issue-template-style.md"
readme="$script_dir/../README.md"
epic_template="$script_dir/../.github/ISSUE_TEMPLATE/epic.md"
child_template="$script_dir/../.github/ISSUE_TEMPLATE/implementation-ticket.md"

check_file() {
  path="$1"
  label="$2"
  if [ ! -f "$path" ]; then
    printf 'missing %s: %s\n' "$label" "$path" >&2
    exit 1
  fi
}

check_contains() {
  path="$1"
  pattern="$2"
  label="$3"
  if ! grep -Fq "$pattern" "$path"; then
    printf 'missing %s content: %s\n' "$label" "$pattern" >&2
    exit 1
  fi
}

check_file "$doc" "issue template style doc"
check_file "$epic_template" "epic issue template"
check_file "$child_template" "child issue template"
check_file "$readme" "README"

check_contains "$doc" "Issue Template Style" "issue template style doc"
check_contains "$doc" "Epic Template" "issue template style doc"
check_contains "$doc" "Child Issue Template" "issue template style doc"
check_contains "$doc" "Acceptance Criteria Style" "issue template style doc"
check_contains "$doc" "reviewed from diffs alone" "issue template style doc"
check_contains "$doc" "codex-supervisor execution metadata" "issue template style doc"
check_contains "$doc" "avoid mixing implementation detail" "issue template style doc"

check_contains "$epic_template" "## Summary" "epic template"
check_contains "$epic_template" "## Scope" "epic template"
check_contains "$epic_template" "## Child Issues" "epic template"
check_contains "$epic_template" "## Acceptance Criteria" "epic template"
check_contains "$epic_template" "## Verification" "epic template"

check_contains "$child_template" "## Summary" "child template"
check_contains "$child_template" "## Scope" "child template"
check_contains "$child_template" "## Acceptance Criteria" "child template"
check_contains "$child_template" "## Verification" "child template"
check_contains "$child_template" "Part of:" "child template"
check_contains "$child_template" "Depends on:" "child template"
check_contains "$child_template" "Parallelizable:" "child template"

check_contains "$readme" "docs/issue-template-style.md" "README"

printf 'Issue template style check passed\n'
