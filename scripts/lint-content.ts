/**
 * Content lint checks for obvious heading mistakes in course markdown.
 * No dependencies required.
 *
 * Run: pnpm lint:content
 */

import * as fs from "fs";
import * as path from "path";

const COURSE_DIR = path.join(process.cwd(), "content", "course");

const SCRIPTURE_HEADING_REGEX =
  /^#{1,6}\s+(?:[1-3]\s*)?[A-Za-z]+(?:\s+[A-Za-z]+)*\s+\d{1,3}:\d{1,3}(?:[–-]\d{1,3})?[.)”'"]?$/u;
const BARE_REFERENCE_HEADING_REGEX =
  /^#{1,6}\s+\d{1,3}:\d{1,3}(?:[–-]\d{1,3})?[.)”'"]?$/u;

interface Warning {
  file: string;
  line: number;
  message: string;
  text: string;
}

function lintFile(filePath: string): Warning[] {
  const warnings: Warning[] = [];
  const fileName = path.basename(filePath);
  const lines = fs.readFileSync(filePath, "utf-8").split(/\r?\n/);

  lines.forEach((line, index) => {
    const lineNumber = index + 1;
    const trimmed = line.trim();
    if (!trimmed.startsWith("#")) return;

    if (SCRIPTURE_HEADING_REGEX.test(trimmed) || BARE_REFERENCE_HEADING_REGEX.test(trimmed)) {
      warnings.push({
        file: fileName,
        line: lineNumber,
        message: "Scripture reference formatted as heading",
        text: trimmed,
      });
    }
  });

  return warnings;
}

function main() {
  if (!fs.existsSync(COURSE_DIR)) {
    console.error(`Missing directory: ${COURSE_DIR}`);
    process.exit(1);
  }

  const files = fs
    .readdirSync(COURSE_DIR)
    .filter((file) => file.endsWith(".md"))
    .sort();

  const warnings = files.flatMap((file) => lintFile(path.join(COURSE_DIR, file)));

  if (warnings.length === 0) {
    console.log("Content lint passed: no scripture-heading issues found.");
    return;
  }

  console.warn("Content lint warnings:");
  for (const warning of warnings) {
    console.warn(
      `- ${warning.file}:${warning.line} ${warning.message}\n  ${warning.text}`
    );
  }
}

main();
