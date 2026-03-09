/**
 * Generates content/manifest.json with stable block IDs per paragraph/heading.
 * Run: pnpm generate-manifest
 * IDs are stable across builds unless block content changes (content-based hash).
 */

import * as fs from "fs";
import * as path from "path";
import { createHash } from "crypto";

const CONTENT_DIR = path.join(process.cwd(), "content");
const COURSE_DIR = path.join(CONTENT_DIR, "course");
const MANIFEST_PATH = path.join(CONTENT_DIR, "manifest.json");

type BlockType = "heading" | "paragraph";

interface Block {
  block_id: string;
  type: BlockType;
  content: string;
  level?: number;
}

interface Section {
  blocks: Block[];
}

type ChapterMode = "interactive" | "static";

interface Chapter {
  id: string;
  file: string;
  title: string;
  mode: ChapterMode;
  sections: Section[];
}

interface Manifest {
  chapters: Chapter[];
}

function stableBlockId(chapterId: string, content: string): string {
  const hash = createHash("sha256")
    .update(chapterId + "\n" + content)
    .digest("hex")
    .slice(0, 12);
  return `${chapterId}-${hash}`;
}

/** Static = reference-only (no note affordances). Interactive = default for sessions. */
function getChapterMode(chapterId: string, fileName: string): ChapterMode {
  const id = chapterId.toLowerCase();
  const file = fileName.toLowerCase();
  if (id.includes("front-matter") || file.includes("front-matter")) return "static";
  if (id.includes("preface") || file.includes("preface")) return "static";
  if (id.includes("notes") || file.includes("notes")) return "static";
  if (id.includes("reviews") || file.includes("reviews")) return "static";
  if (id.includes("foreword") || file.includes("foreword")) return "static";
  if (id.includes("introduction") || file.includes("introduction")) return "static";
  if (id.includes("further-reading") || file.includes("further-reading")) return "static";
  if (id === "contents" || file.includes("contents")) return "static";
  return "interactive";
}

function isScriptureReferenceLine(text: string): boolean {
  const trimmed = text.trim();
  if (!trimmed) return false;

  // Matches patterns like "Matthew 6:25–33", "1 John 3:17"
  const bookAndRef =
    /^(?:[1-3]\s*)?[A-Za-z]+(?:\s+[A-Za-z]+)*\s+\d{1,3}:\d{1,3}(?:[–-]\d{1,3})?[.)”']?$/u;
  // Matches bare references like "6:25–33" (optionally with punctuation)
  const bareRef = /^\d{1,3}:\d{1,3}(?:[–-]\d{1,3})?[.)”']?$/u;

  return bookAndRef.test(trimmed) || bareRef.test(trimmed);
}

/** If the trimmed line is a standalone uppercase heading, return heading level (1–3). */
function getUppercaseHeadingLevel(trimmed: string): number | null {
  if (trimmed === "" || trimmed !== trimmed.toUpperCase()) return null;
  if (isScriptureReferenceLine(trimmed)) return null;
  if (/^SESSION\s+(ONE|TWO|THREE|FOUR|FIVE|SIX|SEVEN|EIGHT|NINE|TEN)$/i.test(trimmed))
    return 1;
  const upper = trimmed.toUpperCase();
  const h3Markers = [
    "GOALS",
    "READING",
    "DISCUSSION",
    "ACTION",
    "PRAYER",
  ];
  if (h3Markers.includes(upper)) return 3;
  if (upper === "FURTHER READING" || upper.startsWith("FURTHER READING /") || upper.startsWith("FURTHER READING AND"))
    return 3;
  return 2;
}

function parseMarkdownBlocks(md: string): { type: BlockType; level?: number; content: string }[] {
  const blocks: { type: BlockType; level?: number; content: string }[] = [];
  const lines = md.split(/\r?\n/);
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];
    const headingMatch = line.match(/^(#{1,6})\s+(.*)$/);
    if (headingMatch) {
      const level = headingMatch[1].length;
      const content = headingMatch[2].trim();
      if (content && !isScriptureReferenceLine(content)) {
        blocks.push({ type: "heading", level, content });
      } else if (content) {
        // Treat scripture-like lines as paragraph content instead of headings
        blocks.push({ type: "paragraph", content });
      }
      i++;
      continue;
    }
    // Paragraph: collect until blank line or # heading
    const paragraphLines: string[] = [];
    while (i < lines.length) {
      const l = lines[i];
      if (/^#{1,6}\s/.test(l)) break;
      if (l.trim() === "" && paragraphLines.length > 0) {
        i++;
        break;
      }
      if (l.trim() !== "") {
        if (paragraphLines.length === 0) {
          const level = getUppercaseHeadingLevel(l.trim());
          if (level != null) {
            blocks.push({ type: "heading", level, content: l.trim() });
            i++;
            break;
          }
        }
        paragraphLines.push(l);
      }
      i++;
    }
    if (paragraphLines.length > 0) {
      blocks.push({ type: "paragraph", content: paragraphLines.join("\n").trim() });
    }
  }

  return blocks;
}

function blocksToSections(blocks: { type: BlockType; level?: number; content: string }[]): Section[] {
  const sections: Section[] = [];
  let current: Block[] = [];

  for (const b of blocks) {
    if (b.type === "heading" && current.length > 0) {
      sections.push({ blocks: current });
      current = [];
    }
    current.push({
      block_id: "", // filled by caller with chapterId
      type: b.type,
      content: b.content,
      ...(b.type === "heading" && b.level != null ? { level: b.level } : {}),
    });
  }
  if (current.length > 0) {
    sections.push({ blocks: current });
  }

  return sections;
}

function processChapter(fileName: string): Chapter | null {
  const chapterId = fileName.replace(/\.md$/i, "");
  const filePath = path.join(COURSE_DIR, fileName);

  // Exclude specific content-only chapters from the manifest:
  // - Index / contents wrapper
  // - Front matter wrapper
  // - Early preface + further-reading stubs
  // - Standalone numeric notes index
  if (
    chapterId === "00-INDEX" ||
    chapterId === "01-front-matter" ||
    chapterId === "02-preface" ||
    chapterId === "03-further-reading" ||
    chapterId === "03-notes"
  ) {
    return null;
  }
  if (!fs.existsSync(filePath)) return null;

  const raw = fs.readFileSync(filePath, "utf-8");
  const parsed = parseMarkdownBlocks(raw);
  if (parsed.length === 0) return null;

  const sections = blocksToSections(parsed);
  const firstHeading = parsed.find((p) => p.type === "heading");
  const title = firstHeading?.content ?? chapterId;

  // Assign stable block_id to each block
  for (const section of sections) {
    for (const block of section.blocks) {
      block.block_id = stableBlockId(chapterId, block.content);
    }
  }

  const mode = getChapterMode(chapterId, fileName);
  return {
    id: chapterId,
    file: fileName,
    title,
    mode,
    sections,
  };
}

function main(): void {
  if (!fs.existsSync(COURSE_DIR)) {
    fs.mkdirSync(COURSE_DIR, { recursive: true });
  }

  const files = fs.readdirSync(COURSE_DIR).filter((f) => f.endsWith(".md")).sort();
  const chapters: Chapter[] = [];

  for (const file of files) {
    const chapter = processChapter(file);
    if (chapter) chapters.push(chapter);
  }

  const manifest: Manifest = { chapters };

  fs.mkdirSync(CONTENT_DIR, { recursive: true });
  fs.writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 2), "utf-8");
  console.log(`Wrote ${MANIFEST_PATH} (${chapters.length} chapter(s))`);
}

main();
