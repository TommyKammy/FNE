# FNE
FNE stands for Friday Night English.

## Repository Layout
The initial monorepo shape is documented in [docs/repo-boundaries.md](docs/repo-boundaries.md).
The planning glossary for shared issue vocabulary lives in [docs/planning-glossary.md](docs/planning-glossary.md).
The issue template style for future epics and implementation tickets lives in [docs/issue-template-style.md](docs/issue-template-style.md).
The staged delivery plan from planning docs to the first browser PoC lives in [docs/milestone-roadmap.md](docs/milestone-roadmap.md).
The PoC-era release posture for internal preview builds lives in [docs/release-posture.md](docs/release-posture.md).
The Learn Mode behavior spec lives in [docs/learn-mode.md](docs/learn-mode.md).
The learning KPI definitions for recognition and repetition signals live in [docs/learning-kpis.md](docs/learning-kpis.md).
The review and weak-word loop spec lives in [docs/review-loop.md](docs/review-loop.md).
The Battle Mode behavior spec lives in [docs/battle-mode.md](docs/battle-mode.md).
The Listen & Match Mode behavior spec lives in [docs/listen-and-match-mode.md](docs/listen-and-match-mode.md).
The parent observation planning spec lives in [docs/parent-observation.md](docs/parent-observation.md).
The engagement KPI planning spec lives in [docs/engagement-kpis.md](docs/engagement-kpis.md).
The metric capture-point map for parent observation and gameplay outcomes lives in [docs/measurement-points.md](docs/measurement-points.md).
The shared visual readability and input simplicity rules live in [docs/ux-rules.md](docs/ux-rules.md).
The practical accessibility baseline lives in [docs/accessibility-baseline.md](docs/accessibility-baseline.md).
The minimal launch-to-play contract lives in [docs/first-launch-flow.md](docs/first-launch-flow.md).
The AI content generation contract lives in [docs/ai-content-generation-contract.md](docs/ai-content-generation-contract.md).
The validation-first generation flow lives in [docs/validation-first-generation-flow.md](docs/validation-first-generation-flow.md).
The image generation pipeline contract lives in [docs/image-generation-pipeline.md](docs/image-generation-pipeline.md).
The audio generation pipeline contract lives in [docs/audio-generation-pipeline.md](docs/audio-generation-pipeline.md).
The canonical vocabulary item schema lives in [docs/vocabulary-item-schema.md](docs/vocabulary-item-schema.md).
The pack schema lives in [docs/pack-schema.md](docs/pack-schema.md).
The stage schema lives in [docs/stage-schema.md](docs/stage-schema.md).
The pack assembly pipeline lives in [docs/pack-assembly-pipeline.md](docs/pack-assembly-pipeline.md).
The mod contract lives in [docs/mod-contract.md](docs/mod-contract.md).
The asset conventions live in [docs/asset-conventions.md](docs/asset-conventions.md).
The QA strategy for content validation and gameplay verification lives in [docs/qa-strategy.md](docs/qa-strategy.md).
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
