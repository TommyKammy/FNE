# Measurement Points

## Status
Proposed

## Purpose
Define where the parent-observation metrics are captured so later runtime and reporting work can derive lightweight summaries from authoritative gameplay outcomes instead of from UI-only counters or post-hoc guesses.

This planning pass does not introduce a backend event pipeline. It identifies the gameplay state changes that should emit or persist the outcome data needed by `docs/parent-observation.md`.

## KPI Inventory

- `stages started`
- `stages completed`
- `weak words still active`
- `clean first-pass items versus supported clears`
- `most recent practice date`

## Capture Principles

- Every capture point must bind to gameplay state changes, not to menu views, draft UI badges, or parent-facing summary text.
- In other words, capture points must bind to gameplay state changes instead of derived presentation layers.
- Capture from the authoritative run or stage lifecycle record that already decides whether a stage, mode, or item advanced, repeated, failed, or reached summary.
- A prompt, item, or stage should emit its metric signal when its state changes, not when a later screen happens to render the result.
- Summary surfaces may aggregate these signals later, but they must not redefine whether a success, failure, or retry happened.
- If a mode retries the same target, the capture point should stay attached to the retry transition and final resolution of that same target instead of inferring a result from a later queue summary.

## KPI-to-Capture Map

- `stages started`
  Capture when the stage state changes from ready to active and the first gameplay-controlled mode begins its first scheduled item or phrase.
  This should be recorded once per stage run, not once per screen visit or mode preview.

- `stages completed`
  Capture when the stage state changes from active to summary-cleared after the planned first pass and any permitted review pass finish without a terminal failure.
  This should stay blocked if the run exits early, returns to menu, or fails in Battle Mode before reaching a cleared summary.

- `weak words still active`
  Capture when the review queue closes with unresolved weak words still present and the stage transitions into summary or follow-up state.
  The metric should come from the authoritative review-loop outcome, not from counting temporary misses before review resolution has finished.

- `clean first-pass items versus supported clears`
  Capture at item-resolution time, using the first-pass outcome recorded by the active mode.
  A clean first-pass clear means the item resolved without a support path.
  A supported clear means the item eventually resolved only after the mode entered a support path such as a Learn Mode repeat or a Listen & Match retry.
  This metric should be assembled from item outcome records, not from a derived summary that guesses why an item took longer.

- `most recent practice date`
  Capture when a stage run first becomes active, because that is the earliest authoritative proof that practice happened.
  If a later implementation stores both timestamp and local date, the parent-facing surface should derive the displayed date from that same stage-start record instead of from summary render time.

## Mode Event Map

### Shared Stage and Mode Lifecycle

- `stage-started`
  Emit when a stage leaves ready state and the first mode takes control.
  This event feeds `stages started` and `most recent practice date`.

- `mode-entered`
  Emit each time control moves into Learn Mode, Listen & Match Mode, Battle Mode, or the Review Loop.
  This event marks a mode transition boundary and helps later review confirm that each KPI is tied to a real gameplay phase.

- `mode-completed`
  Emit when the current mode hands control back with its scheduled work finished.
  This is a success transition for the mode boundary, not automatically a stage completion.

- `mode-failed`
  Emit when the current mode reaches its documented terminal failure state and cannot continue the current stage flow without restart or exit.
  This is the failure-side transition boundary for mode-level reporting.

### Learn Mode

- Emit a first-pass success event when an item resolves on its initial guided response and advances without entering the supported repeat path.
- Emit a support-entered event when the learner misses and the same item repeats with the extra supportive cue.
- Emit a supported-clear event when that repeated item later resolves and advances.
- The support-entered and supported-clear transitions are the authoritative capture points for deciding that the item was not a clean first-pass clear.

### Listen & Match Mode

- Emit a first-pass success event when the learner selects the correct choice before the retry rule activates.
- Emit a retry-entered event when the first incorrect answer keeps the same target active and grants the supported retry.
- Emit a supported-clear event when the learner answers correctly on that retry.
- Emit an unresolved-target event when the learner misses again after the supported retry and the mode reveals the correct answer before moving on.
- The unresolved-target event is a failure event for the item and a weak-word input to the review loop.

### Battle Mode

- Emit a phrase-started event when a vocabulary-owned phrase begins after its preview cue and becomes the active judged sequence.
- Emit a phrase-resolved event when the active vocabulary phrase finishes without draining the performance meter to failure.
- Emit a phrase-weakened event when misses on the active vocabulary phrase mark that item weak even if the full stage continues.
- Emit a stage-failed event when the meter fully empties before chart end.
- `mode-failed` for Battle Mode should be anchored to the stage-failed transition, not to intermediate miss feedback.

### Review Loop

- Emit a weak-word-enqueued event when a first-pass mode outcome marks an item weak for later review.
- Emit a weak-word-resolved event when that resurfaced item leaves the review queue cleanly.
- Emit a weak-word-still-active event when the review loop reaches its short limit and the item remains unresolved.
- The final `weak-word-still-active` set is the authoritative source for `weak words still active`.

## Review Boundary

- Review should confirm that each KPI has at least one explicit capture point anchored to a documented state transition.
- Review should confirm success events, failure events, and mode transitions are all covered across Learn Mode, Listen & Match Mode, Battle Mode, and the Review Loop.
- Review should reject event maps that depend on parent-facing summary text, manual interpretation, or UI render timing instead of the underlying gameplay lifecycle.
- Later implementation work may choose concrete event names or storage shapes, but it should preserve these state-bound capture moments as the authoritative measurement boundary.
