export default function Home() {
  return (
    <div className="space-y-10">
      {/* Hero */}
      <section className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-7 shadow-sm md:p-10">
        {/* subtle background */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(59,130,246,0.10),transparent_40%),radial-gradient(circle_at_80%_30%,rgba(16,185,129,0.10),transparent_45%)]" />

        <div className="relative">
          <div className="flex flex-wrap gap-2">
            <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-600">
              Knowledge hub
            </span>
            <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-600">
              Policy-ready
            </span>
            <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-600">
              Startup ↔ Investor
            </span>
          </div>

          <h1 className="mt-4 text-4xl font-extrabold tracking-tight md:text-5xl">
            CECECO Hub MVP
          </h1>

          <p className="mt-4 max-w-3xl text-base leading-7 text-slate-700">
            A structured regional portal for clean-energy initiatives across
            CECECO member countries — combining a curated knowledge base
            (policies, roadmaps, datasets) with a searchable directory of
            projects, startups, investors, and partners.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <a
              href="/countries"
              className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-slate-800"
            >
              Explore Countries →
            </a>

            <a
              href="http://localhost:8000/docs"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-800 shadow-sm hover:bg-slate-50"
            >
              Open API Docs
            </a>
          </div>

          <div className="mt-7 grid gap-3 sm:grid-cols-3">
            <div className="rounded-2xl border border-slate-200 bg-white/70 p-4">
              <div className="text-sm font-semibold text-slate-900">
                Live structure
              </div>
              <div className="mt-1 text-sm text-slate-600">
                PostgreSQL + migrations + clean API layers
              </div>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white/70 p-4">
              <div className="text-sm font-semibold text-slate-900">
                Country briefings
              </div>
              <div className="mt-1 text-sm text-slate-600">
                Indicators, frameworks, policies, and latest updates
              </div>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white/70 p-4">
              <div className="text-sm font-semibold text-slate-900">
                Ecosystem directory
              </div>
              <div className="mt-1 text-sm text-slate-600">
                Projects, startups, investors — filterable and searchable
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Cards */}
      <section className="grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="text-base font-bold">What it solves</h3>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-6 text-slate-700">
            <li>Hard to find reliable, comparable clean energy info</li>
            <li>Fragmented startup + investor landscape</li>
            <li>
              Lack of “single source of truth” for policy + implementation
            </li>
          </ul>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="text-base font-bold">MVP modules</h3>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-6 text-slate-700">
            <li>Countries (done)</li>
            <li>Projects registry (done)</li>
            <li>Startups & investors directory (done)</li>
            <li>Knowledge library (next)</li>
          </ul>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="text-base font-bold">Why this is credible</h3>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-6 text-slate-700">
            <li>Structured data model (PostgreSQL + migrations)</li>
            <li>Transparent API (OpenAPI/Swagger)</li>
            <li>Deployment-ready (Docker Compose)</li>
          </ul>
        </div>
      </section>
    </div>
  );
}
