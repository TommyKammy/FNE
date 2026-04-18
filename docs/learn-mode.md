# Learn Mode

## Status
Proposed

## Purpose
Define the first-exposure learner flow for Learn Mode so implementation can sequence prompts, cues, feedback, and completion rules without making pack-specific product decisions.

## Mode Role

- Learn Mode is the low-pressure mode used for first exposure to a vocabulary item.
- It teaches one item at a time with a guided prompt, not a surprise recall test.
- The mode stays independent from any specific content pack and only assumes each item can supply an image, pronunciation audio, and learner-facing text fields through the canonical content schemas.

## Learner Flow

1. The stage loads the next vocabulary item and resets any per-item streak or judgment state.
2. Learn Mode starts with an attention cue so the learner knows a new item is about to begin.
3. The image appears first as the primary meaning cue.
4. The pronunciation audio plays immediately after the image is visible, or at the same moment if the implementation cannot separate them cleanly.
5. The English term appears only after the learner has had a short first look at the image and heard the pronunciation once.
6. The learner is prompted to respond on a simple confirmation beat or tap after the guided reveal.
7. The mode judges the response with a forgiving timing rule and then gives immediate feedback.
8. A successful response triggers a short reinforcement moment that repeats the same image and pronunciation once more with minimal confirmation before the mode advances.
9. If the learner misses the response, the same item repeats with the same reveal order and an extra supportive cue before advancing.
10. After the learner completes the required response for the item, the stage advances to the next item or to the end-of-stage summary.

## Presentation Timeline

- Image timing: show the image first and keep it visible for the rest of the item step.
- Pronunciation timing: play pronunciation audio on first reveal before the text answer is shown.
- Text timing: do not show the English term until after the first image-plus-audio exposure.
- Optional meaning text, if shown at all, should appear only in feedback or recap moments and must not replace the image-first reveal.
- The cue order is image, then pronunciation, then text, then response prompt.
- Learn Mode should use short waits so the learner is never left guessing whether the game is waiting for input or still teaching the item.

## Timing Cues

- The new-item attention cue should be brief and consistent.
- The gap between image reveal and pronunciation should be short enough that both cues read as one teaching moment.
- The gap before the response prompt should give the learner time to hear the word once and orient to the image before acting.
- Feedback should arrive immediately after the learner response so the cause-and-effect stays obvious.
- The success-side reinforcement moment should stay under 5 seconds so it feels like a clear replay of the learning cue, not a separate recap screen.
- A repeated item should reuse the same cue order with slightly stronger support, such as replaying the pronunciation or visually emphasizing the image, instead of introducing a new rule.

## Learner Feedback

- A successful response should confirm that the learner matched the cue correctly, with positive audiovisual feedback and no extra explanation wall.
- That successful response should be followed by a short reinforcement moment that repeats the same image and pronunciation once more, paired with minimal confirmation instead of long text.
- A missed or late response should signal that the learner can try again without framing the first exposure as failure.
- Feedback should support first exposure by reinforcing the same item cues rather than hiding them.
- Learn Mode should avoid harsh fail states, score penalties, or progress loss on the first miss for a new item.

## Difficulty Assumptions

- Learn Mode assumes the learner may not know the word yet.
- The mode is intentionally easier than later review-focused modes.
- The hit window should be forgiving enough for beginners because the primary goal is pairing meaning, sound, and term rather than testing strict rhythm accuracy.
- The reveal sequence should minimize reading load by relying on image and pronunciation before text.

## Pass Conditions

- An item counts as passed when the learner completes the guided response after the reveal sequence.
- A first-try success may advance immediately after feedback.
- A miss does not fail the item permanently; it triggers at least one supported repeat of the same item.
- A stage in Learn Mode counts as cleared when every scheduled item has been passed at least once through this guided flow.
- Learn Mode completion should be clear enough for implementation even if the broader stage scoring model changes later.

## Weak-Word Scoring Boundary

- A first-try success is a clean first-pass clear and does not mark the item as weak.
- A supported repeat clears the item for immediate progression but still marks it as a weak word for the current stage.
- Learn Mode should report this supported-repeat outcome explicitly so the review loop can distinguish it from a clean first-pass clear.
- Learn Mode should never treat the first guided miss as a stage failure, but it also should not hide that the item needed support.

## Implementation Boundaries

- Learn Mode defines reveal order, cue timing intent, feedback posture, and pass conditions.
- Learn Mode does not define pack-specific word order, art style, scoring formulas, or unlock rules.
- If a later issue needs stricter timing tiers or adaptive repetition counts, that work should extend this mode spec rather than replacing the image-first first-exposure flow.
