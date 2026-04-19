import assert from "node:assert/strict";
import { mkdir, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import test from "node:test";

import { ESLint } from "eslint";

test("root lint ignores generated web build artifacts but still lints source files", async () => {
  const generatedFile = path.resolve(
    "apps/web/dist/assets/eslint-generated-regression.js"
  );

  await mkdir(path.dirname(generatedFile), { recursive: true });
  await writeFile(generatedFile, "await Promise.resolve(1);\n");

  try {
    const eslint = new ESLint({ cwd: process.cwd() });
    const results = await eslint.lintFiles(["apps", "packages"]);
    const lintedFiles = new Set(results.map((result) => result.filePath));

    assert.ok(
      lintedFiles.has(path.resolve("packages/shared/src/content.ts")),
      "expected root lint to keep checking real TypeScript source files"
    );
    assert.ok(
      !lintedFiles.has(generatedFile),
      "expected root lint to skip generated apps/web/dist artifacts"
    );
  } finally {
    await rm(generatedFile, { force: true });
  }
});
