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
import type { Chapter, Section } from "@/lib/content";
import { NotesPanelContent } from "@/components/NotesPanelContent";
import { getSectionId, BlockNode, BlockWithNoteAction } from "@/components/BlockContent";

export interface FullBookReaderProps {
  chapters: Chapter[];
  blockIds: string[];
  blockIdToLabel: Record<string, string>;
}

export function FullBookReader({
  chapters,
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
    const m = new Map<string, string>();
    for (const ch of chapters) {
      for (const section of ch.sections) {
        const sid = getSectionId(section);
        if (sid) for (const b of section.blocks) m.set(b.block_id, sid);
      }
    }
    return m;
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

  useEffect(() => {
    const hash = window.location.hash.slice(1);
    if (!hash) return;
    const el = document.getElementById(hash);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, []);

  const notesByBlock = new Map(notes.map((n) => [n.block_id, n]));

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
    <div className="flex flex-col md:flex-row gap-8 md:gap-6">
      <div className="flex-1 min-w-0 max-w-[78ch]">
        <nav
          className="font-sans text-sm mb-8 slj-card p-5"
          aria-label="Table of contents"
        >
          <h2 className="text-white/55 font-medium mb-3 uppercase tracking-[0.12em] text-xs">
            All chapters
          </h2>
          <ul className="space-y-1">
            {chapters.map((chapter) => (
              <li key={chapter.id}>
                <Link
                  href={`#${chapter.id}`}
                  className="text-white/75 hover:text-white hover:underline underline-offset-2"
                >
                  {chapter.title}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <article className="font-serif slj-shell p-6 md:p-10">
          {chapters.map((chapter) => (
            <section key={chapter.id} id={chapter.id}>
              <h1 className="font-serif font-semibold text-[#fff] mt-10 first:mt-0 text-3xl leading-tight">
                {chapter.title}
              </h1>
              {chapter.sections.map((section) =>
                section.blocks.map((block) =>
                  block.type === "paragraph" ? (
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
            </section>
          ))}
        </article>
      </div>

      {/* Desktop: fixed-width notes panel */}
      <aside
        className="hidden md:block w-[360px] shrink-0 slj-shell p-5"
        aria-label="Notes"
      >
        {loading ? (
          <p className="font-sans text-sm text-white/70">Loading notes…</p>
        ) : (
          sharedNotesContent
        )}
      </aside>

      {/* Mobile: notes FAB + drawer */}
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
    </div>
  );
}
