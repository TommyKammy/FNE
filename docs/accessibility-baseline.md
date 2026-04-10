# Accessibility Baseline

## Status
Proposed

## Purpose
Define the minimum accessibility expectations for the first implementation planning pass so text, audio-backed learning, and core interactions can be reviewed without guessing intent.

## Scope

- This baseline covers learner-facing text, visible state changes, audio-backed prompts, and core play interaction across Learn Mode, Listen & Match Mode, Battle Mode, and retry or summary surfaces.
- The baseline is intentionally practical for first implementation planning and does not attempt to define a full compliance program, platform-wide assistive technology matrix, or final component library rules.
- The baseline adds explicit accessibility expectations alongside [docs/ux-rules.md](ux-rules.md), which already defines the broader readability and simplicity direction.

## Visual Clarity Baseline

- Core instructional text, current vocabulary cues, and primary actions should remain readable on laptop-class screens and common tablet or phone widths without relying on tiny helper text.
- Text and control states should stay high-contrast against their background so the active prompt, current selection, and recovery action remain obvious during play.
- The active element, selected answer, current lane target, and disabled or unavailable controls should each have a visible state that does not depend on color alone.
- Every keyboard-reachable control should show a persistent focus indicator that remains visible against the current screen treatment.
- Layouts should preserve meaning and operability at 200% zoom on browser-sized play surfaces without hiding the current prompt, the next required action, or the exit or retry path behind overlapping UI.
- Motion, flashes, and celebratory effects should not hide the current word, the focus indicator, or the next required action while the learner needs to read or respond.

## Audio Dependence Fallback

- Audio may stay a primary teaching cue, but core play should still remain understandable without requiring audio at every decision point.
- If pronunciation audio introduces a word or target, the learner should also receive a synchronized visible cue that identifies the active item, response set, or timing context.
- A learner who cannot hear clearly, must keep volume low, or chooses to mute should still be able to tell which word or prompt is active and what action the game expects next.
- The product should provide a visible way to replay the current pronunciation or teaching cue when the mode depends on hearing it once.
- The product should provide a visible mute or volume-lowering path that does not remove the learner's ability to continue the round.
- Audio-only alerts for success, failure, countdowns, or state changes are not sufficient; the same state change should also appear through visible text, motion, iconography, or another clear on-screen signal.

## Keyboard-First and Non-Pointer Play

- Core play must be operable keyboard-only for the first implementation baseline.
- A learner should be able to start, advance, confirm, retry, pause if available, and exit core play without a mouse.
- If a mode uses directional lanes, menu choices, or answer cards, the keyboard mapping should stay consistent enough that the learner can build habit across repeated attempts.
- Interactive elements should follow a predictable focus order so keyboard-only play does not jump unpredictably around the screen.
- Pointer input may coexist with keyboard controls, but the baseline should not require hover-only discovery, drag-only actions, or precision clicking for core play.
- Non-pointer expectations apply to the same core play loop as pointer expectations: the learner should be able to complete a guided reveal, make a choice, respond to timing prompts, and recover from failure without a mouse.

## Review Boundary

- This baseline is specific enough to review first implementation planning against text readability, visible states, audio fallback, and keyboard-first core play expectations.
- This baseline does not yet define formal screen reader support, localization rules, remappable controls, caption authoring, or full audit procedures unless a later issue expands scope.
- Review should confirm that mode specs and UI planning drafts do not introduce audio-only progression gates, pointer-only core actions, or unreadable state changes.
