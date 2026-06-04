/**
 * Generates content/manifest.json with stable block IDs per paragraph/heading.
 * Run: pnpm generate-manifest
 * IDs are stable across builds unless block content changes (content-based hash).
 */

import * as fs from "fs";
import * as path from "path";
import { stableBlockId } from "../lib/content/blockId";
import { extractParagraphMarkers } from "../lib/content/paragraphMarkers";

const CONTENT_DIR = path.join(process.cwd(), "content");
const COURSE_DIR = path.join(CONTENT_DIR, "course");
const MANIFEST_PATH = path.join(CONTENT_DIR, "manifest.json");

/** Active chapter files only: `04-preface.md`, `09-session-one.md`, etc. */
const CHAPTER_FILE_RE = /^(\d{2})-(.+\.md)$/;

type BlockType = "heading" | "paragraph" | "list" | "verse";

interface ListItem {
  block_id: string;
  content: string;
}

interface Block {
  block_id: string;
  type: BlockType;
  content: string;
  level?: number;
  forceBody?: boolean;
  scriptureRef?: string;
  forceScripture?: boolean;
  headlineQuote?: boolean;
  items?: ListItem[];
  lines?: ListItem[];
  verseAlign?: "right" | "center";
}

type ParsedBlock = {
  type: BlockType;
  level?: number;
  content: string;
  forceBody?: boolean;
  scriptureRef?: string;
  forceScripture?: boolean;
  headlineQuote?: boolean;
  items?: ListItem[];
  lines?: ListItem[];
  verseAlign?: "right" | "center";
};

