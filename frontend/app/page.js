export default function Home() {
  const apiBase =
    process.env.NEXT_PUBLIC_API_BASE ||
    process.env.API_INTERNAL_BASE ||
    "https://cececo-hub.onrender.com";

  const apiDocsUrl = `${String(apiBase).replace(/\/+$/, "")}/docs`;

  return (
    <div className="space-y-14">
      {/* HERO */}
      <section className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        {/* background */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -left-24 -top-24 h-72 w-72 rounded-full bg-blue-500/10 blur-3xl" />
          <div className="absolute -right-28 top-10 h-80 w-80 rounded-full bg-emerald-500/10 blur-3xl" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(59,130,246,0.10),transparent_40%),radial-gradient(circle_at_85%_25%,rgba(16,185,129,0.10),transparent_45%)]" />
        </div>

        <div className="relative p-7 md:p-10">
          {/* Top badges */}
          <div className="flex flex-wrap gap-2">
            <span className="inline-flex items-center rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-700">
              CECECO knowledge hub
            </span>
            <span className="inline-flex items-center rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-700">
              Data-driven decision support
            </span>
            <span className="inline-flex items-center rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-700">
              Startup ↔ Investor matching
            </span>
            <span className="inline-flex items-center rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-700">
              Live clean-energy updates (GDELT)
            </span>
          </div>

          <div className="mt-6 grid gap-8 lg:grid-cols-2 lg:items-center">
            {/* Left */}
            <div>
              <h1 className="text-4xl font-extrabold tracking-tight text-slate-950 md:text-5xl">
                A digital clean-energy hub built for CECECO’s hackathon goals
              </h1>

              <p className="mt-4 max-w-xl text-base leading-7 text-slate-700">
                CECECO Hub is a regional platform that turns scattered
                clean-energy information into{" "}
                <span className="font-semibold text-slate-900">
                  actionable insight
                </span>
                : country readiness signals, policy context, project/startup
                pipelines, investor discovery, and explainable matching — backed
                by live news monitoring.
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                <a
                  href="/countries"
                  className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-slate-800"
                >
                  Explore countries →
                </a>
                <a
                  href="/projects"
                  className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-900 shadow-sm hover:bg-slate-50"
                >
                  Browse projects
                </a>
                <a
                  href="/news"
                  className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-900 shadow-sm hover:bg-slate-50"
                >
                  Live updates
                </a>
              </div>

              <div className="mt-5 text-xs text-slate-500">
                Transparency note: country indicators are curated in the MVP
                (methodology shown). News is fetched from public sources via
                GDELT and may include global items filtered by relevance.
              </div>
            </div>

            {/* Right panel: "Why this fits the hackathon" */}
            <div className="rounded-3xl border border-slate-200 bg-white/70 p-5 shadow-sm backdrop-blur-sm">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <div className="text-sm font-extrabold text-slate-900">
                    Why CECECO Hub fits the call
                  </div>
                  <div className="mt-1 text-sm text-slate-600">
                    Built exactly under “Data for Policy, Planning &
                    Implementation”
                  </div>
                </div>
                <a
                  href={apiDocsUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-800 shadow-sm hover:bg-slate-50"
                >
                  API Docs
                </a>
              </div>

              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl border border-slate-200 bg-white p-4">
                  <div className="text-xs font-extrabold uppercase tracking-wide text-slate-500">
                    Hackathon objective
                  </div>
                  <div className="mt-2 text-sm font-semibold text-slate-900">
                    Raise awareness + clarity
                  </div>
                  <div className="mt-1 text-sm text-slate-600">
                    Makes clean-energy progress visible: indicators + policies +
                    updates in one place.
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-4">
                  <div className="text-xs font-extrabold uppercase tracking-wide text-slate-500">
                    Hackathon objective
                  </div>
                  <div className="mt-2 text-sm font-semibold text-slate-900">
                    Data-driven solutions
                  </div>
                  <div className="mt-1 text-sm text-slate-600">
                    Queryable country dashboards + filterable ecosystem
                    directory for real decisions.
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-4">
                  <div className="text-xs font-extrabold uppercase tracking-wide text-slate-500">
                    Hackathon theme
                  </div>
                  <div className="mt-2 text-sm font-semibold text-slate-900">
                    Data for policy & planning
                  </div>
                  <div className="mt-1 text-sm text-slate-600">
                    Country readiness signals + policy context to support
                    implementation planning.
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-4">
                  <div className="text-xs font-extrabold uppercase tracking-wide text-slate-500">
                    Hackathon theme
                  </div>
                  <div className="mt-2 text-sm font-semibold text-slate-900">
                    Startup ↔ investor portal
                  </div>
                  <div className="mt-1 text-sm text-slate-600">
                    Explainable matching (0–100) with reasons: country, sector,
                    stage.
                  </div>
                </div>
              </div>

              <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <div className="text-xs font-extrabold uppercase tracking-wide text-slate-500">
                  “60-second demo” flow
                </div>
                <div className="mt-2 text-sm text-slate-700">
                  Pick a country → review readiness & policy signals → open a
                  project/startup → see top investor matches with a transparent
                  score breakdown.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ALIGNMENT STRIP: objectives + what the platform delivers */}
      <section className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm md:p-10">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-extrabold tracking-tight text-slate-950">
              Direct alignment with the hackathon objectives
            </h2>
            <p className="mt-2 max-w-3xl text-sm text-slate-600">
              This platform is designed to be useful to policymakers, startups,
              investors, and youth teams — not just a directory.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <a
              href="/news"
              className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-900 shadow-sm hover:bg-slate-50"
            >
              View live news
            </a>
            <a
              href="/investors"
              className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-900 shadow-sm hover:bg-slate-50"
            >
              Browse investors
            </a>
          </div>
        </div>

        <div className="mt-7 grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
            <div className="text-xs font-extrabold uppercase tracking-wide text-slate-500">
              Objective 1
            </div>
            <div className="mt-2 text-base font-bold text-slate-900">
              Public awareness of clean energy
            </div>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              A single regional hub with country pages and live updates makes
              the transition tangible and trackable — per country and across the
              region.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
            <div className="text-xs font-extrabold uppercase tracking-wide text-slate-500">
              Objective 2
            </div>
            <div className="mt-2 text-base font-bold text-slate-900">
              Digital + data-driven solutions
            </div>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Structured indicators, searchable directories, and explainable
              scoring — built for decisions, planning, and implementation
              review.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
            <div className="text-xs font-extrabold uppercase tracking-wide text-slate-500">
              Objective 3
            </div>
            <div className="mt-2 text-base font-bold text-slate-900">
              Youth leadership + innovation
            </div>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              A deployable prototype that can be extended by youth teams:
              ingestion-ready APIs, modular pages, and visible methodology.
            </p>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm md:p-10">
        <div>
          <h2 className="text-2xl font-extrabold tracking-tight text-slate-950">
            Built for the exact “portal + matching” requirement
          </h2>
          <p className="mt-2 max-w-2xl text-sm text-slate-600">
            A platform connecting clean-energy startups with investors, and a
            knowledge hub showing potential, action plans, and regulatory
            frameworks — built as a working product, not a slide deck.
          </p>
        </div>

        <div className="mt-7 grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
            <div className="flex items-center gap-3">
              <div className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-white text-sm font-extrabold text-slate-900 shadow-sm">
                1
              </div>
              <div className="text-sm font-bold text-slate-900">
                Knowledge hub by country
              </div>
            </div>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              Readiness indicators, policy frameworks, and live updates —
              designed for side-by-side comparison.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
            <div className="flex items-center gap-3">
              <div className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-white text-sm font-extrabold text-slate-900 shadow-sm">
                2
              </div>
              <div className="text-sm font-bold text-slate-900">
                Ecosystem directory
              </div>
            </div>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              Projects, startups, and investors with filters that match real
              evaluation workflows.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
            <div className="flex items-center gap-3">
              <div className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-white text-sm font-extrabold text-slate-900 shadow-sm">
                3
              </div>
              <div className="text-sm font-bold text-slate-900">
                Explainable matching
              </div>
            </div>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              Open a project card → see top investor matches scored 0–100 with
              reasons and breakdown.
            </p>
          </div>
        </div>
      </section>

      {/* USE CASES */}
      <section className="grid gap-4 lg:grid-cols-3">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="text-xs font-extrabold uppercase tracking-wide text-slate-500">
            For policymakers
          </div>
          <div className="mt-2 text-base font-bold text-slate-900">
            Planning + implementation support
          </div>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-6 text-slate-600">
            <li>Compare readiness indicators across CECECO countries</li>
            <li>Track relevant policy/regulatory signals via live updates</li>
            <li>Identify priority sectors, constraints, and investment gaps</li>
          </ul>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="text-xs font-extrabold uppercase tracking-wide text-slate-500">
            For startups
          </div>
          <div className="mt-2 text-base font-bold text-slate-900">
            Faster investor discovery
          </div>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-6 text-slate-600">
            <li>Find aligned capital by sector + stage + geography</li>
            <li>Use match reasons to justify outreach and positioning</li>
            <li>Use country context to tailor market-entry narrative</li>
          </ul>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="text-xs font-extrabold uppercase tracking-wide text-slate-500">
            For investors
          </div>
          <div className="mt-2 text-base font-bold text-slate-900">
            Context-aware pipeline
          </div>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-6 text-slate-600">
            <li>Shortlist startups/projects with explainable scoring</li>
            <li>Validate geo-policy fit before outreach</li>
            <li>Use news signals as lightweight diligence prompts</li>
          </ul>
        </div>
      </section>

      {/* CTA */}
      <section className="relative overflow-hidden rounded-3xl border border-slate-200 bg-slate-950 p-7 text-white shadow-sm md:p-10">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -left-24 -top-24 h-72 w-72 rounded-full bg-blue-500/20 blur-3xl" />
          <div className="absolute -right-28 top-10 h-80 w-80 rounded-full bg-emerald-500/20 blur-3xl" />
        </div>

        <div className="relative flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-extrabold tracking-tight">
              Demo the platform like a finished product
            </h2>
            <p className="mt-2 max-w-2xl text-sm text-white/80">
              Start with a country briefing → open a project → show the matching
              widget → validate with live news.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <a
              href="/countries"
              className="inline-flex items-center justify-center rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-slate-900 shadow-sm hover:bg-slate-100"
            >
              Explore countries →
            </a>
            <a
              href="/projects"
              className="inline-flex items-center justify-center rounded-xl border border-white/20 bg-white/5 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-white/10"
            >
              Browse projects
            </a>
            <a
              href="/news"
              className="inline-flex items-center justify-center rounded-xl border border-white/20 bg-white/5 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-white/10"
            >
              Open live updates
            </a>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm md:p-10">
        <h2 className="text-2xl font-extrabold tracking-tight text-slate-950">
          FAQs
        </h2>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
            <div className="text-sm font-bold text-slate-900">
              Is the news real-time?
            </div>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Yes — news links are fetched from public sources via the GDELT API
              and shown as live updates with search and filtering.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
            <div className="text-sm font-bold text-slate-900">
              What makes this “data-driven”?
            </div>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              The platform is built around structured indicators and queryable
              models (countries, projects, investors), with explainable matching
              that shows its scoring logic.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
            <div className="text-sm font-bold text-slate-900">
              Can curated indicators be replaced with official datasets?
            </div>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Yes — the indicator layer is intentionally transparent and
              ingestion-ready, so official sources can replace curated values
              without rewriting the product.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
            <div className="text-sm font-bold text-slate-900">
              Where can I verify endpoints?
            </div>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Open the interactive API docs to inspect countries, investors,
              projects, matching, and news endpoints.
            </p>
            <div className="mt-3">
              <a
                href={apiDocsUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-900 shadow-sm hover:bg-slate-50"
              >
                Open API Docs →
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
