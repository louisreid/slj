const ONES = [
  "",
  "One",
  "Two",
  "Three",
  "Four",
  "Five",
  "Six",
  "Seven",
  "Eight",
  "Nine",
  "Ten",
] as const;

export function formatSessionLabel(sessionNumber: number): string {
  if (sessionNumber < 1 || sessionNumber > 10) {
    return `Session ${sessionNumber}`;
  }
  return `Session ${ONES[sessionNumber]}`;
}
