import { Suspense } from "react";
import { CourseSearchPage } from "@/components/CourseSearchPage";

export default function SearchPage() {
  return (
    <Suspense fallback={<p className="slj-muted font-sans text-sm">Loading search…</p>}>
      <CourseSearchPage />
    </Suspense>
  );
}
