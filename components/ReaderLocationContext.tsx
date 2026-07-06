"use client";

import { createContext, useContext, type ReactNode } from "react";
import {
  isSafeCourseReturnPath,
  worksheetHrefWithAutoprint,
  worksheetHrefWithReturn,
} from "@/lib/worksheet-return";

export {
  isSafeCourseReturnPath,
  worksheetHrefWithAutoprint,
  worksheetHrefWithReturn,
};

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

