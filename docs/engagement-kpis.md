# Engagement KPIs

## Status
Proposed

## Purpose
Define the smallest engagement signal set that tells us whether the first browser PoC is producing only brief novelty clicks or the start of real repeat practice behavior.

The KPI set should stay narrow enough to review from planning docs alone and measurable from client-observable events in the first implementation pass.

## First 10-Minute Flow Anchor

- The review anchor is the first 10 minutes after the learner takes the launch action from [docs/first-launch-flow.md](first-launch-flow.md).
- That window should cover the first guided success, the first recognition follow-up, and the learner reaching a first Battle Mode exposure if the default stage loop proceeds as planned.
- The KPI definitions should stay compatible with the current stage sequence already implied by [docs/learn-mode.md](learn-mode.md), [docs/listen-and-match-mode.md](listen-and-match-mode.md), [docs/battle-mode.md](battle-mode.md), and [docs/review-loop.md](review-loop.md).
- V1 measurement should assume only timestamped client events from a single-session browser run or a later return session. It should not depend on a no-account system becoming a named learner profile, and it should remain reviewable without assuming a backend.

## Measurement Boundary

- V1 measurement should be possible from a lightweight event log captured in browser storage, console-exportable traces, or other client-owned instrumentation.
- Each KPI must be measurable from client-observable events without requiring identity resolution, cross-device stitching, or parent-facing reporting infrastructure.
- The KPI set should distinguish a one-off tap-through from a learner who chooses to keep practicing, but it should not add score-heavy analytics that override the child-focused loop.
- These definitions may reference a later return session, but they should still be expressible from stable event names and timestamps instead of inferred motivation labels.

## Core Signals

### Session Length

- `session length` measures elapsed time from the launch action that starts gameplay to the earliest durable end-of-session point in that visit.
- The preferred end marker is the last learner action before 60 seconds of inactivity, explicit exit, tab close, or browser refresh.
- A session counts as meaningful first-loop engagement only if it includes the first guided success from Learn Mode; opening the app and leaving before that point should count as a bounce instead of a practiced session.
- For the first 10-minute review pass, report three buckets rather than a single average:
  - `bounce session`: ends before first guided success
  - `single-session completion`: reaches first guided success and at least one later mode transition, but ends before any replay behavior
  - `extended session`: stays active long enough to include replay within the same visit or continued play after the first Battle Mode result
- This signal is measurable from launch, mode-transition, learner-action, and inactivity timestamps without assuming a backend.

### Replay Rate

- `replay rate` measures how often a learner starts another playable loop after completing the first one.
- The numerator should count sessions that trigger a replay within the same visit or start a later return session after a previous completed loop.
- The denominator should count sessions that reached at least the first guided success, because a learner cannot meaningfully replay a loop they never completed once.
- Same-visit replay and later return session replay should be tracked separately because they signal different kinds of engagement:
  - `same-visit replay rate` captures immediate willingness to try another loop while the novelty moment is still fresh
  - `return-session replay rate` captures whether the experience was strong enough for the learner to come back later
- A replay should mean a fresh start of another stage or another full loop, not just re-hearing pronunciation or tapping a support control inside the current item.

### First Battle Replay Intent

- `first Battle replay intent` measures whether the learner chooses to retry or replay after their first Battle Mode result instead of ending the visit immediately.
- The qualifying action is an explicit Battle retry or replay action, or a direct transition into another full stage loop from the post-Battle result state.
- This signal should be captured only after the first Battle Mode exposure has completed or failed cleanly; reaching Battle Mode alone is not enough.
- The signal should be stored as a simple yes or no for each session that reaches the first Battle Mode result:
  - `yes` when the learner selects retry, replay, or another full loop after the first Battle result
  - `no` when the learner exits, becomes inactive, or leaves after the first Battle result without another loop-start action
- This KPI matters because Battle Mode is the first higher-pressure test in the flow. Choosing another attempt after that pressure moment is the clearest early sign that the loop feels motivating instead of exhausting.

## Short Novelty Session Versus Repeat Engagement

- A `short novelty session` is a visit that either bounces before the first guided success or stops after one completed loop with no replay within the same visit and no later return session.
- `repeat engagement` begins when the learner either replays within the same visit after the first completed loop or creates a later return session that completes another loop.
- Session length alone should not define repeat engagement, because a learner can stay open on one tab without actively choosing to continue.
- Replay rate alone should not define novelty, because an extremely short bounce never reaches the decision point where replay is possible.
- First Battle replay intent separates a learner who was willing to continue through the first pressure moment from one who only tolerated the guided novelty of the opening flow.
- The three signals should therefore be reviewed together:
  - session length tells us whether the learner stayed long enough to experience the loop
  - replay rate tells us whether the learner chose another loop
  - first Battle replay intent tells us whether the pressure phase still feels replayable

## V1 Planning Scope

- V1 should name the event boundaries needed for these KPIs, but it should not require a production analytics stack.
- V1 should stay compatible with browser-local logging, manual trace review, or lightweight export during playtests.
- V1 should avoid inferred emotional labels such as `fun`, `frustrated`, or `hooked` unless later research adds a separate qualitative method.
- V1 should not require account creation, cloud sync, or parent dashboards before the KPI definitions count as complete.

## Later Product Ideas

- Later work may add cohort rollups, pack-level comparisons, or trend lines once runtime data contracts and privacy expectations are stable.
- Later work may compare replay behavior across content packs, difficulty curves, or onboarding variants once the base loop is implemented consistently.
- Later work may connect these signals to parent-facing summaries, but only after the learner-facing loop and data boundaries are intentionally expanded.

## Review Boundary

- Review should confirm that each KPI is measurable from client-observable events and timestamps.
- Review should confirm that the definitions distinguish short novelty sessions from repeat engagement instead of collapsing both into one generic usage metric.
- Review should confirm that the KPI set stays anchored to the first 10-minute flow and the first Battle Mode decision point.
- Review should reject KPI definitions that require backend-only identity stitching, undefined mastery models, or parent-account assumptions to function.
