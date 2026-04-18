# PoC Evaluation Criteria for First External Playtests

## Status
Proposed

## Purpose
Define the evaluation bar that decides whether the first browser PoC is ready to leave internal preview review and enter a first external playtest cycle.

This document turns the existing PoC planning language into an explicit pass/fail rubric. It is meant to be applied to a playable build, not to an architecture sketch or a partial prototype.

## Evaluation Scope

- Use this rubric only for a build that already matches the internal preview build boundary from `docs/release-posture.md`.
- Treat the playable unit as one short learner loop that goes from entry to completion with the current browser-first architecture.
- Keep the evaluation focused on the learner-facing PoC slice and the lightweight observation outputs already planned elsewhere.
- Do not treat packaging, account systems, or later analytics ideas as prerequisites for PoC success.

## Quantitative Success Thresholds

The PoC counts as ready for first external playtests only when all hard gates pass and the build clears the review score threshold.

### Hard Gates

- The build must run one end-to-end learner loop from entry to completion without facilitator-only recovery steps.
- The default first loop must reach visible success feedback in under 30 seconds, consistent with `docs/first-launch-flow.md`.
- The build must make clear what is playable now, what is observable now, and what is intentionally deferred.
- The observation output must stay limited to lightweight stage-result summaries that match `docs/parent-observation.md`.

### Review Score Threshold

Score the playable build against the five review checks below.

The build passes only if at least 4 of 5 checks pass, and the failed check is not the end-to-end loop completion gate.

1. The learner can start the build and enter the first playable stage without facilitator translation of the UI.
2. The learner can complete one end-to-end learner loop from entry to completion.
3. The image, audio, and prompt timing are understandable on first contact.
4. Success, mistake, retry, and completion feedback are readable enough to follow in real time.
5. The round feels like one coherent play session instead of disconnected debug steps.

If the build misses the hard gates or scores below the threshold, fail closed: keep the build in internal preview status and capture the blocker before scheduling a broader playtest.

## Qualitative Feedback Collection Path

Collect qualitative feedback through a lightweight playtest notes record for each session. The notes should be stored with the build identifier so reviewers can compare observations across PoC revisions without inventing a new reporting system.

Each playtest notes record should capture:

- build version or commit identifier
- stage or pack used during the session
- learner profile shorthand relevant to the session, such as age band or prior familiarity
- observer notes for start friction, cue comprehension, response timing, and feedback clarity
- direct learner quotes or short paraphrases about confusion, enjoyment, and motivation to replay
- a final disposition of `pass`, `conditional pass`, or `fail`

Route qualitative findings by boundary instead of mixing them into one generic bucket:

- content comprehension problems go to content QA follow-up
- rules, flow, or feedback problems go to gameplay QA follow-up
- deferred-scope requests stay logged as out-of-scope ideas unless they block the hard gates above

## Application to a Playable Build

Apply this rubric only after the build is actually playable in the PoC sense:

- one end-to-end learner loop from entry to completion is available in the browser
- the build already meets the internal preview definition in `docs/release-posture.md`
- manual reviewers can inspect the learner flow and the lightweight observation output in the same run

Use the outcome in three states:

- `pass`: hard gates pass and the build scores at least 4 of 5
- `conditional pass`: hard gates pass, the build scores 4 of 5, and the remaining miss is minor enough to fix without redefining the PoC scope
- `fail`: any hard gate fails, the build scores below 4 of 5, or the feedback path is too unclear to compare sessions reliably

## Review Notes

- This evaluation bar keeps PoC review tied to a playable build instead of letting subjective enthusiasm replace explicit readiness criteria.
- It preserves the current planning split between hard validation, manual playtest review, and lightweight parent observation outputs.
- It gives later implementation tickets a concrete rubric they can reference when proving that a browser build is ready for first external playtests.
