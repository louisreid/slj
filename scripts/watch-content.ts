/**
 * Watches content/course/*.md and regenerates content/manifest.json on save.
 * Run: pnpm watch:content
 *
 * Use alongside `pnpm dev` — refresh the browser after each manifest rebuild.
 */

import { spawn } from "child_process";
import * as fs from "fs";
import * as path from "path";

const ROOT = process.cwd();
const COURSE_DIR = path.join(ROOT, "content", "course");
const CHAPTER_FILE_RE = /^(\d{2})-(.+\.md)$/;

const DEBOUNCE_MS = 300;
let debounceTimer: ReturnType<typeof setTimeout> | null = null;
let running = false;
let pending = false;

function isCourseChapterFile(filePath: string): boolean {
  const base = path.basename(filePath);
  return CHAPTER_FILE_RE.test(base);
}

function runGenerateManifest(trigger?: string): void {
  if (running) {
    pending = true;
    return;
  }
  running = true;

  const child = spawn("pnpm", ["run", "generate-manifest"], {
    cwd: ROOT,
    stdio: ["ignore", "pipe", "pipe"],
    shell: process.platform === "win32",
  });

  let stderr = "";
  child.stderr?.on("data", (chunk) => {
    stderr += String(chunk);
  });

  child.on("close", (code) => {
    running = false;
    const time = new Date().toLocaleTimeString();
    if (code === 0) {
      const suffix = trigger ? ` (${trigger})` : "";
      console.log(`[watch:content] ${time} manifest updated${suffix}`);
    } else {
      console.error(`[watch:content] ${time} generate-manifest failed (exit ${code})`);
      if (stderr.trim()) console.error(stderr.trim());
    }
    if (pending) {
      pending = false;
      runGenerateManifest("queued");
    }
  });
}

function scheduleRegenerate(trigger: string): void {
  if (debounceTimer) clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => {
    debounceTimer = null;
    runGenerateManifest(trigger);
  }, DEBOUNCE_MS);
}

function watchCourseDir(): void {
  if (!fs.existsSync(COURSE_DIR)) {
    console.error(`[watch:content] Missing directory: ${COURSE_DIR}`);
    process.exit(1);
  }

  console.log("[watch:content] Watching content/course/*.md");
  console.log("[watch:content] Initial manifest build…");
  runGenerateManifest("startup");

  const watcher = fs.watch(
    COURSE_DIR,
    { recursive: true },
    (_eventType, filename) => {
      if (!filename) return;
      const normalized = filename.replace(/\\/g, "/");
      const fullPath = path.join(COURSE_DIR, normalized);
      if (!isCourseChapterFile(fullPath)) return;
      scheduleRegenerate(path.basename(fullPath));
    }
  );

  watcher.on("error", (err) => {
    console.error("[watch:content] watcher error:", err.message);
  });

  process.on("SIGINT", () => {
    watcher.close();
    process.exit(0);
  });
}

watchCourseDir();
