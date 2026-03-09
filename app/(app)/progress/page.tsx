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

  const [
    { data: progressRows },
    { data: chapterProgressRows },
  ] = await Promise.all([
    supabase
      .from("progress")
      .select("section_id, completed_at")
      .eq("user_id", user.id),
    supabase
      .from("chapter_progress")
      .select("chapter_id, completed_at")
      .eq("user_id", user.id),
  ]);

  const completedBySection = new Map<string, boolean>();
  for (const row of progressRows ?? []) {
    if (row.completed_at != null) {
      completedBySection.set(row.section_id, true);
    }
  }

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

  let totalSections = 0;
  let completedSections = 0;
  for (const ch of chapters) {
    const sections = getSections(ch);
    for (const s of sections) {
      const sid = getSectionId(s);
      if (sid) {
        totalSections += 1;
        if (completedBySection.get(sid)) completedSections += 1;
      }
    }
  }
  const percent =
    totalSections > 0
      ? Math.round((completedSections / totalSections) * 100)
      : 0;

  const nextChapterForResume = lastRead
    ? chapters.find((ch) => ch.id === lastRead.chapterId)
    : getFirstInteractiveChapter(chapters);
  const nextMilestoneLabel = nextChapterForResume
    ? chapterTitles.get(nextChapterForResume.id) ?? nextChapterForResume.title
    : "Start course";

  return (
    <PageShell className="mx-auto max-w-5xl">
      <section className="mb-12 border-b border-[#E5E7EB] pb-10">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <p className="font-sans text-xs uppercase tracking-[0.18em] text-black/45">
              Progress
            </p>
            <h1 className="mt-4 font-serif text-4xl font-semibold leading-none text-black md:text-5xl">
              Simplicity, Love & Justice
            </h1>
            <p className="mt-4 max-w-xl font-sans text-sm leading-6 text-black/65">
              Keep your place in the course, pick up where you left off, and
              browse the full curriculum from one home screen.
            </p>
          </div>
          <div className="flex items-end gap-3">
            <span className="font-serif text-5xl leading-none text-black">
              {percent}%
            </span>
            <span className="pb-1 font-sans text-xs uppercase tracking-[0.18em] text-black/45">
              Complete
            </span>
          </div>
        </div>
        <div className="mt-8 h-1.5 w-full overflow-hidden rounded-full bg-black/5">
          <div
            className="h-full rounded-full bg-black transition-all duration-500"
            style={{ width: `${percent}%` }}
          />
        </div>
      </section>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-[280px_minmax(0,1fr)]">
        <aside className="space-y-6">
          <div className="slj-card p-6">
            <div>
              <h2 className="font-sans text-xs uppercase tracking-[0.18em] text-black/45">
                Continue
              </h2>
              <p className="mt-3 font-serif text-2xl leading-tight text-black">
                {nextMilestoneLabel}
              </p>
              <p className="mt-2 font-sans text-sm leading-6 text-black/65">
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
            <h2 className="font-sans text-xs uppercase tracking-[0.18em] text-black/45">
              Snapshot
            </h2>
            <dl className="mt-4 space-y-4 font-sans text-sm text-black/65">
              <div className="flex items-center justify-between gap-3">
                <dt>Sections done</dt>
                <dd className="font-medium text-black">
                  {completedSections} / {totalSections}
                </dd>
              </div>
              <div className="flex items-center justify-between gap-3">
                <dt>Next</dt>
                <dd className="text-right font-medium text-black">
                  {nextMilestoneLabel}
                </dd>
              </div>
            </dl>
          </div>
        </aside>

        <div>
          <div className="mb-6 flex items-center justify-between gap-4">
            <div>
              <h2 className="font-sans text-xs uppercase tracking-[0.18em] text-black/45">
                Curriculum
              </h2>
              <p className="mt-2 font-serif text-2xl text-black">All chapters</p>
            </div>
            <span className="font-sans text-sm text-black/65">
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
                      ? "border-black bg-black/5"
                      : "border-[#E5E7EB] bg-white hover:bg-black/5"
                  }`}
                >
                  <div className="mt-0.5 shrink-0">
                    {chapterCompleted ? (
                      <div className="flex h-6 w-6 items-center justify-center rounded-full border border-black bg-black text-white">
                        <Check
                          size={14}
                          strokeWidth={2.5}
                          aria-label="Completed"
                        />
                      </div>
                    ) : isCurrent ? (
                      <div className="flex h-6 w-6 items-center justify-center rounded-full border border-black">
                        <span className="h-2 w-2 rounded-full bg-black" />
                      </div>
                    ) : (
                      <div className="flex h-6 w-6 items-center justify-center rounded-full border border-[#E5E7EB]">
                        <Circle size={14} className="text-black/45" />
                      </div>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <h3 className="font-serif text-2xl leading-tight text-black">
                          {displayTitle}
                        </h3>
                        <p className="mt-2 max-w-xl font-sans text-sm leading-6 text-black/65">
                          {sections[0]
                            ? firstHeadingContent(sections[0])
                            : displayTitle}
                        </p>
                      </div>
                      {chapterCompleted ? (
                        <span className="font-sans text-[11px] uppercase tracking-[0.16em] text-black/45">
                          Completed
                        </span>
                      ) : isCurrent ? (
                        <span className="font-sans text-[11px] uppercase tracking-[0.16em] text-black/45">
                          Current
                        </span>
                      ) : chapter.mode === "static" ? (
                        <span className="font-sans text-[11px] uppercase tracking-[0.16em] text-black/45">
                          Static reading
                        </span>
                      ) : null}
                    </div>
                    <div className="mt-4 flex items-center gap-4 font-sans text-[11px] uppercase tracking-[0.16em] text-black/45">
                      {chapter.mode === "static" ? (
                        <span>Reading only</span>
                      ) : (
                        <span>{sectionCount} sections</span>
                      )}
                    </div>
                  </div>
                  <div className="hidden shrink-0 self-center text-black/45 transition-colors group-hover:text-black md:block">
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
