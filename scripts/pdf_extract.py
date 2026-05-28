#!/usr/bin/env python3
"""
Lightweight PDF text extractor for checklist verification.

Usage examples:
  python3 scripts/pdf_extract.py --pdf "/path/to/book.pdf" --page 23
  python3 scripts/pdf_extract.py --pdf "/path/to/book.pdf" --page 22 --grep "THINGS TO CHANGE"
  python3 scripts/pdf_extract.py --pdf "/path/to/book.pdf" --pages 22-24 --max-chars 1200
"""

from __future__ import annotations

import argparse
import re
import sys
from dataclasses import dataclass
from typing import Iterable, Optional, Sequence, Tuple


@dataclass(frozen=True)
class PageSpec:
    start: int
    end: int


def _parse_pages(value: str) -> PageSpec:
    value = value.strip()
    m = re.fullmatch(r"(\d+)(?:-(\d+))?", value)
    if not m:
        raise argparse.ArgumentTypeError("Expected N or N-M (1-based pages)")
    start = int(m.group(1))
    end = int(m.group(2) or m.group(1))
    if start < 1 or end < 1:
        raise argparse.ArgumentTypeError("Pages must be >= 1")
    if end < start:
        raise argparse.ArgumentTypeError("End page must be >= start page")
    return PageSpec(start=start, end=end)


def _iter_page_numbers(spec: PageSpec) -> Iterable[int]:
    return range(spec.start, spec.end + 1)


def _load_pdf(pdf_path: str):
    try:
        import fitz  # PyMuPDF
    except Exception as e:  # pragma: no cover
        raise RuntimeError(
            "PyMuPDF is required. Install with: python3 -m pip install --user pymupdf"
        ) from e
    return fitz.open(pdf_path)


def _extract_page_text(doc, page_num_1_based: int) -> str:
    page = doc.load_page(page_num_1_based - 1)
    return page.get_text("text") or ""


def _grep_lines(text: str, pattern: re.Pattern[str]) -> list[str]:
    out: list[str] = []
    for line in text.splitlines():
        if pattern.search(line):
            out.append(line)
    return out


def main(argv: Sequence[str]) -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--pdf", required=True, help="Path to PDF")
    group = parser.add_mutually_exclusive_group(required=True)
    group.add_argument("--page", type=int, help="Single 1-based page number")
    group.add_argument("--pages", type=_parse_pages, help="Page range, e.g. 22-24")
    parser.add_argument(
        "--grep",
        help="Optional regex: print only matching lines (per page)",
    )
    parser.add_argument(
        "--max-chars",
        type=int,
        default=8000,
        help="Max characters to print per page (default: 8000)",
    )

    args = parser.parse_args(list(argv))
    doc = _load_pdf(args.pdf)

    page_spec = PageSpec(args.page, args.page) if args.page else args.pages
    pattern = re.compile(args.grep, re.IGNORECASE) if args.grep else None

    for p in _iter_page_numbers(page_spec):
        text = _extract_page_text(doc, p)
        if pattern is not None:
            lines = _grep_lines(text, pattern)
            print(f"--- PAGE {p} (matches={len(lines)}) ---")
            for line in lines:
                print(line)
            continue

        trimmed = text[: args.max_chars].rstrip()
        print(f"--- PAGE {p} (chars={len(text)}) ---")
        print(trimmed)

    return 0


if __name__ == "__main__":  # pragma: no cover
    raise SystemExit(main(sys.argv[1:]))

