"use client";

import { createContext, useContext, type ReactNode } from "react";

const CourseChapterHrefContext = createContext<string | null>(null);
const BlockAnchorContext = createContext<string | null>(null);

export function CourseChapterHrefProvider({
  href,
  children,
}: {
  href: string;
  children: ReactNode;
}) {
  return (
    <CourseChapterHrefContext.Provider value={href}>
      {children}
    </CourseChapterHrefContext.Provider>
  );
}

export function BlockAnchorProvider({
  blockId,
  children,
}: {
  blockId: string;
  children: ReactNode;
}) {
  return (
    <BlockAnchorContext.Provider value={blockId}>
      {children}
    </BlockAnchorContext.Provider>
  );
}

export function useWorksheetReturnTo(): string | null {
  const chapter = useContext(CourseChapterHrefContext);
  const blockId = useContext(BlockAnchorContext);
  if (!chapter || !blockId) return null;
  return `${chapter}#${blockId}`;
}

/** Only allow in-app course URLs (prevents open redirects). */
export function isSafeCourseReturnPath(path: string | undefined): path is string {
  if (!path || typeof path !== "string") return false;
  if (!path.startsWith("/course") || path.includes("://") || path.startsWith("//")) {
    return false;
  }
  try {
    const { pathname } = new URL(path, "http://localhost");
    return pathname === "/course" || pathname.startsWith("/course/");
  } catch {
    return false;
  }
}

export function worksheetHrefWithReturn(
  worksheetPath: string,
  returnTo: string | null
): string {
  if (!returnTo) return worksheetPath;
  const sep = worksheetPath.includes("?") ? "&" : "?";
  return `${worksheetPath}${sep}returnTo=${encodeURIComponent(returnTo)}`;
}

export function worksheetHrefWithAutoprint(
  worksheetPath: string,
  returnTo: string | null
): string {
  const href = worksheetHrefWithReturn(worksheetPath, returnTo);
  const sep = href.includes("?") ? "&" : "?";
  return `${href}${sep}autoprint=1`;
}
