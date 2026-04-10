# Visual Readability and Input Simplicity Rules

## Status
Proposed

## Purpose
Define the shared readability, interaction, and recovery rules that keep every FNE mode understandable for a junior-high learner without locking the product to a later UI implementation.

## Scope

- These rules apply to learner-facing surfaces across Learn Mode, Listen & Match Mode, Battle Mode, summary screens, and retry flows.
- The rules should reduce reading load, keep actions obvious, and preserve the browser-first learning loop.
- The rules define product constraints, not final art direction, component libraries, or engine-specific HUD code.

## Visual Readability Rules

- The screen should present one dominant teaching focus at a time so the learner can tell whether the current priority is image recognition, pronunciation, lane timing, choice selection, or recovery.
- Text should stay short, direct, and written for a junior-high learner who may already be splitting attention between reading, audio, and timing.
- Core instructional text and interactive controls should remain high-contrast against their background so they are readable on laptop-class screens and small touch devices.
- The product should prefer persistent layout zones over frequent UI reshuffles so learners are not forced to re-scan the whole screen between prompts.
- Motion should reinforce timing, attention, or outcome state, not decorate the screen with extra movement that competes with the active learning cue.
- Animated effects should pause or soften once the learner needs to read, choose, or recover from a miss.
- When text, image, and audio appear together, the image and spoken cue should carry the first teaching moment and text should support rather than replace them.
- Secondary metadata such as streaks, counts, or recap details should stay visually quieter than the current vocabulary cue or current action target.

## Input Simplicity Rules

- Each step should expose a single primary action so the learner does not have to infer which button, lane, or choice matters most.
- If a surface needs secondary actions, there should be no more than two non-primary actions visible at once, and they should be clearly separated from the main task.
- Input expectations should stay consistent inside a mode so the learner can build habit instead of relearning controls every round.
- A prompt should not require simultaneous reading of long text and execution of precise timing on the same beat.
- Choice sets, tap targets, and confirm actions should stay large enough to be selected confidently on common browser devices without precision-pointer assumptions.
- If a mode uses timing input, the learner should still be able to identify the target action before the input window opens.
- Extra configuration, branching menus, or advanced control options should stay outside the core learning loop unless a later issue proves they are necessary.

## Failure and Retry Feedback

- A miss, wrong answer, or interrupted run should explain what happened in plain language or equally clear audiovisual feedback.
- The same recovery moment should also tell the learner what to do next, such as retry now, continue, or return to the previous safe point.
- Failure feedback should avoid blame-heavy phrasing and should frame retry as part of learning rather than punishment.
- Recovery screens should keep the next action obvious and should not hide it behind dense recap text or multiple competing buttons.
- If the learner can retry immediately, the retry path should preserve enough context that the learner still remembers the active word or task.
- If the flow moves on after an unresolved attempt, the product should clearly mark that the item will come back later or that the round is continuing without trapping the learner.

## Cross-Mode Application

- Learn Mode should use these rules to keep reveals readable, response prompts obvious, and supportive repeats calmer than punitive fail states.
- Listen & Match Mode should use these rules to keep the spoken target, visible choice set, and retry state understandable without cluttering the response area.
- Battle Mode should use these rules to protect lane readability, keep the active vocabulary cue visible, and make restart or exit decisions obvious after failure.
- Summary and review surfaces should use the same plain-language and low-clutter approach so the learner does not leave the browser-first learning loop when a mode ends.

## Implementation Boundary

- These rules stay compatible with the browser-first learning loop by describing readability and interaction outcomes instead of prescribing framework, engine, animation library, or component structure.
- Later UI issues may extend typography scales, color tokens, accessibility checks, or mode-specific layouts, but they should preserve these baseline readability and simplicity constraints.
