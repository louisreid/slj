/**
 * Ingests a zip of course chapter markdown into content/course/.
 * Run: pnpm run ingest-from-zip [path/to/slj_course_sections_md.zip]
 *
 * - Extracts the zip to a temp dir (using yauzl; no system unzip required).
 * - Copies 01-*.md … 35-*.md (any NN-*.md except 00-*) into content/course/.
 * - Copies 00-INDEX.md to docs/course-00-INDEX.md if present.
 * - Then run pnpm generate-manifest to update the manifest.
 */

import * as fs from "fs";
import * as os from "os";
import * as path from "path";
import * as yauzl from "yauzl";

const CONTENT_DIR = path.join(process.cwd(), "content");
const COURSE_DIR = path.join(CONTENT_DIR, "course");
const DOCS_DIR = path.join(process.cwd(), "docs");

/** Chapter file: 01-foo.md, 02-bar.md, … (exclude 00-INDEX.md) */
const CHAPTER_FILE_RE = /^(\d{2})-(.+\.md)$/;

function extractZipToDir(zipPath: string, tempDir: string): Promise<void> {
  return new Promise((resolve, reject) => {
    yauzl.open(zipPath, { lazyEntries: true }, (err, zipfile) => {
      if (err) {
        reject(err);
        return;
      }
      zipfile.readEntry();
      zipfile.on("entry", (entry) => {
        if (/\/$/.test(entry.fileName)) {
          zipfile.readEntry();
          return;
        }
        const destPath = path.join(tempDir, entry.fileName);
        fs.mkdirSync(path.dirname(destPath), { recursive: true });
        zipfile.openReadStream(entry, (err2, readStream) => {
          if (err2) {
            zipfile.close();
            reject(err2);
            return;
          }
          const writeStream = fs.createWriteStream(destPath);
          readStream.pipe(writeStream);
          writeStream.on("finish", () => zipfile.readEntry());
          writeStream.on("error", (e) => {
            zipfile.close();
            reject(e);
          });
        });
      });
      zipfile.on("end", () => resolve());
      zipfile.on("error", reject);
    });
  });
}

async function main(): Promise<void> {
  const zipPathArg = process.argv[2];
  if (!zipPathArg) {
    console.error("Usage: pnpm run ingest-from-zip <path-to-zip>");
    console.error("Example: pnpm run ingest-from-zip ~/Downloads/slj_course_sections_md.zip");
    process.exit(1);
  }

  const resolvedArg = zipPathArg.startsWith("~/")
    ? path.join(os.homedir(), zipPathArg.slice(2))
    : zipPathArg;
  const zipPath = path.resolve(process.cwd(), resolvedArg);
  if (!fs.existsSync(zipPath)) {
    console.error(`Zip not found: ${zipPath}`);
    process.exit(1);
  }

  const tempDir = path.join(process.cwd(), ".ingest-tmp-" + Date.now());
  fs.mkdirSync(tempDir, { recursive: true });

  try {
    await extractZipToDir(zipPath, tempDir);
  } catch (err) {
    console.error("Extract failed:", err);
    fs.rmSync(tempDir, { recursive: true, force: true });
    process.exit(1);
  }

  // Some zips have a single top-level folder; use it as extract root
  const entriesAtRoot = fs.readdirSync(tempDir, { withFileTypes: true });
  const singleDir =
    entriesAtRoot.length === 1 &&
    entriesAtRoot[0].isDirectory() &&
    !entriesAtRoot[0].name.endsWith(".md");
  const extractRoot = singleDir ? path.join(tempDir, entriesAtRoot[0].name) : tempDir;

  if (!fs.existsSync(COURSE_DIR)) {
    fs.mkdirSync(COURSE_DIR, { recursive: true });
  }

  const entries = fs.readdirSync(extractRoot, { withFileTypes: true });
  const mdEntries = entries.filter(
    (e) => e.isFile() && e.name.endsWith(".md") && e.name.match(CHAPTER_FILE_RE)
  );
  let chapterCount = 0;

  for (const ent of mdEntries) {
    const match = ent.name.match(CHAPTER_FILE_RE);
    if (!match) continue;
    const num = match[1];
    if (num === "00") {
      const src = path.join(extractRoot, ent.name);
      const dest = path.join(DOCS_DIR, "course-00-INDEX.md");
      if (!fs.existsSync(DOCS_DIR)) fs.mkdirSync(DOCS_DIR, { recursive: true });
      fs.copyFileSync(src, dest);
      console.log(`Copied ${ent.name} → docs/course-00-INDEX.md`);
      continue;
    }

    const src = path.join(extractRoot, ent.name);
    const dest = path.join(COURSE_DIR, ent.name);
    fs.copyFileSync(src, dest);
    chapterCount++;
  }

  fs.rmSync(tempDir, { recursive: true, force: true });

  console.log(`Ingested ${chapterCount} chapter(s) into content/course/`);
  console.log("Run: pnpm generate-manifest");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
