# FNE
FNE stands for Friday Night English.

## Repository Layout
The initial monorepo shape is documented in [docs/repo-boundaries.md](docs/repo-boundaries.md).
The planning glossary for shared issue vocabulary lives in [docs/planning-glossary.md](docs/planning-glossary.md).
The TypeScript usage policy lives in [docs/typescript-policy.md](docs/typescript-policy.md).
The draft TypeScript compiler baseline lives in [docs/typescript-baseline.md](docs/typescript-baseline.md).
The TypeScript compatibility review checklist lives in [docs/typescript-review-checklist.md](docs/typescript-review-checklist.md).
The lint and typecheck gate expectations live in [docs/validation-gates.md](docs/validation-gates.md).

## Product Brief
FNE is a rhythm-based vocabulary learning game for junior-high students who struggle with text-only study. It borrows the energy and clear feedback loop of Friday Night Funkin' so practice feels like play instead of a worksheet.

### Target Learner Assumptions
- The learner is in junior high and already knows some English words, but loses them when study depends on reading definitions.
- The learner responds better to fast, visual cues than to dense text explanations.
- The learner is more likely to repeat practice when the activity feels like timing, performance, and progression.

### Motivation Problem
Text-first flashcards force the learner to decode meaning from words before they can remember it. That adds friction, lowers confidence, and makes repetition feel like homework.

### Core Retention Strategy
Each word is taught through an image plus pronunciation. The image gives immediate meaning, and the spoken form anchors the word in memory through sound. Using both together reduces dependence on text and gives the learner two cues to recall later.

### Learning Goal
Help the learner recognize and remember common English vocabulary through short, repeatable rhythm rounds.

### First-Wave Success Criteria
- The learner understands the intended word from the image and pronunciation without needing a long text explanation.
- The learner can complete a short rhythm round and wants to try another one.
- In early playtests, the learner can recall or recognize the word shortly after practice.
- The experience feels like a motivating game loop first, and a study tool second.
