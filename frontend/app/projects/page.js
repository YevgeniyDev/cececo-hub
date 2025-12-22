import { Suspense } from "react";
import ProjectListClient from "../components/ProjectListClient";

export default function ProjectsPage() {
  return (
    <Suspense
      fallback={
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="text-sm text-slate-600">Loading projects…</div>
        </div>
      }
    >
      <ProjectListClient
        defaultKind="project"
        title="Projects"
        subtitle="Search and filter projects across CECECO countries. Use matching to see relevant investors."
      />
    </Suspense>
  );
}
