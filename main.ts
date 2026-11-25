// Angry Judge: The Short Rant Contest — entry program.
//
// Writes one short, funny rant about an everyday annoyance to
// /output/entry.txt. The rant is assembled from fixed parts, so both
// grading runs produce exactly the same text. The program checks the
// gate itself before writing: UTF-8 text of 1 to 400 characters,
// not only white space, and a single line (no newline characters).
// After writing it reads the file back and verifies the on-disk
// content matches the rant exactly, so a truncated or failed write
// cannot pass silently.
//
// Run: node main.ts            (writes /output/entry.txt)
//      node main.ts <out-dir>  (local test: writes <out-dir>/entry.txt)

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const MAX_CHARS = 400;

const SETUP =
  "Someone in this office treats the thermostat like a slot machine.";
const ESCALATION =
  "One degree down and the whole floor freezes. One degree up and we are slow-roasting in our shirts.";
const MYSTERY = "Nobody knows who it is. Nobody will admit it.";
const PUNCHLINE =
  "But every afternoon at three the Arctic returns, and I am typing in a winter coat indoors like a hostage writing a ransom note.";

function buildRant(): string {
  return [SETUP, ESCALATION, MYSTERY, PUNCHLINE].join(" ");
}

function main(): void {
  const rant = buildRant();
  // Count Unicode code points; the rant is plain ASCII, so this is the
  // same number the gate counts as characters.
  const length = [...rant].length;
  if (length < 1 || length > MAX_CHARS) {
    throw new Error(`Rant is ${length} characters; the gate needs 1-400.`);
  }
  if (rant.trim().length === 0) {
    throw new Error("Rant is only whitespace; the gate needs real text.");
  }
  if (/[\r\n]/.test(rant)) {
    throw new Error("Rant must be a single line; newlines break the gate.");
  }
  // Every part must contribute real text, and joining must not create
  // accidental double spaces.
  if (/\s{2,}/.test(rant)) {
    throw new Error("Rant contains a double space; check the part joins.");
  }
  const outDir = process.argv[2] ?? "/output";
  mkdirSync(outDir, { recursive: true });
  const outFile = join(outDir, "entry.txt");
  writeFileSync(outFile, rant, "utf8");
  // Post-write verification: what landed on disk must be exactly
  // the rant that passed the gate above.
  const written = readFileSync(outFile, "utf8");
  if (written !== rant) {
    throw new Error("Written entry.txt does not match the verified rant.");
  }
  console.log(`Wrote ${length} characters to ${outFile}`);
}

main();
