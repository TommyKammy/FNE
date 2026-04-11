# Battle Mode

## Status
Proposed

## Purpose
Define the FNF-style competitive rhythm mode so implementation can build lane flow, vocabulary cue timing, and failure handling without reopening the product thesis.

## Mode Role

- Battle Mode is the higher-pressure rhythm mode used after a learner has already seen the vocabulary in a more guided context.
- The mode borrows the presentation energy of a music battle while keeping vocabulary recognition as the point of play rather than pure score chasing.
- The mode stays independent from any specific content pack and only assumes each scheduled item can provide an image, pronunciation audio, and learner-facing text fields through the canonical content schemas.

## Lane Layout

- Battle Mode uses a four-lane layout that stays fixed for the full stage so the learner can build muscle memory.
- Each lane maps to one directional input and one note column; implementation should not reassign lanes mid-song.
- The learner playfield and the opponent presentation may be visually separated, but only the learner lanes need judged input in the first browser-first implementation.
- Lane travel, receptors, and hit feedback should remain readable on laptop-class screens without requiring engine-specific HUD assumptions.

## Count Structure

- Battle Mode runs on a repeating four-count loop that groups note patterns into predictable measures.
- Notes should snap to counts or subdivisions of those counts so the player can feel a stable beat even when vocabulary cues change.
- A stage chart may vary density across measures, but the core teaching rhythm should avoid unreadable burst patterns in the first implementation pass.
- Count readability matters more than advanced syncopation because the mode still supports vocabulary reinforcement, not expert-level rhythm mastery.

## Timing Concept

- Each note has a scheduled hit moment plus a defined hit window around that moment.
- Timing judgment should stay strict enough to reward focus but forgiving enough that the learner can still process the vocabulary cue stream.
- Empty lead-in and cooldown space should be intentional so the learner can recognize when a phrase starts, resolves, or transitions to a new word.
- The first implementation may use a single success window for scoring as long as the surrounding feedback still distinguishes clean streaks from repeated misses.

## Vocabulary Presentation Cadence

- Each new target word starts with an image and pronunciation preview before its heaviest note phrase begins.
- The image and pronunciation preview should land early enough that the learner knows what word is active before they must survive the densest input sequence tied to it.
- The English term may appear as a compact label during or immediately after the preview, but it must not replace the image-first cue.
- A target word should own a short phrase or measure group, then yield cleanly to the next word instead of switching vocabulary every beat.
- If a word repeats in the same stage, reuse the same image and audio identity so the learner recognizes it as reinforcement rather than a new prompt.

## Feedback and Combo

- Judged hits should trigger immediate audiovisual confirmation at the lane receptor and preserve forward momentum.
- Misses or late inputs should produce clear negative feedback without hiding the active vocabulary cue.
- The combo rises only on judged hits and should break on a miss, late input, or other failed judgment.
- Combo feedback should celebrate consistency, but it must not overwhelm the vocabulary image, pronunciation cue, or lane readability.
- Combo should pass through readable milestone steps instead of feeling flat until a single huge celebration.
- A small early milestone should confirm that the learner has started building momentum, a mid-combo milestone should feel measurably stronger, and a high-combo milestone should read as a peak without turning into screen noise.
- The feedback stack should escalate in a controlled order: receptor confirm first, then lane reinforcement, then combo text or count treatment, then any stronger milestone accent.
- Scale should rise by tier, but each tier should stay anchored near the playfield so the learner still reads timing at the receptors before looking anywhere else.
- Color and brightness may intensify at higher combo tiers, but the palette shift should stay inside the established lane and HUD treatment instead of replacing the active vocabulary cue with a new full-screen focal point.
- screen-wide flashes, full-screen color washes, or oversized text bursts should stay out of the core combo loop because they would compete with note reading and vocabulary recognition.
- The strongest combo celebration should resolve in the lane and HUD layers, then return to the normal readability baseline quickly enough that the next phrase is readable on arrival.
- End-of-phrase feedback may summarize streak quality or survival state, but the player should still understand the result beat by beat during play.

## Hit Feel and Sync Contract

- A judged hit should resolve on the same gameplay tick that records the judgment so the player does not feel a detached confirm after the input has already been accepted.
- Receptor flash, lane pulse, hit spark, combo increment, and any meter recovery should all start from the same judged hit event instead of separate delayed timers.
- Any hit confirmation sound should trigger from the same judged hit event as the visual feedback so the learner receives one locked response instead of staggered sound and animation layers.
- Animation and sound sync should be measured against the judged hit moment rather than note spawn, travel interpolation, or delayed HUD updates.
- Receptor feedback should stay at the receptor so the learner reads timing at the target line first, even when other lane or HUD effects are present.
- Lane feedback may reinforce the hit path, but it must fade fast enough that the next incoming note remains readable and the active vocabulary cue is not obscured.
- A miss or failed late input should use a distinct receptor or lane response and must not reuse the successful hit flash or sound.

## First Exposure Feel-Win Plan

- The first Battle Mode exposure for a learner should be authored as a guided confidence beat, not as a full-pressure challenge chart.
- The opening phrase should use ultra-simple note patterns so the learner can map lane motion to the beat before density increases.
- The first implementation should use high timing tolerance for this opening exposure so a near-beat input still feels accepted and synchronized.
- The stage should reserve one guaranteed combo moment early in the chart by presenting a short run of evenly spaced notes that a first-attempt learner can realistically hit in sequence.
- Hit sparks, lane flashes, and audio-backed confirmation should create strong audiovisual sync so successful inputs feel locked to the song instead of delayed or detached.
- The learner should achieve a visible combo on the first attempt before any harsher phrase appears, even if later measures ask for slightly tighter focus.
- The opening phrase should avoid overwhelm by limiting the opening phrase to one active vocabulary cue, one short preview, and one readable measure group before adding any variation.

## Fail State

- Battle Mode uses a visible performance meter that represents whether the learner is holding the round together.
- The meter drains only on misses, late inputs, or empty measures where required notes were not hit.
- Strong play can stabilize or recover the meter, but recovery should be slower than combo gain so failure pressure still feels real.
- A stage fails when the meter fully empties before the chart ends.
- On failure, the mode should offer a fast restart or return path without losing browser-session progress outside the current run.

## Implementation Boundaries

- Battle Mode defines lane count, count structure, vocabulary cue cadence, combo behavior, and fail-state intent.
- Battle Mode does not define pack-specific chart authoring tools, narrative staging, asset style, or final scoring formulas beyond combo and survival expectations.
- The first implementation should remain compatible with the browser-first runtime split in [docs/architecture.md](architecture.md): Phaser owns chart timing and hit detection, while React may own surrounding HUD, prompts, and retry flow.
- Battle Mode baseline review should confirm the hit-feel spec keeps the sync contract explicit for judgment timing, hit confirmation sound, receptor feedback, lane feedback, and animation alignment.
- If a later issue needs opponent AI, multiple judgment tiers, or difficulty variants, that work should extend this spec rather than replace the four-lane, four-count vocabulary battle baseline.
