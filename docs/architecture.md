# Architecture Decision Record: Browser-First Stack

## Status
Accepted

## Context
FNE is a rhythm-based vocabulary game for junior-high students. The first version needs to prove the core learning loop quickly, with the lowest possible setup friction for both development and playtesting.

The product will start as a browser app instead of a heavier game-engine or native-client stack. That choice keeps the PoC easy to open, share, and iterate on during early validation.

## Decision
Build the first release with:

- TypeScript for application and gameplay code
- React for menus, onboarding, settings, and other UI around the game loop
- Vite for local development, bundling, and fast rebuilds
- Phaser for the 2D gameplay scene and timing-driven interactions
- Howler.js for audio playback and sound control
- PWA support for installability and offline-friendly caching

## Why browser-first
Browser-first development is the right baseline for this project because it reduces friction in the exact places that matter during early validation:

- No install-heavy runtime is needed to try the game.
- Playtests can happen through a link on common school and personal devices.
- Iteration is fast because UI, game logic, and asset changes can be previewed in the browser immediately.
- The stack stays close to standard web capabilities, which makes it easier to recruit help, debug issues, and ship small improvements.
- PWA support gives us an upgrade path toward app-like behavior without committing to a native wrapper too early.

## Rejected alternatives

### Heavier game engines
Unity, Unreal, and similar engine-first approaches were rejected for the initial baseline.

They are optimized for larger production teams and more complex 3D or cross-platform native packaging needs. For FNE, they would add runtime weight, editor overhead, and a slower iteration loop before the core learning loop has been proven.

### Native-first app development
Native mobile or desktop clients were also rejected for the first pass.

They would increase distribution and maintenance cost without improving the core proof-of-concept: a short, browser-delivered rhythm lesson with audio feedback and visual prompts.

## Role split

- React owns chrome and orchestration around the game, including screens, prompts, progress, and settings.
- Phaser owns the moment-to-moment gameplay scene, timing windows, note flow, and hit detection.
- Howler.js owns sound playback, voice cues, timing-safe audio triggers, and basic volume control.
- Vite owns the dev server and production build pipeline.
- PWA support owns installability, caching, and the ability to revisit the game with less friction.

This split keeps the UI layer separate from the gameplay loop and keeps audio explicit instead of hidden inside a general-purpose engine abstraction.

## TypeScript posture
The codebase should stay on current stable TypeScript while remaining easy to move to TypeScript 7 and later.

Practical rules:

- Keep compiler usage modern and avoid leaning on deprecated or legacy-only flags.
- Prefer explicit public interfaces at React and game boundaries.
- Keep engine-specific code behind small adapters so a future TypeScript upgrade only touches a narrow surface area.
- Treat the compiler as a compatibility signal and update it incrementally, not in large jumps.

## Consequences

- The team can ship a browser-first PoC quickly.
- The architecture stays understandable to contributors who know web development.
- The first release remains focused on proving the learning loop instead of building a general game platform.
- If the product later needs a heavier engine or a native wrapper, that can be introduced after the browser proof has been validated.

## Validation
This decision is considered valid if a browser-only PoC can cover the first game loop with:

- a React UI shell
- a Phaser gameplay scene
- at least one audio cue through Howler.js
- installable or cacheable PWA behavior

