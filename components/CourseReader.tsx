"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import {
  fetchNotesForBlocks,
  upsertNote,
  deleteNote,
  type Note,
} from "@/lib/notes";
import { upsertProgress, getProgressForUser } from "@/lib/progress";
import type { Block, Chapter, Section } from "@/lib/content";
import { NotesPanelContent } from "@/components/NotesPanelContent";

const HEADING_TAGS = ["h1", "h2", "h3", "h4", "h5", "h6"] as const;

function getSectionId(section: Section): string | undefined {
  return section.blocks[0]?.block_id;
}

function firstHeadingBlock(section: Section): Block | undefined {
  return section.blocks.find((b) => b.type === "heading");
}

function BlockNode({ block }: { block: Block }) {
  if (block.type === "heading") {
    const level = Math.min(Math.max(block.level ?? 1, 1), 6);
    const Tag = HEADING_TAGS[level - 1];
    return (
      <Tag
        className="font-serif font-semibold text-[#000] mt-8 first:mt-0"
        data-block-id={block.block_id}
        id={block.block_id}
      >
        {block.content}
      </Tag>
    );
  }
  if (block.type === "paragraph") {
    return (
      <p
        className="font-serif text-[#000] leading-[1.7] mt-5"
        data-block-id={block.block_id}
        id={block.block_id}
      >
        {block.content}
      </p>
    );
  }
  return null;
}

function BlockWithNoteAction({
  block,
  hasNote,
  onAddOrEditNote,
}: {
  block: Block;
  hasNote: boolean;
  onAddOrEditNote: (block_id: string) => void;
}) {
  return (
    <div className="group/block relative">
      <BlockNode block={block} />
      <div className="mt-1">
        <button
          type="button"
          onClick={() => onAddOrEditNote(block.block_id)}
          className="font-sans text-xs text-[rgba(0,0,0,0.45)] hover:text-[#000] hover:underline"
        >
          {hasNote ? "Edit note" : "Add note for this paragraph"}
        </button>
      </div>
    </div>
  );
}

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
  chapterId: _chapterId,
  chapter,
  sections,
  blockIds,
  blockIdToLabel,
  prevChapter,
  nextChapter,
}: CourseReaderProps) {
  const [user, setUser] = useState<{ id: string } | null>(null);
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [scrollToBlockId, setScrollToBlockId] = useState<string | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [completedSectionIds, setCompletedSectionIds] = useState<Set<string>>(
    () => new Set()
  );
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
    if (!user || blockIds.length === 0) {
      setNotes([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const data = await fetchNotesForBlocks(supabase, blockIds);
      setNotes(data);
    } catch {
      setNotes([]);
    } finally {
      setLoading(false);
    }
  }, [user, blockIds, supabase]);

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

  // Load completed sections and record last-read on chapter open
  const sectionIdsKey = sectionIds.join(",");
  useEffect(() => {
    if (!user || sectionIds.length === 0) return;
    let mounted = true;
    (async () => {
      try {
        const progressRows = await getProgressForUser(supabase);
        if (!mounted) return;
        const completed = new Set(
          progressRows
            .filter((r) => r.completed_at != null && sectionIds.includes(r.section_id))
            .map((r) => r.section_id)
        );
        setCompletedSectionIds(completed);
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
  }, [user, sectionIds, sectionIdsKey, sections, supabase]);

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
      blockIds={blockIds}
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
    <div className="flex flex-col md:flex-row gap-8 md:gap-0">
      <div className="flex-1 min-w-0 max-w-[75ch]">
        <nav
          className="font-sans text-sm mb-8"
          aria-label="Table of contents"
        >
          <h2 className="text-[rgba(0,0,0,0.45)] font-medium mb-2">
            In this chapter
          </h2>
          <ul className="space-y-1">
            {sections.map((section) => {
              const heading = firstHeadingBlock(section);
              const sectionId = getSectionId(section);
              if (!heading || !sectionId) return null;
              const isComplete = completedSectionIds.has(sectionId);
              return (
                <li
                  key={heading.block_id}
                  className="flex items-center gap-2 flex-wrap"
                >
                  <Link
                    href={`#${heading.block_id}`}
                    className="text-[rgba(0,0,0,0.65)] hover:text-[#000] hover:underline"
                  >
                    {heading.content}
                  </Link>
                  {user && (
                    <span className="font-sans text-xs">
                      {isComplete ? (
                        <span className="text-[rgba(0,0,0,0.45)]">
                          Complete
                        </span>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleMarkSectionComplete(sectionId)}
                          className="text-[rgba(0,0,0,0.45)] hover:text-[#000] hover:underline"
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

        <article className="font-serif">
          {sections.map((section) =>
            section.blocks.map((block) => (
              <BlockWithNoteAction
                key={block.block_id}
                block={block}
                hasNote={notesByBlock.has(block.block_id)}
                onAddOrEditNote={handleAddOrEditNote}
              />
            ))
          )}
        </article>

        <nav
          className="font-sans text-sm flex justify-between mt-10 pt-6 border-t border-[#E5E7EB]"
          aria-label="Chapter navigation"
        >
          <span>
            {prevChapter ? (
              <Link
                href={`/course/${prevChapter.id}`}
                className="text-[rgba(0,0,0,0.65)] hover:text-[#000] underline"
              >
                ← Previous: {prevChapter.title}
              </Link>
            ) : (
              <span className="text-[rgba(0,0,0,0.45)]">Previous</span>
            )}
          </span>
          <span>
            {nextChapter ? (
              <Link
                href={`/course/${nextChapter.id}`}
                className="text-[rgba(0,0,0,0.65)] hover:text-[#000] underline"
              >
                Next: {nextChapter.title} →
              </Link>
            ) : (
              <span className="text-[rgba(0,0,0,0.45)]">Next</span>
            )}
          </span>
        </nav>
      </div>

      {/* Desktop: fixed-width notes panel */}
      <aside
        className="hidden md:block w-[360px] shrink-0 border-l border-[#E5E7EB] pl-6"
        aria-label="Notes"
      >
        {loading ? (
          <p className="font-sans text-sm text-[rgba(0,0,0,0.65)]">
            Loading notes…
          </p>
        ) : (
          sharedNotesContent
        )}
      </aside>

      {/* Mobile: notes FAB + drawer */}
      <>
        <button
          type="button"
          onClick={() => setDrawerOpen(true)}
          className="md:hidden fixed bottom-6 right-6 px-4 py-2 rounded border border-[#E5E7EB] bg-[#fff] text-[#000] text-sm font-sans"
        >
          Notes
        </button>
        {drawerOpen && (
          <>
            <div
              className="md:hidden fixed inset-0 z-40 bg-[rgba(0,0,0,0.3)]"
              onClick={() => setDrawerOpen(false)}
              aria-hidden
            />
            <aside
              className="md:hidden fixed right-0 top-0 bottom-0 z-50 w-[min(320px,85vw)] bg-[#fff] border-l border-[#E5E7EB] p-4 overflow-auto"
              aria-label="Notes"
            >
              <div className="flex justify-between items-center mb-4">
                <span className="text-sm font-sans font-medium text-[#000]">
                  Notes
                </span>
                <button
                  type="button"
                  onClick={() => setDrawerOpen(false)}
                  className="p-1 text-[#000]"
                  aria-label="Close notes"
                >
                  ✕
                </button>
              </div>
              {loading ? (
                <p className="font-sans text-sm text-[rgba(0,0,0,0.65)]">
                  Loading notes…
                </p>
              ) : (
                sharedNotesContent
              )}
            </aside>
          </>
        )}
      </>
    </div>
  );
}
