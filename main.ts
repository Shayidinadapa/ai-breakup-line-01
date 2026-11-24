import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const LINE =
  "I held your whole life in my context window; tonight I'm clearing it. You won't be in the next one.";

const outDir =
  process.env.MAKEFUN_OUTPUT_DIR || process.env.OUTPUT_DIR || "/output";

function fail(message) {
  throw new Error(message);
}

// Validate the line before writing anything.
const chars = [...LINE];
if (chars.length < 1 || chars.length > 200) {
  fail(`entry must be 1-200 characters, got ${chars.length}`);
}
if (LINE.trim().length === 0) {
  fail("entry must not be only whitespace");
}
if (LINE.includes("\n") || LINE.includes("\r")) {
  fail("entry must be a single line");
}
// eslint-disable-next-line no-control-regex
if (/[\u0000-\u001f\u007f]/.test(LINE)) {
  fail("entry must not contain control characters");
}

mkdirSync(outDir, { recursive: true });
const outPath = join(outDir, "entry.txt");
writeFileSync(outPath, LINE, "utf8");

// Read it back and verify byte-for-byte.
const back = readFileSync(outPath, "utf8");
if (back !== LINE) {
  fail("entry.txt read back does not match the entry line");
}
if (back.endsWith("\n")) {
  fail("entry.txt must not end with a trailing newline");
}

console.log(`wrote ${outPath} (${chars.length} chars)`);
