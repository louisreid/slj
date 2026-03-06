import Link from "next/link";
import { Check, Play, Circle, ArrowRight } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { getChapters, getSections } from "@/lib/content";
import { getLastReadPosition } from "@/lib/progress-actions";
import { PageShell } from "@/components/ui/surfaces";
import type { Section } from "@/lib/content";

function getSectionId(section: Section): string | undefined {
  return section.blocks[0]?.block_id;
}

function firstHeadingContent(section: Section): string {
  const heading = section.blocks.find((b) => b.type === "heading");
  return heading?.content ?? "Section";
}

export default async function ProgressPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return (
      <PageShell>
        <h1 className="text-3xl font-semibold text-[#fff] font-serif">Progress</h1>
        <p className="mt-2 text-white/70">Sign in to view your progress.</p>
      </PageShell>
    );
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
    : chapters[0];
  const nextMilestoneLabel = nextChapterForResume
    ? nextChapterForResume.title
    : "Start course";

  return (
    <PageShell className="max-w-[960px] mx-auto">
      {/* Progress header — Stitch-style */}
      <section className="mb-12 md:mb-16 text-center md:text-left">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-white/55">
              Current Course
            </span>
            <h2 className="text-4xl md:text-5xl font-extrabold tracking-tighter text-white font-serif">
              Simplicity, Love & Justice
            </h2>
          </div>
          <div className="flex flex-col items-center md:items-end gap-2">
            <span className="text-3xl font-light tracking-tighter text-white">
              {percent}%{" "}
              <span className="text-sm font-medium uppercase tracking-widest text-white/55">
                Complete
              </span>
            </span>
          </div>
        </div>
        <div className="mt-8 w-full h-1 bg-white/10 rounded-full overflow-hidden">
          <div
            className="h-full bg-white rounded-full transition-all duration-500"
            style={{ width: `${percent}%` }}
          />
        </div>
        <p className="mt-4 text-sm text-white/55 font-medium italic">
          &ldquo;Justice is what love looks like in public.&rdquo; — Cornel West
        </p>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
        {/* Sidebar: Resume & stats */}
        <aside className="md:col-span-4 space-y-8">
          <div className="p-6 rounded-xl border border-white/10 bg-white/5 space-y-6">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-widest mb-4 text-white/75">
                Resume Learning
              </h3>
              <Link
                href={
                  lastRead
                    ? `/course/${lastRead.chapterId}#${lastRead.blockId}`
                    : chapters[0]
                      ? `/course/${chapters[0].id}`
                      : "/course"
                }
                className="w-full bg-white text-black py-4 rounded-lg font-bold text-sm uppercase tracking-widest hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
              >
                <span>Continue</span>
                <Play size={18} strokeWidth={2.5} />
              </Link>
            </div>
            <div className="pt-6 border-t border-white/10 space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-xs text-white/55 uppercase tracking-wider">
                  Sections done
                </span>
                <span className="text-sm font-semibold text-white">
                  {completedSections} / {totalSections}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-white/55 uppercase tracking-wider">
                  Next
                </span>
                <span className="text-sm font-semibold text-white">
                  {nextMilestoneLabel}
                </span>
              </div>
            </div>
          </div>
        </aside>

        {/* Main: Course curriculum cards */}
        <div className="md:col-span-8">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-bold tracking-tight text-white">
              Course Curriculum
            </h3>
          </div>
          <div className="space-y-4">
            {chapters.map((chapter) => {
              const sections = getSections(chapter);
              const sectionCount = sections.filter((s) =>
                getSectionId(s)
              ).length;
              const chapterCompleted = completedByChapter.get(chapter.id);
              const isCurrent =
                lastRead?.chapterId === chapter.id && !chapterCompleted;

              return (
                <Link
                  key={chapter.id}
                  href={`/course/${chapter.id}`}
                  className={`group flex items-start gap-6 p-6 rounded-xl border transition-all ${
                    isCurrent
                      ? "border-2 border-white bg-white/5"
                      : "border-white/10 bg-white/5 hover:border-white/20"
                  }`}
                >
                  <div className="mt-1 flex-shrink-0">
                    {chapterCompleted ? (
                      <div className="h-6 w-6 rounded-full bg-white flex items-center justify-center">
                        <Check
                          size={14}
                          strokeWidth={2.5}
                          className="text-black"
                          aria-label="Completed"
                        />
                      </div>
                    ) : isCurrent ? (
                      <div className="h-6 w-6 rounded-full border-2 border-white flex items-center justify-center">
                        <span className="h-2 w-2 rounded-full bg-white animate-pulse" />
                      </div>
                    ) : (
                      <div className="h-6 w-6 rounded-full border border-white/20 flex items-center justify-center">
                        <Circle size={14} className="text-white/50" />
                      </div>
                    )}
                  </div>
                  <div className="flex-grow min-w-0">
                    <div className="flex justify-between items-start mb-1 gap-2 flex-wrap">
                      <h4 className="font-bold text-lg tracking-tight text-white group-hover:text-white transition-colors">
                        {chapter.title}
                      </h4>
                      {chapterCompleted ? (
                        <span className="text-[10px] font-bold uppercase tracking-widest bg-white/10 px-2 py-0.5 rounded text-white/70">
                          Completed
                        </span>
                      ) : isCurrent ? (
                        <span className="text-[10px] font-bold uppercase tracking-widest bg-white text-black px-2 py-0.5 rounded">
                          Current
                        </span>
                      ) : null}
                    </div>
                    <p className="text-sm text-white/55 leading-relaxed max-w-lg mb-4">
                      {sections[0]
                        ? firstHeadingContent(sections[0])
                        : chapter.title}
                    </p>
                    <div className="flex items-center gap-4 text-[11px] font-bold uppercase tracking-widest text-white/55">
                      <span>{sectionCount} sections</span>
                    </div>
                  </div>
                  <div className="hidden md:flex self-center p-2 rounded-full border border-white/10 group-hover:bg-white group-hover:text-black text-white transition-all shrink-0">
                    <ArrowRight size={18} strokeWidth={2} />
                  </div>
                </Link>
              );
            })}
          </div>
          <div className="mt-12 text-center">
            <Link
              href="/course/all"
              className="inline-block text-xs font-bold uppercase tracking-widest py-3 px-8 rounded border border-white/20 hover:bg-white hover:text-black text-white transition-all"
            >
              View full book
            </Link>
          </div>
        </div>
      </div>
    </PageShell>
  );
}