function pushParagraph(blocks: ParsedBlock[], raw: string): void {
  const { content, forceBody, scriptureRef, forceScripture, headlineQuote } =
    extractParagraphMarkers(raw);
  if (!content) return;
  blocks.push({
    type: "paragraph",
    content,
    ...(forceBody ? { forceBody: true } : {}),
    ...(scriptureRef ? { scriptureRef } : {}),
    ...(forceScripture ? { forceScripture: true } : {}),
    ...(headlineQuote ? { headlineQuote: true } : {}),
  });
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

/** Single `-` line after a quote (e.g. `- Gandhi`) — not a bulleted list. */
function isQuoteAttributionLine(itemText: string): boolean {
  const trimmed = itemText.trim();
  if (/^—\s+\S/u.test(trimmed)) return true;
  if (trimmed.length > 160 || /\?\s*$/u.test(trimmed)) return false;
  return trimmed.length > 0 && trimmed.length <= 160;
}

/** Standalone attribution line (e.g. `— Gandhi, on simplicity` on its own line). */
function isStandaloneAttributionLine(text: string): boolean {
  const trimmed = text.trim();
  if (/^—\s+\S/u.test(trimmed)) return true;
  if (/^-\s+\S/u.test(trimmed)) {
    return isQuoteAttributionLine(trimmed.replace(/^-\s+/, ""));
  }
  return false;
}

function shouldParseAsList(items: string[]): boolean {
  if (items.length >= 2) return true;
  if (items.length === 1) return !isQuoteAttributionLine(items[0]);
  return false;
}

function collectBulletItems(
  lines: string[],
  startIndex: number
): { items: string[]; nextIndex: number } {
  const items: string[] = [];
  let i = startIndex;
  while (i < lines.length) {
    const l = lines[i];
    if (/^#{1,6}\s/.test(l)) break;
    if (l.trim() === "" && items.length > 0) {
      i++;
      break;
    }
    if (l.trim() === "" && items.length === 0) {
      i++;
      continue;
    }
    const bullet = l.match(/^-\s+(.*)$/);
    if (!bullet) break;
    items.push(bullet[1].trim());
    i++;
  }
  return { items, nextIndex: i };
}

function pushListBlock(blocks: ParsedBlock[], items: string[]): void {
  blocks.push({ type: "list", content: "", items: items.map((content) => ({ block_id: "", content })) });
}

type VersePrefix = ">>" | "::";

function collectVerseLines(
  lines: string[],
  startIndex: number,
  prefix: VersePrefix
): { lines: string[]; nextIndex: number } {
  const verseLines: string[] = [];
  const prefixRe = prefix === "::" ? /^::\s?(.*)$/ : /^>>\s?(.*)$/;
  let i = startIndex;
  while (i < lines.length) {
    const trimmed = lines[i].trim();
    if (trimmed === "" && verseLines.length > 0) {
      i++;
      break;
    }
    if (trimmed === "" && verseLines.length === 0) {
      i++;
      continue;
    }
    const match = lines[i].match(prefixRe);
    if (!match) break;
    verseLines.push(match[1].trim());
    i++;
  }
  return { lines: verseLines, nextIndex: i };
}

function pushVerseBlock(
  blocks: ParsedBlock[],
  lines: string[],
  align: "right" | "center"
): void {
  blocks.push({
    type: "verse",
    content: "",
    verseAlign: align,
    lines: lines.map((content) => ({ block_id: "", content })),
  });
}

function parseMarkdownBlocks(md: string): ParsedBlock[] {
  const blocks: ParsedBlock[] = [];
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
        blocks.push({ type: "paragraph", content });
      }
      i++;
      continue;
    }

    if (/^>>/.test(line.trim())) {
      const { lines: verseLines, nextIndex } = collectVerseLines(lines, i, ">>");
      i = nextIndex;
      if (verseLines.length > 0) {
        pushVerseBlock(blocks, verseLines, "right");
      }
      continue;
    }

    if (/^::/.test(line.trim())) {
      const { lines: verseLines, nextIndex } = collectVerseLines(lines, i, "::");
      i = nextIndex;
      if (verseLines.length > 0) {
        pushVerseBlock(blocks, verseLines, "center");
      }
      continue;
    }

    if (/^-\s+/.test(line.trim())) {
      const { items, nextIndex } = collectBulletItems(lines, i);
      i = nextIndex;
      if (shouldParseAsList(items)) {
        pushListBlock(blocks, items);
      } else if (items.length === 1) {
        pushParagraph(blocks, `- ${items[0]}`);
      }
      continue;
    }

    const paragraphLines: string[] = [];
    while (i < lines.length) {
      const l = lines[i];
      if (/^#{1,6}\s/.test(l)) break;
      if (l.trim() === "" && paragraphLines.length > 0) {
        i++;
        break;
      }
      if (l.trim() !== "") {
        if (/^-\s+/.test(l) && paragraphLines.length === 0) {
          const { items, nextIndex } = collectBulletItems(lines, i);
          i = nextIndex;
          if (shouldParseAsList(items)) {
            pushListBlock(blocks, items);
          } else if (items.length === 1) {
            pushParagraph(blocks, `- ${items[0]}`);
          }
          break;
        }
        if (/^-\s+/.test(l) && paragraphLines.length > 0) {
          pushParagraph(blocks, paragraphLines.join("\n"));
          const { items, nextIndex } = collectBulletItems(lines, i);
          i = nextIndex;
          if (shouldParseAsList(items)) {
            pushListBlock(blocks, items);
          } else if (items.length === 1) {
            pushParagraph(blocks, `- ${items[0]}`);
          }
          paragraphLines.length = 0;
          break;
        }
        if (isStandaloneAttributionLine(l) && paragraphLines.length > 0) {
          pushParagraph(blocks, paragraphLines.join("\n"));
          pushParagraph(blocks, l.trim());
          paragraphLines.length = 0;
          i++;
          continue;
        }
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
      pushParagraph(blocks, paragraphLines.join("\n"));
    }
  }

  return blocks;
}

function blocksToSections(blocks: ParsedBlock[]): Section[] {
  const sections: Section[] = [];
  let current: Block[] = [];

  for (const b of blocks) {
    if (b.type === "heading" && current.length > 0) {
      sections.push({ blocks: current });
      current = [];
    }
    current.push({
      block_id: "",
      type: b.type,
      content: b.content,
      ...(b.forceBody ? { forceBody: true } : {}),
      ...(b.scriptureRef ? { scriptureRef: b.scriptureRef } : {}),
      ...(b.forceScripture ? { forceScripture: true } : {}),
      ...(b.headlineQuote ? { headlineQuote: true } : {}),
      ...(b.type === "heading" && b.level != null ? { level: b.level } : {}),
      ...(b.type === "list" && b.items ? { items: b.items } : {}),
      ...(b.type === "verse" && b.lines ? { lines: b.lines } : {}),
      ...(b.type === "verse" && b.verseAlign ? { verseAlign: b.verseAlign } : {}),
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

  // Exclude chapters that should live in content/archive/ or docs (not the reader).
  // Kept so a mistaken copy into content/course/ does not create duplicate chapters.
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

  for (const section of sections) {
    for (const block of section.blocks) {
      if (block.type === "list" && block.items?.length) {
        const joined = block.items.map((item) => item.content).join("\n");
        block.block_id = stableBlockId(chapterId, `list\n${joined}`);
        for (const item of block.items) {
          item.block_id = stableBlockId(chapterId, item.content);
        }
      } else if (block.type === "verse" && block.lines?.length) {
        const joined = block.lines.map((item) => item.content).join("\n");
        const align = block.verseAlign ?? "right";
        block.block_id = stableBlockId(chapterId, `verse:${align}\n${joined}`);
        block.content = block.lines[0]?.content.slice(0, 80) ?? "Verse";
      } else {
        block.block_id = stableBlockId(chapterId, block.content);
      }
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

  const files = fs
    .readdirSync(COURSE_DIR)
    .filter((f) => CHAPTER_FILE_RE.test(f))
    .sort();
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
