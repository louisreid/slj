/**
 * Compare in-text [n] markers in course markdown against ## [n] headings
 * in 29-references.md. Reports orphans and missing back-matter entries.
 *
 * Run: pnpm tsx scripts/audit-footnotes.ts
 */

import * as fs from "fs";
import * as path from "path";

const COURSE_DIR = path.join(process.cwd(), "content", "course");
const REFERENCES_FILE = path.join(COURSE_DIR, "29-references.md");

const IN_TEXT_MARKER = /\[(\d{1,2})\]/g;
const BACK_MATTER_HEADING = /^## \[(\d{1,2})\]\s*$/;

function collectInTextMarkers(filePath: string): Map<number, string[]> {
  const hits = new Map<number, string[]>();
  const fileName = path.basename(filePath);
  if (fileName === "29-references.md") return hits;

  const text = fs.readFileSync(filePath, "utf-8");
  for (const match of text.matchAll(IN_TEXT_MARKER)) {
    const n = Number(match[1]);
    const list = hits.get(n) ?? [];
    list.push(fileName);
    hits.set(n, list);
  }
  return hits;
}

function collectBackMatterHeadings(): Set<number> {
  const text = fs.readFileSync(REFERENCES_FILE, "utf-8");
  const headings = new Set<number>();
  for (const line of text.split(/\r?\n/)) {
    const m = line.match(BACK_MATTER_HEADING);
    if (m) headings.add(Number(m[1]));
  }
  return headings;
}

function main() {
  const files = fs
    .readdirSync(COURSE_DIR)
    .filter((f) => f.endsWith(".md"))
    .sort();

  const inText = new Map<number, string[]>();
  for (const file of files) {
    const fileHits = collectInTextMarkers(path.join(COURSE_DIR, file));
    for (const [n, sources] of fileHits) {
      const merged = inText.get(n) ?? [];
      merged.push(...sources);
      inText.set(n, merged);
    }
  }

  const backMatter = collectBackMatterHeadings();
  const referenced = [...inText.keys()].sort((a, b) => a - b);
  const missingBackMatter = referenced.filter((n) => !backMatter.has(n));
  const unusedBackMatter = [...backMatter]
    .filter((n) => !inText.has(n))
    .sort((a, b) => a - b);

  console.log(`In-text markers: ${referenced.length} unique numbers`);
  console.log(`Back-matter headings: ${backMatter.size}`);

  if (missingBackMatter.length > 0) {
    console.warn("\nReferenced in course but missing ## [n] in references:");
    for (const n of missingBackMatter) {
      console.warn(`  [${n}] in ${[...new Set(inText.get(n) ?? [])].join(", ")}`);
    }
  }

  if (unusedBackMatter.length > 0) {
    console.warn("\nBack-matter entries with no in-text [n] marker:");
    for (const n of unusedBackMatter) {
      console.warn(`  [${n}]`);
    }
  }

  if (missingBackMatter.length === 0 && unusedBackMatter.length === 0) {
    console.log("Footnote audit passed.");
  } else {
    process.exitCode = 1;
  }
}

main();
