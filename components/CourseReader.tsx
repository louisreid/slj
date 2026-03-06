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
  sections: Section[];
  blockIds: string[];
  blockIdToLabel: Record<string, string>;
  prevChapter: { id: string; title: string } | null;
  nextChapter: { id: string; title: string } | null;
}

export function CourseReader({
  chapterId,
  chapter,
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
    />
  );

  return (
    <div className="flex flex-col md:flex-row gap-8 md:gap-6">
      <div className="flex-1 min-w-0 max-w-[78ch]">
        {isInteractive && (
          <nav
            className="font-sans text-sm mb-8 slj-card p-5"
            aria-label="Table of contents"
          >
            <h2 className="text-white/55 font-medium mb-3 uppercase tracking-[0.12em] text-xs">
              In this chapter
            </h2>
            {user && (
              <div className="flex items-center justify-between gap-2 mb-3 pb-3 border-b border-white/10">
                <span className="text-white/75 font-medium">Chapter</span>
                {chapterComplete ? (
                  <Check
                    size={16}
                    strokeWidth={2.5}
                    className="text-green-500 shrink-0"
                    aria-label="Chapter complete"
                  />
                ) : (
                  <button
                    type="button"
                    onClick={handleMarkChapterComplete}
                    className="text-white/45 hover:text-white hover:underline underline-offset-2 text-xs"
                  >
                    Mark complete
                  </button>
                )}
              </div>
            )}
            <ul className="space-y-1">
              {sections.map((section) => {
                const heading = firstHeadingBlock(section);
                const sectionId = getSectionId(section);
                if (!heading || !sectionId) return null;
                const isComplete = completedSectionIds.has(sectionId);
                return (
                  <li
                    key={heading.block_id}
                    className="flex items-center justify-between gap-2 flex-wrap"
                  >
                    <Link
                      href={`#${heading.block_id}`}
                      className="text-white/75 hover:text-white hover:underline underline-offset-2"
                    >
                      {heading.content}
                    </Link>
                    {user && (
                      <span className="font-sans text-xs shrink-0">
                        {isComplete ? (
                          <Check
                            size={16}
                            strokeWidth={2.5}
                            className="text-green-500"
                            aria-label="Complete"
                          />
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleMarkSectionComplete(sectionId)}
                            className="text-white/45 hover:text-white hover:underline underline-offset-2"
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

        <article className="font-serif slj-shell p-6 md:p-10">
          {sections.map((section) =>
            section.blocks.map((block) =>
              isInteractive && block.type === "paragraph" ? (
                <BlockWithNoteAction
                  key={block.block_id}
                  block={block}
                  hasNote={notesByBlock.has(block.block_id)}
                  onAddOrEditNote={handleAddOrEditNote}
                />
              ) : (
                <BlockNode key={block.block_id} block={block} />
              )
            )
          )}
        </article>

        <nav
          className="font-sans text-sm flex justify-between mt-8 pt-6 border-t border-white/10"
          aria-label="Chapter navigation"
        >
          <span>
            {prevChapter ? (
              <Link
                href={`/course/${prevChapter.id}`}
                className="text-white/70 hover:text-white underline underline-offset-2"
              >
                ← Previous: {prevChapter.title}
              </Link>
            ) : (
              <span className="text-white/45">Previous</span>
            )}
          </span>
          <span>
            {nextChapter ? (
              <Link
                href={`/course/${nextChapter.id}`}
                className="text-white/70 hover:text-white underline underline-offset-2"
              >
                Next: {nextChapter.title} →
              </Link>
            ) : (
              <span className="text-white/45">Next</span>
            )}
          </span>
        </nav>
      </div>

      {/* Desktop: fixed-width notes panel (interactive only) */}
      {isInteractive && (
        <aside
          className="hidden md:block w-[360px] shrink-0 slj-shell p-5"
          aria-label="Notes"
        >
          {loading ? (
            <p className="font-sans text-sm text-white/70">
              Loading notes…
            </p>
          ) : (
            sharedNotesContent
          )}
        </aside>
      )}

      {/* Mobile: notes FAB + drawer (interactive only) */}
      {isInteractive && (
        <>
          <button
            type="button"
            onClick={() => setDrawerOpen(true)}
            className="md:hidden fixed bottom-6 right-6 px-4 py-2 rounded-xl border border-white/15 bg-[#111111] text-white text-sm font-sans"
          >
            Notes
          </button>
          {drawerOpen && (
            <>
              <div
                className="md:hidden fixed inset-0 z-40 bg-black/60"
                onClick={() => setDrawerOpen(false)}
                aria-hidden
              />
              <aside
                className="md:hidden fixed right-0 top-0 bottom-0 z-50 w-[min(340px,88vw)] bg-[#111111] border-l border-white/10 p-4 overflow-auto"
                aria-label="Notes"
              >
                <div className="flex justify-between items-center mb-4">
                  <span className="text-sm font-sans font-medium text-white">
                    Notes
                  </span>
                  <button
                    type="button"
                    onClick={() => setDrawerOpen(false)}
                    className="h-8 w-8 rounded-lg border border-white/15 bg-white/5 text-white"
                    aria-label="Close notes"
                  >
                    ✕
                  </button>
                </div>
                {loading ? (
                  <p className="font-sans text-sm text-white/70">
                    Loading notes…
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
