# Learning KPIs

## Status
Proposed

## Purpose
Define the smallest learner-facing KPIs that describe whether the first learning cycle is producing recognition progress or repeated support needs, without inventing a separate mastery system before the runtime exists.

## Source Contracts

- These KPI definitions derive from the outcome boundaries already defined in [docs/learn-mode.md](learn-mode.md), [docs/listen-and-match-mode.md](listen-and-match-mode.md), and [docs/review-loop.md](review-loop.md).
- The KPIs should measure runtime outcomes from a stage run, not authoring metadata, parent-facing account data, or long-term spaced-repetition history.
- The KPI layer should stay descriptive: it summarizes first-attempt recognition outcomes, supported repeats, and weak-word carryover without redefining mode rules.

## Recognition Accuracy

- Recognition accuracy measures how often a learner resolves a scheduled item cleanly on its first recognition opportunity.
- In Learn Mode, count an item as a clean recognition success only when it clears without needing the supported repeat described in the mode contract.
- In Listen & Match Mode, count an item as a clean recognition success only when the learner selects the correct answer on the first try.
- Items resolved only after a supported repeat or retry do not count as clean recognition successes, even if the item later clears in the same stage.
- Suggested stage-level formula:
  `recognition accuracy = clean first-attempt recognition successes / total scheduled recognition opportunities`
- This KPI answers whether the learner recognized the cue immediately, which is different from whether the learner eventually finished the item after help.

## Retry Rate

- Retry rate measures how often the learner needed support beyond the first attempt on a scheduled item.
- In Learn Mode, a supported repeat counts as a retry event because the first guided pass was not enough.
- In Listen & Match Mode, the immediate same-target retry counts as a retry event when the first answer is incorrect.
- A single item should contribute at most one retry event during its first-pass exposure cycle, even if later review passes add more support.
- Suggested stage-level formula:
  `retry rate = scheduled items that needed a supported repeat or retry / total scheduled recognition opportunities`
- This KPI answers how much repetition help the learner needed inside the main pass, which keeps it distinct from clean recognition accuracy.

## Weak Word Frequency

- Weak word frequency measures how often first-pass stage outcomes produce items that must enter the review loop.
- An item becomes a weak word only under the entry criteria already defined in [docs/review-loop.md](review-loop.md).
- In Learn Mode, any item that needed the supported repeat should count toward weak word frequency because the first pass was not clean.
- In Listen & Match Mode, only unresolved targets after the allowed retry should count toward weak word frequency for that mode's first pass.
- When later modes such as Battle Mode participate in the same stage, they should contribute weak words only through their documented unresolved or failed outcome boundary.
- Suggested stage-level formula:
  `weak word frequency = weak words produced per stage run / total scheduled items in the stage`
- This KPI answers how much unfinished recovery work the stage created, which is different from both immediate recognition success and immediate retry demand.

## Measurement Rules

- Measure all three KPIs from the same completed stage snapshot so the numerators and denominators describe one coherent run.
- Use scheduled stage items as the baseline denominator unless a mode explicitly limits the run to a documented subset of those items.
- Do not merge first-pass outcomes and later review-pass outcomes into the same clean-recognition numerator, because that would hide the difference between immediate recognition and eventual recovery.
- Do not infer weak-word status from score totals, summary labels, or future parent-facing projections alone; use the authoritative mode and review outcomes that created the weak-word queue.
- If a stage ends early and does not offer every scheduled item one first-pass exposure, the run should be marked incomplete instead of reporting a full KPI set as if the missing opportunities existed.

## Interpretation Boundary

- Recognition accuracy is the primary signal for immediate learner recognition.
- Retry rate is the primary signal for repetition behavior inside the first-pass learning cycle.
- Weak word frequency is the primary signal for how much unresolved recovery pressure the stage produced for the review loop.
- These metrics intentionally distinguish recognition from repetition behavior: a learner may finish a stage with moderate recognition accuracy, high retry rate, and low unresolved weak-word frequency, which means the learner improved through support rather than through immediate clean recall.
- These KPIs should remain stage-sized and session-sized until later work intentionally adds durable learner history.

## Review Boundary

- Review should confirm that each KPI is measurable from documented mode outcomes without adding new schema requirements.
- Review should confirm that recognition accuracy stays anchored to first-attempt recognition outcomes, retry rate stays anchored to supported repeats or retries, and weak word frequency stays anchored to review-loop entry criteria.
- Review should confirm that the definitions distinguish recognition from repetition behavior instead of collapsing all eventual clears into one success metric.
- Review should compare any implementation proposal against the exact first-pass and weak-word boundaries already defined in Learn Mode and Review and Weak-Word Loop.
