import Link from "next/link";
import { Check } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { getChapters, getSections } from "@/lib/content";
import { getLastReadPosition } from "@/lib/progress-actions";
import { CardSection, PageShell } from "@/components/ui/surfaces";
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
        <p className="mt-2 text-white/70">
          Sign in to view your progress.
        </p>
      </PageShell>
    );
  }

  const { data: progressRows } = await supabase
    .from("progress")
    .select("section_id, completed_at")
    .eq("user_id", user.id);

  const completedBySection = new Map<string, boolean>();
  for (const row of progressRows ?? []) {
    if (row.completed_at != null) {
      completedBySection.set(row.section_id, true);
    }
  }

  const lastRead = await getLastReadPosition();
  const chapters = getChapters();

  return (
    <PageShell>
      <p className="text-xs uppercase tracking-[0.16em] text-white/55">Overview</p>
      <h1 className="mt-2 text-3xl font-semibold text-[#fff] font-serif">Progress</h1>

      {lastRead && (
        <p className="mt-5">
          <Link
            href={`/course/${lastRead.chapterId}#${lastRead.blockId}`}
            className="text-white/75 hover:text-white underline underline-offset-2"
          >
            Resume reading
          </Link>
        </p>
      )}

      <div className="mt-8 space-y-6">
        {chapters.map((chapter) => {
          const sections = getSections(chapter);
          return (
            <CardSection key={chapter.id}>
              <h2 className="font-serif text-2xl font-semibold text-[#fff] mb-3">
                {chapter.title}
              </h2>
              <ul className="space-y-2 text-sm">
                {sections.map((section) => {
                  const sectionId = getSectionId(section);
                  if (!sectionId) return null;
                  const completed = completedBySection.get(sectionId);
                  return (
                    <li
                      key={sectionId}
                      className="flex items-center gap-2 text-white/75"
                    >
                      <span
                        className={completed ? "text-white" : "text-white/70"}
                      >
                        {firstHeadingContent(section)}
                      </span>
                      {completed && (
                        <Check
                          size={16}
                          strokeWidth={2.5}
                          className="text-green-500 shrink-0"
                          aria-label="Complete"
                        />
                      )}
                    </li>
                  );
                })}
              </ul>
            </CardSection>
          );
        })}
      </div>
    </PageShell>
  );
}
