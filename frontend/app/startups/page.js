import { Suspense } from "react";
import ProjectListClient from "../components/ProjectListClient";

export default function StartupsPage() {
  return (
    <Suspense
      fallback={
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="text-sm text-slate-600">Loading startups…</div>
        </div>
      }
    >
      <ProjectListClient
        defaultKind="startup"
        title="Startups"
        subtitle="Search and filter startups across CECECO countries. Use matching to see relevant investors."
      />
    </Suspense>
  );
}
