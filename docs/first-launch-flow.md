# First-Launch Flow

## Status
Proposed

## Purpose
Define the minimal learner path from opening the browser app to the first meaningful response so later UI and gameplay work do not reintroduce setup friction.

## Launch Goal

- The learner should be able to reach the first interaction in one action after the app loads.
- The launch path should require no setup, no account creation, no calibration, and no pack or mode selection before play begins.
- The first screen should present a single primary action that moves the learner directly into gameplay.

## Entry Sequence

1. The app opens on a launch surface that explains the immediate goal in plain language and shows one obvious start control.
2. The learner activates that single primary action once and the default first stage begins immediately.
3. The learner lands on the first item without any intermediate menu, setup form, settings screen, or confirmation modal.

This keeps the reviewable step sequence under 3 steps because the learner only needs to load the app and take one action before the first item is active.

## Transition to the First Item

- The default stage should load with the same assumptions every time so first-launch behavior stays predictable for playtests and implementation work.
- The transition should carry the learner directly into gameplay instead of stopping on a mode picker, stage map, or tutorial branch.
- The first item should appear as soon as the stage is ready, with the image-first cue and supporting pronunciation available in the active play surface.
- The learner should be able to tell what to do first before any timing window or answer deadline begins.

## Menu and Setup Constraints

- Settings, profile controls, or content-selection menus should not block the first run.
- If settings are visible on the launch surface, they must stay secondary to the single primary action and must not be required for progression.
- Optional controls needed for accessibility or comfort, such as mute, replay audio, or exit, may appear once play begins as secondary actions.
- Any onboarding copy should stay short enough to support the launch goal instead of becoming a separate reading task.

## Review Boundary

- Review should confirm that the first interaction remains reachable in one action.
- Review should confirm that no setup is required before the learner sees the first item.
- Review should reject launch flows that add branching menus or extra confirmations before core play starts.
