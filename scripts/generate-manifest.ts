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

interface Chapter {
  id: string;
  file: string;
  title: string;
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
      if (content) {
        blocks.push({ type: "heading", level, content });
      }
      i++;
      continue;
    }
    // Paragraph: collect until blank line or heading
    const paragraphLines: string[] = [];
    while (i < lines.length) {
      const l = lines[i];
      if (/^#{1,6}\s/.test(l)) break;
      if (l.trim() === "" && paragraphLines.length > 0) {
        i++;
        break;
      }
      if (l.trim() !== "") {
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

  return {
    id: chapterId,
    file: fileName,
    title,
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
