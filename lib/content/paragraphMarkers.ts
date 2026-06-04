import { extractScriptureMarkers, type ScriptureMarkerResult } from "./scripture";

export interface ParagraphMarkerResult extends ScriptureMarkerResult {
  /** Centered headline / key line (`!!` prefix). */
  headlineQuote?: boolean;
}

/** Strip paragraph markers: `!!`, `^`, `@scripture`, scripture refs. */
export function extractParagraphMarkers(raw: string): ParagraphMarkerResult {
  let trimmed = raw.trim();
  let headlineQuote: boolean | undefined;

  if (trimmed.startsWith("!!")) {
    trimmed = trimmed.slice(2).trimStart();
    headlineQuote = true;
  }

  const scripture = extractScriptureMarkers(trimmed);
  return { ...scripture, headlineQuote };
}
