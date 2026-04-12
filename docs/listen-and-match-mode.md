# Listen & Match Mode

## Status
Proposed

## Purpose
Define the pronunciation-first recognition mode so implementation can present answer choices, generate distractors, and resolve retry flow without changing the core content schema.

## Mode Role

- Listen & Match Mode is a pronunciation-first recognition mode used after the learner has already had at least one guided exposure to a word.
- The mode asks the learner to identify a single spoken target from visible choices instead of reproducing spelling from memory.
- It should work as a fast standalone practice loop and as one mode attached to a pack stage.
- The mode stays independent from any specific content pack and only assumes each scheduled vocabulary item can supply its existing image, pronunciation audio, and learner-facing text through the canonical content schemas.

## Core Round Loop

1. The round loads one target vocabulary item and prepares a small answer set before the first prompt is shown.
2. Listen & Match starts by playing the target pronunciation audio as the primary cue for the current prompt.
3. The learner receives a visible response set immediately after the audio starts or as soon as the audio can be heard clearly.
4. The learner selects one choice from the same response set for the current target.
5. The mode judges the selection as correct or incorrect with immediate feedback.
6. A correct answer resolves the round and advances to the next scheduled target or to round-end results.
7. An incorrect answer keeps the target active, applies the retry rule, and gives the learner another chance without replacing the prompt with a different word.

## Choice Presentation

- Each prompt should present one single spoken target and a fixed set of visible choices for that attempt.
- The response set should stay on screen long enough for the learner to compare options without rushing through unreadable swaps.
- Choices may be images, compact text labels, or a combined image-plus-text card, but the set should present the same response set structure for every prompt in the run.
- The target pronunciation may be replayed during the attempt, but replaying it must not reshuffle the visible choices.
- A choice should remain clearly selectable on laptop-class screens and small touch devices without overlapping the rest of the HUD.
- The first browser-first implementation should prefer a small choice count that keeps recognition readable over a larger set that creates visual clutter.

## Distractor Rules

- Distractors should come from other vocabulary items that already exist in the loaded pack or practice pool, not from schema-only placeholder content.
- The response set must contain exactly one correct choice and the remaining choices must be plausible distractors.
- Distractors should be challenging but fair: they should be close enough to require listening, but not so similar that the learner is forced into guesswork.
- Favor distractors that share a broad lesson context, learner familiarity level, or likely confusion pattern with the target instead of unrelated filler words.
- Avoid pairing multiple distractors that are near-duplicates of each other in the same prompt, because that tests interface scanning more than pronunciation recognition.
- If the available pool is too small for ideal distractors, the implementation may reuse previously seen non-target items rather than inventing new content fields or synthetic schema requirements.

## Similarity Selection Rules

- Start from the same loaded pack or practice pool and rank candidate distractors by how likely they are to be mistaken for the target in a quick recognition round.
- Favor candidates that share a broad semantic context with the target, such as common lesson theme, everyday situation, or nearby learner meaning, before considering more distant words.
- Within that relevant pool, prefer distractors that differ from the target along only one or two major recognition axes instead of all axes at once.
- Useful similarity axes include visible form, pronunciation pattern, or likely learner confusion, but no single prompt needs to match on every axis.
- A good distractor set should mix one stronger competitor with one or more clearly related but less dangerous competitors so the learner has to listen carefully without facing a wall of near-clones.
- If two distractors are so close to each other that they mostly compete with one another instead of with the target, replace one of them with a different relevant item.

## Difficulty Control

- Baseline difficulty should stay in the fair-recognition range: the learner should be able to answer by listening carefully after at least one prior exposure, without expert-level vocabulary discrimination.
- Difficulty should rise by narrowing the gap between the target and the best distractor, not by filling the whole set with nearly identical alternatives.
- Easier prompts may use distractors that share broad semantic context but clearly differ in pronunciation or visual identity.
- Harder prompts may use one distractor that is close in sound, image category, or likely confusion pattern, as long as the remaining distractors still preserve a readable choice set.
- The generator should avoid stacking multiple hardest-available distractors in the same prompt unless later product work explicitly introduces a separate hard-mode contract.
- If the pool cannot support a fair hard set, the implementation should fall back to an easier but still relevant distractor mix instead of manufacturing artificial difficulty from weak content.

## Scoring and Retry Behavior

- A correct first selection should count as a clean recognition success for the target.
- An incorrect selection should break any perfect-round streak for the current run, but it should not immediately eject the learner from the mode.
- The first incorrect answer should keep the same response set on screen, mark the miss clearly, and allow one immediate retry on the same target.
- The retry should replay the pronunciation or otherwise restate the same target cue before the learner answers again.
- If the learner answers correctly on the retry, the target counts as completed with reduced credit compared with a first-try success.
- If the learner misses again after the supported retry, the mode should reveal the correct answer, log the target as unresolved for this pass, and move forward instead of trapping the learner in an infinite loop.
- Stage-level scoring may weight first-try clears, retry clears, and unresolved targets differently, but the mode contract must preserve this ordering of outcomes.

## Standalone and Stage Use

- As a standalone practice loop, Listen & Match may queue a short run of targets and summarize first-try clears, retry clears, and unresolved targets at the end.
- As part of a pack stage, the mode should consume the stage's existing `vocabularyItemIds` order or a runtime-selected subset derived from that order.
- The mode should fit stage completion metadata by reporting recognition outcomes upward, without requiring new vocabulary item fields or pack manifest fields.
- A stage may include Listen & Match in its `modeIds` list the same way it includes other modes.
- The mode should remain usable even when a stage mixes it with other modes, because the recognition rules are self-contained and do not depend on a separate authoring schema.

## Implementation Boundaries

- Listen & Match Mode defines choice presentation rules, distractor constraints, and scoring and retry behavior for pronunciation recognition prompts.
- Listen & Match Mode does not define pack-specific word sequencing policy, adaptive mastery tuning, asset style, or final UI art direction.
- The mode can be implemented without changing the core content schema because it reuses the existing vocabulary item cues and stage references.
- If a later issue adds difficulty tiers, adaptive distractor selection, or richer score formulas, that work should extend this spec rather than replace the single spoken target, same response set, and limited retry baseline.
