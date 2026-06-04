import worksheetIndex from "@/content/worksheets/index.json";

export type WorksheetLinkRef = {
  href: string;
  id: string;
  label: string;
};

const WORKSHEET_LINK_RE =
  /\[\]\(\/worksheets\/print\/([^)]+)\)(?:\s*\(([^)]+)\))?|\[([^\]]*)\]\(\/worksheets\/print\/([^)]+)\)/g;

function titleForId(id: string): string {
  const entry = worksheetIndex.find((w) => w.id === id);
  if (entry) return entry.title;
  return id
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

/** Pull worksheet markdown links out of paragraph text for block-level callouts. */
export function extractWorksheetLinks(text: string): {
  prose: string;
  worksheets: WorksheetLinkRef[];
} {
  const worksheets: WorksheetLinkRef[] = [];
  const re = new RegExp(WORKSHEET_LINK_RE.source, "g");
  let m: RegExpExecArray | null;
  while ((m = re.exec(text)) !== null) {
    const id = m[1] ?? m[4];
    const rawLabel = (m[2] ?? m[3] ?? "").trim();
    worksheets.push({
      href: `/worksheets/print/${id}`,
      id,
      label: rawLabel || titleForId(id),
    });
  }

  let prose = text.replace(WORKSHEET_LINK_RE, "");
  prose = prose
    .replace(/\s+and\s*\.?\s*$/i, "")
    .replace(/\s*Open the printable (?:form|worksheet)s?\s*\.?\s*$/i, "")
    .replace(/\s{2,}/g, " ")
    .replace(/\s+\./g, ".")
    .replace(/\.\s*\./g, ".")
    .trim();

  return { prose, worksheets };
}

export function paragraphContainsWorksheetLink(text: string): boolean {
  const re = new RegExp(WORKSHEET_LINK_RE.source);
  return re.test(text);
}
