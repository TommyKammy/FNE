# Pack Assembly Pipeline

## Status
Proposed

## Purpose
Define how a contributor assembles one structurally valid pack from pack-local content inputs without manual stitching in runtime code.

The pipeline stays documentation-first for this planning phase. It specifies the deterministic assembly order that a future script or editor workflow must follow when producing a pack manifest under `content/packs/<pack-id>/`.

## Assembly Inputs

The assembly pipeline starts from pack-local source material:

- vocabulary item records that satisfy [docs/vocabulary-item-schema.md](vocabulary-item-schema.md)
- stage definitions that satisfy [docs/stage-schema.md](stage-schema.md)
- mode definitions referenced by those stages
- asset ids and file layout that follow [docs/asset-conventions.md](asset-conventions.md)
- pack-level metadata such as `id`, `title`, `description`, and optional editorial `notes`

Every input belongs to one pack directory under `content/packs/<pack-id>/`. The assembly step may combine multiple source files, but the output must resolve to one composed pack manifest shape described in [docs/pack-schema.md](pack-schema.md). When inputs are split across files, the assembler must still produce the same manifest bytes for the same pack-local content on every run.

## Source Layout

The exact authoring file split may evolve, but the assembly boundary should stay pack-local and predictable:

```text
content/packs/<pack-id>/
  pack.json
  vocabulary-items.json
  stages.json
  modes.json
  assets/
    images/
    audio/
```

- `pack.json` owns pack-level metadata only.
- `vocabulary-items.json` owns the canonical item records.
- `stages.json` owns stage progression and stage metadata.
- `modes.json` owns reusable mode definitions referenced by stage `modeIds`.
- `assets/` owns pack-local media resolved through the existing asset rules.

The runtime should load the assembled manifest, not stitch these files together ad hoc at screen load time.

## Manifest Generation

Manifest generation should be deterministic:

1. Read `pack.json` and establish the pack `id`, display metadata, and schema version.
2. Read the vocabulary item source and validate each entry against [docs/vocabulary-item-schema.md](vocabulary-item-schema.md).
3. Read the stage source and validate each entry against [docs/stage-schema.md](stage-schema.md).
4. Read the mode source and collect the mode records available to the pack.
5. Compose one manifest object with top-level `schemaVersion`, `id`, `title`, `description`, `vocabularyItems`, `stages`, `modes`, and optional `notes`.
6. Apply one stable merge contract before writing output:
   - Preserve authored order for any array that comes from one source array file.
   - If `vocabularyItems` or `modes` are merged from multiple files, sort the emitted records by `id` ascending using bytewise string comparison.
   - If split sources contribute the same `id` to `vocabularyItems`, `stages`, or `modes`, reject assembly instead of picking a winner implicitly.
   - If a merged record set does not expose `id`, sort first by source file relative path and then by the record's original index inside that file.
7. Write or expose that composed object in the pack shape defined by [docs/pack-schema.md](pack-schema.md).
8. If the manifest is serialized to JSON, write object keys in a stable schema order so unchanged inputs produce byte-identical output across repeated runs.

The generated manifest must remain the single structural contract consumed by loaders and runtime code.

## Stage Assignment

Stage assignment decides which canonical vocabulary items appear in each stage and in what order.

- A stage may reference only vocabulary item ids defined in the same pack's canonical item catalog.
- `vocabularyItemIds` order is the lesson order for that stage and should be preserved during assembly.
- A stage may reuse an item that appeared earlier in the pack, but reuse must happen by id reference instead of duplicating the item record.
- `modeIds` should point to mode records that exist in the same pack assembly output.
- Stage progression order is the array order in `stages`, so assembly should not reorder stages implicitly.
- If stages are authored in one `stages.json` array, preserve that array order exactly.
- If stages are split across multiple files, merge stage files by lexicographic relative path and preserve each file's in-file array order.
- Unlock metadata may reference other stage ids, but those references must stay inside the same assembled pack.

This keeps stage assignment explicit and makes generated packs composable without manual stitching after load.

## Structural Validation

The assembly pipeline should reject a pack before runtime loading if any of these checks fail:

- pack metadata is missing `schemaVersion`, `id`, `title`, or required manifest fields
- any vocabulary item fails the canonical vocabulary item schema
- any stage fails the stage schema
- any stage references a vocabulary item id that does not exist in `vocabularyItems`
- any stage references a mode id that does not exist in `modes`
- any unlock dependency references a stage id that does not exist in the assembled stage list
- any asset id referenced by a vocabulary item does not resolve through the pack-local asset layout
- unknown fields appear in the generated manifest after composition

Structural validation happens at assembly time so generated packs can be composed without manual stitching or hidden runtime repair steps.

## Output Contract

The output of the pipeline is one structurally valid pack manifest:

- it matches [docs/pack-schema.md](pack-schema.md)
- it embeds only canonical vocabulary item objects
- it embeds only valid stage objects
- it keeps stages and modes as pack-local collections
- it is complete enough for a loader to read one file or one assembled object and start stage playback

## Review Expectations

Review of the pack assembly pipeline should confirm:

- a contributor can identify the source inputs required to build one pack
- manifest generation order is clear enough to automate later
- stage assignment rules preserve pack-local ownership and stage order
- the assembled output can be validated against the pack and stage schemas
- a generated pack can be loaded as one composed content bundle without manual stitching in runtime code
