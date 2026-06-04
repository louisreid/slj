/** Shared scripture reference patterns (manifest + reader). */

export const SCRIPTURE_REF =
  /(?:[1-3]\s*)?[A-Za-z]+(?:\s+[A-Za-z]+)*(?:\.)?\s+\d{1,3}:\d{1,3}(?:[–-]\d{1,3})?/u;

/** Trailing `(Micah 6:8)` or `(Matthew 6:25–33).` */
export const SCRIPTURE_CITATION_TAIL_RE = new RegExp(
  `\\s*\\((${SCRIPTURE_REF.source})\\)(?:[.,;])?\\s*$`,
  "u"
);

/** Explicit marker: ` @Matthew 6:25-33` or ` @(1 John 3:17).` */
export const EXPLICIT_SCRIPTURE_TAIL_RE = new RegExp(
  `\\s+@(?:\\()?(${SCRIPTURE_REF.source})(?:\\))?(?:[.,;])?\\s*$`,
  "u"
);

export interface ScriptureMarkerResult {
  content: string;
  forceBody?: boolean;
  scriptureRef?: string;
  forceScripture?: boolean;
}

/** Strip `^`, `@scripture`, and `@Ref` / `(Ref)` tails from paragraph markdown. */
export function extractScriptureMarkers(raw: string): ScriptureMarkerResult {
  let trimmed = raw.trim();
  let forceBody: boolean | undefined;
  let forceScripture: boolean | undefined;
  let scriptureRef: string | undefined;

  if (trimmed.startsWith("^")) {
    trimmed = trimmed.slice(1).trimStart();
    forceBody = true;
  }
  if (trimmed.startsWith("@scripture ")) {
    trimmed = trimmed.slice("@scripture ".length).trimStart();
    forceScripture = true;
  }

  let match = trimmed.match(EXPLICIT_SCRIPTURE_TAIL_RE);
  if (match) {
    trimmed = trimmed.slice(0, match.index).trim();
    scriptureRef = match[1].trim();
  } else {
    match = trimmed.match(SCRIPTURE_CITATION_TAIL_RE);
    if (match) {
      trimmed = trimmed.slice(0, match.index).trim();
      scriptureRef = match[1].trim();
    }
  }

  return { content: trimmed, forceBody, scriptureRef, forceScripture };
}
