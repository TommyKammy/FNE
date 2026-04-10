# Issue Template Style

## Purpose
Use these templates for future planning and implementation tickets so issue structure stays consistent, acceptance criteria can be reviewed from diffs alone, and codex-supervisor execution metadata remains easy to parse.

Keep the planning-ticket structure focused on intent, scope, dependencies, and reviewable outcomes. Authors should avoid mixing implementation detail into planning-ticket structure. Implementation approach belongs in later execution notes, comments, commits, or pull requests.

## Epic Template
Use the epic template for a parent issue that defines one reusable slice of work and links the child issues that will deliver it.

Required sections:

- `## Summary` for the user-facing outcome the epic is trying to unlock.
- `## Scope` for what belongs inside the epic boundary.
- `## Child Issues` for the planned implementation tickets that roll up to the epic.
- `## Acceptance Criteria` for the minimum set of reviewable outcomes the epic must satisfy.
- `## Verification` for the review pass that confirms the epic is ready to break into or assess through child tickets.

Epic issues should describe the planning boundary, not the implementation sequence inside each child ticket.

## Child Issue Template
Use the child issue template for one implementation ticket that can be assigned, verified, and closed on its own.

Required metadata lines:

- `Part of:` for the parent epic number.
- `Depends on:` for prerequisite tickets when order matters.
- `Parallelizable:` for whether another ticket can safely proceed at the same time.

Required sections:

- `## Summary` for the single change the ticket makes.
- `## Scope` for the concrete boundary of work that belongs in the ticket.
- `## Acceptance Criteria` for the observable outcomes that must be true after the change.
- `## Verification` for the focused checks or review steps needed to confirm the ticket outcome.

Child issues should stay outcome-first. They can mention required interfaces, files, or documents, but they should not turn into an implementation diary.

## Acceptance Criteria Style
Acceptance criteria must be specific enough to be reviewed from diffs alone.

Use these rules:

- Write each criterion as an observable end state, not as an instruction to perform a task.
- Name the artifact or surface that changes, such as a doc, script, config file, or template.
- Prefer repository language already defined in the planning glossary and validation gates.
- Reuse stable gate names such as `typecheck` and `lint` when the criterion depends on them.
- Avoid vague phrasing like `supports`, `handles`, `improves`, or `works better` unless the diff itself can prove the claim.
- Avoid embedding step-by-step implementation detail in the criterion text.

Good criterion examples:

- `an epic template exists under .github/ISSUE_TEMPLATE with the required planning sections`
- `the child issue template includes Part of, Depends on, and Parallelizable metadata lines`
- `the acceptance criteria guidance says criteria must be reviewable from diffs alone`

Weak criterion examples:

- `implement the template logic`
- `update things as needed`
- `make the planning issues clearer`

## Supervisor Alignment
The template format should stay compatible with codex-supervisor execution metadata expectations.

That means:

- dependency and sequencing fields stay on their own lines
- acceptance criteria remain easy to scan as flat bullets
- verification stays separate from scope and acceptance criteria
- planning structure avoids hiding key metadata inside prose paragraphs

## Reuse Rule
Future issue authors should start from these templates instead of inventing new planning layouts for each ticket. If the project later needs new standard fields, update this document and the template files together.
