import Link from "next/link";
import { redirect } from "next/navigation";
import { Check, Play, Circle, ArrowRight } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import {
  getChapterDisplayTitleMap,
  getChapters,
  getFirstInteractiveChapter,
  getResumeHref,
  getSections,
} from "@/lib/content";
import { getLastReadPosition } from "@/lib/progress-actions";
import { PageShell } from "@/components/ui/surfaces";
import type { Section } from "@/lib/content";
import { buildSignInHref } from "@/lib/navigation";

function getSectionId(section: Section): string | undefined {
  return section.blocks[0]?.block_id;
}

function firstHeadingContent(section: Section): string {
  const heading = section.blocks.find((b) => b.type === "heading");
  return heading?.content ?? "Section";
}

export async function ProgressDashboard() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const { data: chapterProgressRows } = await supabase
    .from("chapter_progress")
    .select("chapter_id, completed_at")
    .eq("user_id", user.id);

  const completedByChapter = new Map<string, boolean>();
  for (const row of chapterProgressRows ?? []) {
    if (row.completed_at != null) {
      completedByChapter.set(row.chapter_id, true);
    }
  }

  const lastRead = await getLastReadPosition();
  const chapters = getChapters();
  const chapterTitles = getChapterDisplayTitleMap(chapters);
  const continueHref = getResumeHref(chapters, lastRead);

  const totalChapters = chapters.length;
  const completedChapters = chapters.filter((ch) =>
    completedByChapter.get(ch.id)
  ).length;
  const percent =
    totalChapters > 0
      ? Math.round((completedChapters / totalChapters) * 100)
      : 0;

  const nextChapterForResume = lastRead
    ? chapters.find((ch) => ch.id === lastRead.chapterId)
    : getFirstInteractiveChapter(chapters);
  const nextMilestoneLabel = nextChapterForResume
    ? chapterTitles.get(nextChapterForResume.id) ?? nextChapterForResume.title
    : "Start course";

  return (
    <PageShell className="mx-auto max-w-5xl">
      <section className="mb-12 border-b border-[var(--slj-border)] pb-10">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <p className="slj-faint font-sans text-xs uppercase tracking-[0.18em]">
              Progress
            </p>
            <h1 className="mt-4 font-serif text-4xl font-semibold leading-none text-[var(--slj-text)] md:text-5xl">
              Simplicity, Love & Justice
            </h1>
          </div>
          <div className="flex items-end gap-3">
            <span className="font-serif text-5xl leading-none text-[var(--slj-text)]">
              {percent}%
            </span>
            <span className="slj-faint pb-1 font-sans text-xs uppercase tracking-[0.18em]">
              Complete
            </span>
          </div>
        </div>
        <div className="mt-8 h-1.5 w-full overflow-hidden rounded-full bg-[var(--slj-hover)]">
          <div
            className="h-full rounded-full bg-[var(--slj-text)] transition-all duration-500"
            style={{ width: `${percent}%` }}
          />
        </div>
      </section>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-[280px_minmax(0,1fr)]">
        <aside className="space-y-6">
          <div className="slj-card p-6">
            <div>
              <h2 className="slj-faint font-sans text-xs uppercase tracking-[0.18em]">
                Continue
              </h2>
              <p className="mt-3 font-serif text-2xl leading-tight text-[var(--slj-text)]">
                {nextMilestoneLabel}
              </p>
              <p className="slj-muted mt-2 font-sans text-sm leading-6">
                Return to your last place in the course, or begin at the first
                session if you have not started yet.
              </p>
            </div>
            <div className="mt-6">
              <Link
                href={continueHref}
                className="slj-button inline-flex w-full items-center justify-center gap-2 px-4 py-3 text-sm"
              >
                <span>Continue</span>
                <Play size={16} strokeWidth={2.25} />
              </Link>
            </div>
          </div>

          <div className="slj-card p-6">
            <h2 className="slj-faint font-sans text-xs uppercase tracking-[0.18em]">
              Snapshot
            </h2>
            <dl className="slj-muted mt-4 space-y-4 font-sans text-sm">
              <div className="flex items-center justify-between gap-3">
                <dt>Chapters completed</dt>
                <dd className="font-medium text-[var(--slj-text)]">
                  {completedChapters} / {totalChapters}
                </dd>
              </div>
              <div className="flex items-center justify-between gap-3">
                <dt>Next</dt>
                <dd className="text-right font-medium text-[var(--slj-text)]">
                  {nextMilestoneLabel}
                </dd>
              </div>
            </dl>
          </div>
        </aside>

        <div>
          <div className="mb-6 flex items-center justify-between gap-4">
            <div>
              <h2 className="slj-faint font-sans text-xs uppercase tracking-[0.18em]">
                Curriculum
              </h2>
              <p className="mt-2 font-serif text-2xl text-[var(--slj-text)]">All chapters</p>
            </div>
            <span className="slj-muted font-sans text-sm">
              &nbsp;
            </span>
          </div>

          <div className="space-y-3">
            {chapters.map((chapter) => {
              const sections = getSections(chapter);
              const sectionCount = sections.filter((s) =>
                getSectionId(s)
              ).length;
              const chapterCompleted = completedByChapter.get(chapter.id);
              const isCurrent =
                lastRead?.chapterId === chapter.id && !chapterCompleted;
              const displayTitle = chapterTitles.get(chapter.id) ?? chapter.title;

              return (
                <Link
                  key={chapter.id}
                  href={`/course/${chapter.id}`}
                  className={`group flex items-start gap-4 border p-5 transition-colors ${
                    isCurrent
                      ? "border-[var(--slj-text)] bg-[var(--slj-hover)]"
                      : "border-[var(--slj-border)] bg-[var(--slj-surface)] hover:bg-[var(--slj-hover)]"
                  }`}
                >
                  <div className="mt-0.5 shrink-0">
                    {chapterCompleted ? (
                      <div className="flex h-6 w-6 items-center justify-center rounded-full border border-[var(--slj-button-bg)] bg-[var(--slj-button-bg)] text-[var(--slj-button-fg)]">
                        <Check
                          size={14}
                          strokeWidth={2.5}
                          aria-label="Completed"
                        />
                      </div>
                    ) : isCurrent ? (
                      <div className="flex h-6 w-6 items-center justify-center rounded-full border border-[var(--slj-text)]">
                        <span className="h-2 w-2 rounded-full bg-[var(--slj-text)]" />
                      </div>
                    ) : (
                      <div className="flex h-6 w-6 items-center justify-center rounded-full border border-[var(--slj-border)]">
                        <Circle size={14} className="slj-faint" />
                      </div>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <h3 className="font-serif text-2xl leading-tight text-[var(--slj-text)]">
                          {displayTitle}
                        </h3>
                        <p className="slj-muted mt-2 max-w-xl font-sans text-sm leading-6">
                          {sections[0]
                            ? firstHeadingContent(sections[0])
                            : displayTitle}
                        </p>
                      </div>
                      {chapterCompleted ? (
                        <span className="slj-faint font-sans text-[11px] uppercase tracking-[0.16em]">
                          Completed
                        </span>
                      ) : isCurrent ? (
                        <span className="slj-faint font-sans text-[11px] uppercase tracking-[0.16em]">
                          Current
                        </span>
                      ) : null}
                    </div>
                    {chapter.mode !== "static" && (
                      <div className="slj-faint mt-4 flex items-center gap-4 font-sans text-[11px] uppercase tracking-[0.16em]">
                        <span>{sectionCount} sections</span>
                      </div>
                    )}
                  </div>
                  <div className="slj-faint hidden shrink-0 self-center transition-colors group-hover:text-[var(--slj-text)] md:block">
                    <ArrowRight size={18} strokeWidth={2} />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </PageShell>
  );
}

export default async function ProgressPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(buildSignInHref("/progress"));
  }

  redirect("/");
}
