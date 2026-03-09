"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import {
  fetchNotesForBlocks,
  insertNote,
  updateNote,
  deleteNote,
  type Note,
} from "@/lib/notes";
import {
  upsertProgress,
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

  // Load chapter completion and record last-read on chapter open (interactive only)
  useEffect(() => {
    if (!isInteractive || !user || sectionIds.length === 0) return;
    let mounted = true;
    (async () => {
      try {
        const chapterProgressRows = await getChapterProgressForUser(supabase);
        if (!mounted) return;
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
  }, [isInteractive, user, sectionIds, chapterId, sections, supabase]);

  const blockIdsWithNotes = useMemo(
    () => new Set(notes.map((n) => n.block_id)),
    [notes]
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
    (block_id: string) => {
      if (!user) return;
      setScrollToBlockId(block_id);
      setActiveBlockId(block_id);
      setDrawerOpen(true);
      document.getElementById(block_id)?.scrollIntoView({ behavior: "smooth", block: "start" });
      const sectionId = blockIdToSectionId.get(block_id);
      if (sectionId) {
        upsertProgress(supabase, sectionId, { last_block_id: block_id }).catch(
          () => {}
        );
      }
    },
    [user, blockIdToSectionId, supabase]
  );

  const handleInsertNote = useCallback(
    async (block_id: string, body: string) => {
      await insertNote(supabase, block_id, body);
      const sectionId = blockIdToSectionId.get(block_id);
      if (sectionId) {
        await upsertProgress(supabase, sectionId, { last_block_id: block_id });
      }
      await refetch();
      setActiveBlockId(null);
      setScrollToBlockId(block_id);
    },
    [supabase, refetch, blockIdToSectionId]
  );

  const handleUpdateNote = useCallback(
    async (id: string, body: string) => {
      await updateNote(supabase, id, body);
      await refetch();
    },
    [supabase, refetch]
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
      onInsert={handleInsertNote}
      onUpdate={handleUpdateNote}
      onDelete={handleDelete}
      onCancelNewComment={() => setActiveBlockId(null)}
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
            <h2 className="slj-faint mb-3 font-sans text-xs uppercase tracking-[0.18em]">
              In this chapter
            </h2>
            {user && (
              <div className="mb-3 flex items-center justify-between gap-2 border-b border-[var(--slj-border)] pb-3">
                <span className="font-serif text-base font-semibold text-[var(--slj-text)]">
                  {displayTitle}
                </span>
                {chapterComplete ? (
                  <span className="slj-faint font-sans text-[11px] uppercase tracking-[0.16em]">
                    Complete
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={handleMarkChapterComplete}
                    className="slj-faint text-xs underline underline-offset-4 hover:text-[var(--slj-text)]"
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
                return (
                  <li key={heading.block_id}>
                    <Link
                      href={`#${heading.block_id}`}
                      className="slj-muted hover:text-[var(--slj-text)] hover:underline underline-offset-4"
                    >
                      {heading.content}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        )}

        <article className="slj-shell p-6 font-serif md:p-10">
          {!isInteractive ? (
            <header className="mb-8 border-b border-[var(--slj-border)] pb-4">
              <h1 className="font-serif text-4xl font-semibold leading-none text-[var(--slj-text)]">
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
                  hasNote={blockIdsWithNotes.has(block.block_id)}
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
          className="mt-8 flex justify-between border-t border-[var(--slj-border)] pt-6 font-sans text-sm"
          aria-label="Chapter navigation"
        >
          <span>
            {prevChapter ? (
              <Link
                href={`/course/${prevChapter.id}`}
                className="slj-muted underline underline-offset-4 hover:text-[var(--slj-text)]"
              >
                ← Previous: {prevChapter.title}
              </Link>
            ) : (
              <span className="slj-faint">Previous</span>
            )}
          </span>
          <span>
            {nextChapter ? (
              <Link
                href={`/course/${nextChapter.id}`}
                className="slj-muted underline underline-offset-4 hover:text-[var(--slj-text)]"
              >
                Next: {nextChapter.title} →
              </Link>
            ) : (
              <span className="slj-faint">Next</span>
            )}
          </span>
        </nav>
      </div>

      {isInteractive ? (
        <aside
          className="hidden w-[360px] shrink-0 slj-shell p-5 md:block md:max-h-[calc(100vh-6rem)] md:overflow-y-auto"
          aria-label="Notes"
        >
          {loading ? (
            <p className="slj-muted font-sans text-sm">
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
          <p className="slj-muted font-sans text-sm leading-6">
            Notes are available in session chapters.
          </p>
        </aside>
      )}

      {isInteractive && (
        <>
          <button
            type="button"
            onClick={() => setDrawerOpen(true)}
            className="fixed bottom-6 right-6 border border-[var(--slj-border)] bg-[var(--slj-surface)] px-4 py-2 font-sans text-sm text-[var(--slj-text)] md:hidden"
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
                className="fixed bottom-0 right-0 top-0 z-50 w-[min(340px,88vw)] overflow-auto border-l border-[var(--slj-border)] bg-[var(--slj-surface)] p-4 md:hidden"
                aria-label="Notes"
              >
                <div className="mb-4 flex items-center justify-between">
                  <span className="font-sans text-sm font-medium text-[var(--slj-text)]">
                    Notes
                  </span>
                  <button
                    type="button"
                    onClick={() => setDrawerOpen(false)}
                    className="h-8 w-8 border border-[var(--slj-border)] bg-[var(--slj-surface)] text-[var(--slj-text)]"
                    aria-label="Close notes"
                  >
                    ✕
                  </button>
                </div>
                {loading ? (
                  <p className="slj-muted font-sans text-sm">
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
