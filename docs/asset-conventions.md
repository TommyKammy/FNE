# Asset Conventions

## Status
Proposed

## Purpose
Define how pack-local image and audio assets are named, stored, validated, and resolved from vocabulary items.

## Pack-Local Layout

Each pack keeps its own media under a single asset root:

```text
content/packs/<pack-id>/
  manifest.json
  assets/
    images/
    audio/
```

- `manifest.json` contains the pack manifest, including vocabulary items and stage references.
- `assets/images/` stores all pack-local image files.
- `assets/audio/` stores all pack-local pronunciation audio files.

## Naming Conventions

- Asset ids use lowercase kebab-case.
- The file basename must match the asset id exactly.
- Image files use the pattern `<imageAssetId>.<ext>`.
- Audio files use the pattern `<audioAssetId>.<ext>`.
- Do not use spaces, uppercase letters, or underscores in asset ids or file basenames.
- Do not encode size, version, or format in the asset id. If the content changes materially, use a new asset id.

## Supported Formats

### Images

- `png`
- `webp`
- `jpg`
- `jpeg`
- `svg`

Constraints:

- Use lowercase extensions only.
- Prefer `webp` or `png` for raster illustrations.
- Use `svg` for simple icons, shapes, or line art when vector assets are appropriate.
- Use `jpg` or `jpeg` only when the source is photo-like and transparency is not needed.

### Audio

- `mp3`
- `ogg`
- `wav`

Constraints:

- Use lowercase extensions only.
- Prefer `mp3` for the broadest browser support and `ogg` as the fallback companion when possible.
- Keep pronunciation clips short and normalized so the runtime does not need to manage format-specific workarounds.

## Validation Behavior

- Reject the pack if a vocabulary item points at an image or audio asset id that does not exist in the pack-local asset directories.
- Reject the pack if an asset file exists but its extension is not one of the supported formats above.
- Reject the pack if two files in the same asset directory resolve to the same asset id.
- Reject the pack if an asset id or filename contains uppercase letters, spaces, or underscores.
- Missing assets are fatal. The pack or stage should not enter a playable state with unresolved asset references.

## Missing-Asset Failure Behavior

- Loader code should fail fast with a clear error that includes the pack id, the stage id when available, the missing asset id, and the expected path.
- The runtime should not silently substitute placeholder art or placeholder audio.
- The content author should fix the manifest or add the missing file before the pack is considered valid.

## Relationship To Pack And Stage Schema

- `docs/vocabulary-item-schema.md` defines `imageAssetId` and `audioAssetId` as the item-level fields that resolve through this convention.
- `docs/pack-schema.md` owns the vocabulary item catalog and stage list that reference those asset ids.
- `docs/stage-schema.md` only references vocabulary item ids and does not introduce a separate asset lookup rule.
- Asset validation should run alongside pack validation so the pack contract and the asset contract stay in sync.

## Reusability

- A new content pack can copy this layout without changing the runtime contract.
- Future packs should keep the same naming and format rules so shared loaders can remain simple.
- If support for another format is needed later, add it here first and update the pack and item schema docs together.
