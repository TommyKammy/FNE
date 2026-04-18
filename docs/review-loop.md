# Review and Weak-Word Loop

## Status
Proposed

## Purpose
Define how incorrect, unresolved, or weak items come back for practice so implementation can resurface them without reopening the Learn Mode, Listen & Match Mode, or Battle Mode contracts.

## Weak Word Entry Criteria

- A weak word is a scheduled vocabulary item that still needs end-of-cycle review because the learner did not show a clean first-pass result.
- A supported repeat in Learn Mode marks the item as weak for the current stage, even if the learner eventually clears the item on that repeat, because the first guided pass was not enough.
- A supported repeat in Learn Mode or Listen & Match retry clear marks the item as weak for the current stage even though the learner advanced, because the first-pass result was not clean.
- An unresolved target in Listen & Match marks the item as weak for the current stage because the learner could not complete the recognition prompt within the mode's allowed retry structure.
- A Battle Mode phrase-weakened result marks the active vocabulary item as weak for the current stage even if the stage continues.
- A failed Battle Mode phrase or stage-ending failure on an active vocabulary item marks that item as weak for the current stage because the learner did not hold the cue successfully in the higher-pressure context.
- A clean first-pass clear in the active mode does not mark the item as weak.
- Weak-word status belongs to the learner's current run outcome, not to permanent pack authoring metadata or a new vocabulary-item schema field.

## Re-entry Rules

- The review loop should queue weak words only after the stage has offered each scheduled item one first-pass exposure in its planned order.
- The first review pass should requeue each weak word once in the order the learner originally weakened it, so the learner sees a short and understandable recovery sequence instead of a reshuffled backlog.
- If a resurfaced weak word is cleared cleanly on its review pass, it leaves the current-stage review queue.
- If a resurfaced weak word still resolves with support, retry reduction, or unresolved status, it may remain in the queue for one more short recovery pass, but the loop should stay finite and should not trap the learner in endless retries.
- When the stage reaches its defined short review limit and some weak words are still unresolved, the stage should mark them for summary or future follow-up rather than silently dropping them.

## Review Session Behavior

- A review session should feel like a continuation of the same stage, not like a separate study screen or menu jump.
- Each resurfaced item should return as a fresh prompt under that mode's normal rules, not as a frozen retry state from the earlier miss.
- Learn Mode resurfacing should reuse the image-first guided flow, but it may shorten nonessential waits because the learner has already seen the item once in the same stage.
- Listen & Match resurfacing should present a normal recognition prompt with a valid distractor set instead of replaying the exact failed tap state.
- Battle Mode resurfacing should return the vocabulary cue through a normal phrase-sized challenge rather than rewinding the entire song or demanding a full-stage restart for one weak word.
- Review results should remain visible in the stage summary so implementation can distinguish clean clears, supported clears, and still-unresolved weak words.

## Mode Compatibility

- This loop should work with existing mode boundaries by consuming outcome signals that the mode specs already imply, not by rewriting those mode rules.
- The review loop should consume the same clean, supported, weakened, or unresolved outcome labels that the active mode reports, so weak-word entry stays explicit instead of being reconstructed from ambiguous miss counters.
- Learn Mode remains the first-exposure mode, while the review loop decides whether an item returns later in the same stage after that first exposure cycle.
- Listen & Match and Battle Mode keep their own retry and failure behavior; the review loop only decides whether unresolved items re-enter practice after the first pass is over.
- Stage and pack schemas do not need new required fields for the baseline loop, because the queue can be built from existing stage item order, mode order, and runtime outcomes.
- The baseline loop closes the first learning cycle cleanly: first exposure happens, weak items are identified, weak items resurface for short recovery, and any leftovers are visible for later systems.

## Future Extension Boundary

- This spec defines the short in-stage review loop only.
- future spaced repetition layers should extend this same weak-word state instead of replacing the current-stage recovery rules with a second incompatible concept.
- Later issues may add durability scoring, cross-session scheduling, or mastery decay, but those systems should treat this loop as the first recovery layer rather than reworking earlier mode specs.
