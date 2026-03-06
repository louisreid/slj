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
import { upsertProgress } from "@/lib/progress";
import type { Chapter } from "@/lib/content";
import { NotesPanelContent } from "@/components/NotesPanelContent";
import {
  getSectionId,
  BlockNode,
  BlockWithNoteAction,
} from "@/components/BlockContent";

export interface FullBookReaderProps {
  chapters: Chapter[];
  chapterTitles: Record<string, string>;
  blockIds: string[];
  blockIdToLabel: Record<string, string>;
}

export function FullBookReader({
  chapters,
  chapterTitles,
  blockIds,
  blockIdToLabel,
}: FullBookReaderProps) {
  const [user, setUser] = useState<{ id: string } | null>(null);
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [scrollToBlockId, setScrollToBlockId] = useState<string | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const supabase = createClient();

  const blockIdToSectionId = useMemo(() => {
    const map = new Map<string, string>();
    for (const chapter of chapters) {
      for (const section of chapter.sections) {
        const sectionId = getSectionId(section);
        if (sectionId) {
          for (const block of section.blocks) {
            map.set(block.block_id, sectionId);
          }
        }
      }
    }
    return map;
  }, [chapters]);

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
    supabase.auth.getUser().then(({ data: { user: authUser } }) => {
      if (mounted) {
        setUser(authUser ? { id: authUser.id } : null);
      }
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

  useEffect(() => {
    const hash = window.location.hash.slice(1);
    if (!hash) return;

    const element = document.getElementById(hash);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, []);

  const notesByBlock = new Map(notes.map((note) => [note.block_id, note]));

  const handleAddOrEditNote = useCallback(
    async (blockId: string) => {
      if (!user) return;

      try {
        await upsertNote(supabase, blockId, "");
        const sectionId = blockIdToSectionId.get(blockId);
        if (sectionId) {
          await upsertProgress(supabase, sectionId, { last_block_id: blockId });
        }
        await refetch();
        setScrollToBlockId(blockId);
        setDrawerOpen(true);
      } catch {
        // ignore
      }
    },
    [user, supabase, blockIdToSectionId, refetch]
  );

  const handleUpsert = useCallback(
    async (blockId: string, body: string) => {
      await upsertNote(supabase, blockId, body);
      const sectionId = blockIdToSectionId.get(blockId);
      if (sectionId) {
        await upsertProgress(supabase, sectionId, { last_block_id: blockId });
      }
      await refetch();
    },
    [supabase, blockIdToSectionId, refetch]
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
      title="Notes across the course"
      emptyMessage="Use “Add note” next to a session paragraph to add a note."
    />
  );

  return (
    <div className="flex flex-col gap-8 md:flex-row md:gap-6">
      <div className="min-w-0 max-w-[78ch] flex-1">
        <nav className="mb-8 slj-card p-5 font-sans text-sm" aria-label="Table of contents">
          <h2 className="mb-3 font-sans text-xs uppercase tracking-[0.18em] text-black/45">
            All chapters
          </h2>
          <ul className="space-y-1">
            {chapters.map((chapter) => (
              <li key={chapter.id}>
                <Link
                  href={`#${chapter.id}`}
                  className="text-black/65 hover:text-black hover:underline underline-offset-4"
                >
                  {chapterTitles[chapter.id] ?? chapter.title}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <article className="slj-shell p-6 font-serif md:p-10">
          {chapters.map((chapter) => (
            <section key={chapter.id} id={chapter.id} className="mt-12 first:mt-0">
              <div className="mb-6 border-b border-[#E5E7EB] pb-4">
                <div className="flex flex-wrap items-center gap-3">
                  <h1 className="font-serif text-4xl font-semibold leading-none text-black md:text-5xl">
                    {chapterTitles[chapter.id] ?? chapter.title}
                  </h1>
                  {chapter.mode === "static" ? (
                    <span className="font-sans text-[11px] uppercase tracking-[0.18em] text-black/45">
                      Static reading
                    </span>
                  ) : null}
                </div>
              </div>
              <div>
                {chapter.sections.map((section) =>
                  section.blocks.map((block) =>
                    chapter.mode !== "static" && block.type === "paragraph" ? (
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
              </div>
            </section>
          ))}
        </article>
      </div>

      <aside
        className="hidden w-[360px] shrink-0 slj-shell p-5 md:block"
        aria-label="Notes"
      >
        {loading ? (
          <p className="font-sans text-sm text-black/65">Loading notes...</p>
        ) : (
          sharedNotesContent
        )}
      </aside>

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
    </div>
  );
}
