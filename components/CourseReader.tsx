"use client";

import Link from "next/link";
import { Check } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import {
  fetchNotesForBlocks,
  upsertNote,
  deleteNote,
  type Note,
} from "@/lib/notes";
import {
  upsertProgress,
  getProgressForUser,
  upsertChapterProgress,
  getChapterProgressForUser,
} from "@/lib/progress";
import type { Chapter, Section } from "@/lib/content";
import { NotesPanelContent } from "@/components/NotesPanelContent";
import {
  getSectionId,
  firstHeadingBlock,
  BlockNode,
  BlockWithNoteAction,
} from "@/components/BlockContent";

const EMPTY_BLOCK_IDS: string[] = [];

export interface CourseReaderProps {
  chapterId: string;
  chapter: Chapter;
  displayTitle: string;
  sections: Section[];
  blockIds: string[];
  blockIdToLabel: Record<string, string>;
  prevChapter: { id: string; title: string } | null;
  nextChapter: { id: string; title: string } | null;
}

export function CourseReader({
  chapterId,
  chapter,
  displayTitle,
  sections,
  blockIds,
  blockIdToLabel,
  prevChapter,
  nextChapter,
}: CourseReaderProps) {
  const isInteractive = chapter.mode !== "static";
  const effectiveBlockIds = useMemo(
    () => (isInteractive ? blockIds : EMPTY_BLOCK_IDS),
    [isInteractive, blockIds]
  );

  const [user, setUser] = useState<{ id: string } | null>(null);
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [scrollToBlockId, setScrollToBlockId] = useState<string | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [completedSectionIds, setCompletedSectionIds] = useState<Set<string>>(
    () => new Set()
  );
  const [chapterComplete, setChapterComplete] = useState(false);
  const [activeBlockId, setActiveBlockId] = useState<string | null>(null);
  const supabase = createClient();

  const sectionIds = useMemo(
    () =>
      sections
        .map(getSectionId)
        .filter((id): id is string => id != null),
    [sections]
  );
  const blockIdToSectionId = useMemo(() => {
    const m = new Map<string, string>();
    for (const section of sections) {
      const sid = getSectionId(section);
      if (sid) for (const b of section.blocks) m.set(b.block_id, sid);
    }
    return m;
  }, [sections]);

  const refetch = useCallback(async () => {
    if (!user || effectiveBlockIds.length === 0) {
      setNotes([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const data = await fetchNotesForBlocks(supabase, effectiveBlockIds);
      setNotes(data);
    } catch {
      setNotes([]);
    } finally {
      setLoading(false);
    }
  }, [user, effectiveBlockIds, supabase]);

  useEffect(() => {
    let mounted = true;
    supabase.auth.getUser().then(({ data: { user: u } }) => {
      if (mounted) setUser(u ? { id: u.id } : null);
    });
    return () => {
      mounted = false;
    };
  }, [supabase]);

  useEffect(() => {
    if (!user) {
      setNotes([]);
      setLoading(false);
      return;
    }
    refetch();
  }, [user, refetch]);

  // Load completed sections, chapter completion, and record last-read on chapter open (interactive only)
  const sectionIdsKey = sectionIds.join(",");
  useEffect(() => {
    if (!isInteractive || !user || sectionIds.length === 0) return;
    let mounted = true;
    (async () => {
      try {
        const [progressRows, chapterProgressRows] = await Promise.all([
          getProgressForUser(supabase),
          getChapterProgressForUser(supabase),
        ]);
        if (!mounted) return;
        const completed = new Set(
          progressRows
            .filter((r) => r.completed_at != null && sectionIds.includes(r.section_id))
            .map((r) => r.section_id)
        );
        setCompletedSectionIds(completed);
        const chapterRow = chapterProgressRows.find(
          (r) => r.chapter_id === chapterId && r.completed_at != null
        );
        setChapterComplete(!!chapterRow);
        const firstSectionId = sectionIds[0];
        const firstBlockId = sections[0]?.blocks[0]?.block_id;
        if (firstSectionId && firstBlockId) {
          await upsertProgress(supabase, firstSectionId, {
            last_block_id: firstBlockId,
          });
        }
      } catch {
        // ignore
      }
    })();
    return () => {
      mounted = false;
    };
  }, [isInteractive, user, sectionIds, sectionIdsKey, chapterId, sections, supabase]);

  const notesByBlock = new Map(notes.map((n) => [n.block_id, n]));

  const handleMarkSectionComplete = useCallback(
    async (sectionId: string) => {
      if (!user) return;
      try {
        await upsertProgress(supabase, sectionId, {
          completed_at: new Date().toISOString(),
        });
        setCompletedSectionIds((prev) => new Set(prev).add(sectionId));
      } catch {
        // ignore
      }
    },
    [user, supabase]
  );

  const handleMarkChapterComplete = useCallback(
    async () => {
      if (!user) return;
      try {
        await upsertChapterProgress(supabase, chapterId, {
          completed_at: new Date().toISOString(),
        });
        setChapterComplete(true);
      } catch {
        // ignore
      }
    },
    [user, chapterId, supabase]
  );

  const handleAddOrEditNote = useCallback(
    async (block_id: string) => {
      if (!user) return;
      try {
        await upsertNote(supabase, block_id, "");
        const sectionId = blockIdToSectionId.get(block_id);
        if (sectionId) {
          await upsertProgress(supabase, sectionId, { last_block_id: block_id });
        }
        await refetch();
        setScrollToBlockId(block_id);
        setActiveBlockId(block_id);
        setDrawerOpen(true);
      } catch {
        // ignore
      }
    },
    [user, supabase, refetch, blockIdToSectionId]
  );

  const handleUpsert = useCallback(
    async (block_id: string, body: string) => {
      await upsertNote(supabase, block_id, body);
      const sectionId = blockIdToSectionId.get(block_id);
      if (sectionId) {
        await upsertProgress(supabase, sectionId, { last_block_id: block_id });
      }
      await refetch();
    },
    [supabase, refetch, blockIdToSectionId]
  );

  const handleDelete = useCallback(
    async (id: string) => {
      await deleteNote(supabase, id);
      await refetch();
    },
    [supabase, refetch]
  );

  const sharedNotesContent = (
    <NotesPanelContent
      blockIds={effectiveBlockIds}
      blockIdToLabel={blockIdToLabel}
      notes={notes}
      onUpsert={handleUpsert}
      onDelete={handleDelete}
      scrollToBlockId={scrollToBlockId}
      onScrolledToBlock={() => setScrollToBlockId(null)}
      isSignedIn={!!user}
      activeBlockId={activeBlockId}
      title="Notes for this chapter"
    />
  );

  return (
    <div className="flex flex-col gap-8 md:flex-row md:gap-6">
      <div className="flex-1 min-w-0 max-w-[78ch]">
        {isInteractive && (
          <nav
            className="mb-8 slj-card p-5 font-sans text-sm"
            aria-label="Table of contents"
          >
            <h2 className="mb-3 font-sans text-xs uppercase tracking-[0.18em] text-black/45">
              In this chapter
            </h2>
            {user && (
              <div className="mb-3 flex items-center justify-between gap-2 border-b border-[#E5E7EB] pb-3">
                <span className="font-serif text-base font-semibold text-black">
                  {displayTitle}
                </span>
                {chapterComplete ? (
                  <span className="font-sans text-[11px] uppercase tracking-[0.16em] text-black/45">
                    Complete
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={handleMarkChapterComplete}
                    className="text-xs text-black/45 underline underline-offset-4 hover:text-black"
                  >
                    Mark complete
                  </button>
                )}
              </div>
            )}
            <ul className="space-y-1 pl-3">
              {sections.map((section) => {
                const heading = firstHeadingBlock(section);
                const sectionId = getSectionId(section);
                if (!heading || !sectionId) return null;
                const isComplete = completedSectionIds.has(sectionId);
                return (
                  <li
                    key={heading.block_id}
                    className="flex flex-wrap items-center justify-between gap-2"
                  >
                    <Link
                      href={`#${heading.block_id}`}
                      className="text-black/65 hover:text-black hover:underline underline-offset-4"
                    >
                      {heading.content}
                    </Link>
                    {user && (
                      <span className="shrink-0 font-sans text-xs">
                        {isComplete ? (
                          <span className="uppercase tracking-[0.16em] text-black/45">
                            Done
                          </span>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleMarkSectionComplete(sectionId)}
                            className="text-black/45 underline underline-offset-4 hover:text-black"
                          >
                            Mark complete
                          </button>
                        )}
                      </span>
                    )}
                  </li>
                );
              })}
            </ul>
          </nav>
        )}

        <article className="slj-shell p-6 font-serif md:p-10">
          {!isInteractive ? (
            <header className="mb-8 border-b border-[#E5E7EB] pb-4">
              <p className="font-sans text-xs uppercase tracking-[0.18em] text-black/45">
                Static reading
              </p>
              <h1 className="mt-3 font-serif text-4xl font-semibold leading-none text-black">
                {displayTitle}
              </h1>
            </header>
          ) : null}
          {sections.map((section) =>
            section.blocks.map((block) =>
              isInteractive && block.type === "paragraph" ? (
                <BlockWithNoteAction
                  key={block.block_id}
                  block={block}
                  hasNote={notesByBlock.has(block.block_id)}
                  onAddOrEditNote={handleAddOrEditNote}
                  isActive={activeBlockId === block.block_id}
                />
              ) : (
                <BlockNode key={block.block_id} block={block} />
              )
            )
          )}
        </article>

        <nav
          className="mt-8 flex justify-between border-t border-[#E5E7EB] pt-6 font-sans text-sm"
          aria-label="Chapter navigation"
        >
          <span>
            {prevChapter ? (
              <Link
                href={`/course/${prevChapter.id}`}
                className="text-black/65 underline underline-offset-4 hover:text-black"
              >
                ← Previous: {prevChapter.title}
              </Link>
            ) : (
              <span className="text-black/45">Previous</span>
            )}
          </span>
          <span>
            {nextChapter ? (
              <Link
                href={`/course/${nextChapter.id}`}
                className="text-black/65 underline underline-offset-4 hover:text-black"
              >
                Next: {nextChapter.title} →
              </Link>
            ) : (
              <span className="text-black/45">Next</span>
            )}
          </span>
        </nav>
      </div>

      {isInteractive ? (
        <aside
          className="hidden w-[360px] shrink-0 slj-shell p-5 md:block"
          aria-label="Notes"
        >
          {loading ? (
            <p className="font-sans text-sm text-black/65">
              Loading notes...
            </p>
          ) : (
            sharedNotesContent
          )}
        </aside>
      ) : (
        <aside
          className="hidden w-[360px] shrink-0 slj-shell p-5 md:block"
          aria-label="Notes"
        >
          <p className="font-sans text-sm leading-6 text-black/65">
            Notes are available in session chapters.
          </p>
        </aside>
      )}

      {isInteractive && (
        <>
          <button
            type="button"
            onClick={() => setDrawerOpen(true)}
            className="fixed bottom-6 right-6 border border-[#E5E7EB] bg-white px-4 py-2 font-sans text-sm text-black md:hidden"
          >
            Notes
          </button>
          {drawerOpen && (
            <>
              <div
                className="fixed inset-0 z-40 bg-black/15 md:hidden"
                onClick={() => setDrawerOpen(false)}
                aria-hidden
              />
              <aside
                className="fixed bottom-0 right-0 top-0 z-50 w-[min(340px,88vw)] overflow-auto border-l border-[#E5E7EB] bg-white p-4 md:hidden"
                aria-label="Notes"
              >
                <div className="mb-4 flex items-center justify-between">
                  <span className="font-sans text-sm font-medium text-black">
                    Notes
                  </span>
                  <button
                    type="button"
                    onClick={() => setDrawerOpen(false)}
                    className="h-8 w-8 border border-[#E5E7EB] bg-white text-black"
                    aria-label="Close notes"
                  >
                    ✕
                  </button>
                </div>
                {loading ? (
                  <p className="font-sans text-sm text-black/65">
                    Loading notes...
                  </p>
                ) : (
                  sharedNotesContent
                )}
              </aside>
            </>
          )}
        </>
      )}
    </div>
  );
}
