/**
 * Worksheet list loader: reads content/worksheets/index.json.
 * Use for server-side only (e.g. worksheets list page).
 */

import * as fs from "fs";
import * as path from "path";

const CONTENT_DIR = path.join(process.cwd(), "content");
const WORKSHEETS_INDEX = path.join(CONTENT_DIR, "worksheets", "index.json");

export type WorksheetMeta = {
  id: string;
  title: string;
  description: string;
};

let cachedList: WorksheetMeta[] | null = null;

/**
 * All worksheets in index order (for list page).
 */
export function getWorksheets(): WorksheetMeta[] {
  if (cachedList) return cachedList;
  const raw = fs.readFileSync(WORKSHEETS_INDEX, "utf-8");
  cachedList = JSON.parse(raw) as WorksheetMeta[];
  return cachedList;
}

/**
 * Single worksheet by id, or undefined.
 */
export function getWorksheet(id: string): WorksheetMeta | undefined {
  return getWorksheets().find((w) => w.id === id);
}
