# Release Posture for PoC Builds

## Intent
This document defines how FNE should talk about release readiness during the proof-of-concept planning phase.

It exists to separate release posture from packaging or distribution work. The goal is to describe what counts as reviewable progress before the project has a shipping pipeline.

## Internal Preview Build
An internal preview build is a team-reviewable build of the first browser PoC.

It is meant for contributors and close project reviewers who need to validate the planned learner loop, inspect stage outcomes, and discuss what remains deferred. An internal preview build is not a public launch, store submission, or promise of broad distribution.

For this project, an internal preview build counts as ready when:

- the first browser PoC can run one end-to-end learner loop from entry to completion
- the build reflects the accepted browser-first architecture and current planning rules
- reviewers can name what is playable now, what is observable now, and what is intentionally deferred
- manual playtest review can happen without inventing packaging or release-channel assumptions

The separate first external playtest bar lives in `docs/poc-evaluation-criteria.md` so build posture and evaluation outcomes stay explicit instead of being inferred from release language alone.

## Versioning Expectations
PoC-era builds should use `0.x` versioning to signal that the project is still validating scope and behavior rather than locking a stable release contract.

Within that range:

- increment the minor version when an internal preview build changes the reviewable learner experience, stage flow, or planning-backed scope in a meaningful way
- increment the patch version for smaller corrections that do not change the intended release posture of the preview
- avoid `1.0` language until the team has agreed on a shipping target, support expectations, and a real release pipeline

The version label should help reviewers compare preview snapshots. It does not assume a shipping pipeline, public rollout process, or long-term compatibility promise yet.

## Out of Scope for This Phase
For this phase, packaging work is out of scope for this release-posture definition.

That means this document does not define:

- installer formats, app-store packaging, or native wrappers
- release-channel automation, staged rollout rules, or submission checklists
- distribution promises for external users beyond the planning distinction between internal preview and later external playtest readiness

## Review Notes
This release posture keeps PoC planning separate from packaging implementation.

It gives the team a shared way to describe internal preview builds and version labels while the project is still proving the first playable browser loop.
