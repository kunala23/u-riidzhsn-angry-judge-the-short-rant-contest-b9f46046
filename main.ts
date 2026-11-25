// Angry Judge: The Short Rant Contest — entry program.
//
// Writes one short, funny rant about an everyday annoyance to
// /output/entry.txt. The rant is assembled from fixed parts, so both
// grading runs produce exactly the same text. The program checks the
// gate itself before writing: UTF-8 text of 1 to 400 characters,
// not only white space.
//
// Run: node main.ts            (writes /output/entry.txt)
//      node main.ts <out-dir>  (local test: writes <out-dir>/entry.txt)

import { mkdirSync, writeFileSync } from "node:fs";
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
  const outDir = process.argv[2] ?? "/output";
  mkdirSync(outDir, { recursive: true });
  const outFile = join(outDir, "entry.txt");
  writeFileSync(outFile, rant, "utf8");
  console.log(`Wrote ${length} characters to ${outFile}`);
}

main();
