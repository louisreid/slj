/**
 * Verify every in-text [n] footnote link resolves to a back-matter heading.
 *
 * Run: pnpm tsx scripts/check-footnote-links.ts
 */

import * as fs from "fs";
import * as path from "path";
import { INLINE_FOOTNOTE_RE } from "../lib/content/footnotes";

const COURSE_DIR = path.join(process.cwd(), "content", "course");
const REFERENCES_FILE = path.join(COURSE_DIR, "29-references.md");
const BACK_MATTER_HEADING = /^## \[(\d{1,2})\]\s*$/;

function collectInTextMarkers(): Map<number, string[]> {
  const hits = new Map<number, string[]>();
  const files = fs
    .readdirSync(COURSE_DIR)
    .filter((f) => f.endsWith(".md") && f !== "29-references.md")
    .sort();

  for (const file of files) {
    const text = fs.readFileSync(path.join(COURSE_DIR, file), "utf-8");
    for (const match of text.matchAll(INLINE_FOOTNOTE_RE)) {
      const n = Number(match[1]);
      const list = hits.get(n) ?? [];
      list.push(file);
      hits.set(n, list);
    }
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
  const inText = collectInTextMarkers();
  const backMatter = collectBackMatterHeadings();
  const referenced = [...inText.keys()].sort((a, b) => a - b);
  const missing = referenced.filter((n) => !backMatter.has(n));

  console.log(`Checked ${referenced.length} in-text footnote markers.`);

  if (missing.length > 0) {
    console.error("\nMissing back-matter heading for:");
    for (const n of missing) {
      console.error(`  [${n}] in ${[...new Set(inText.get(n) ?? [])].join(", ")}`);
    }
    process.exitCode = 1;
    return;
  }

  console.log("All in-text footnote links have matching ## [n] headings in References.");
}

main();
