export default function Home() {
  const apiBase =
    process.env.NEXT_PUBLIC_API_BASE ||
    process.env.API_INTERNAL_BASE ||
    "https://cececo-hub.onrender.com" ||
    "https://cececo-hub.vercel.app";

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
              Regional clean-energy intelligence
            </span>
            <span className="inline-flex items-center rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-700">
              Policy + market signals
            </span>
            <span className="inline-flex items-center rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-700">
              Projects, startups, investors
            </span>
            <span className="inline-flex items-center rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-700">
              Add your own entries
            </span>
            <span className="inline-flex items-center rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-700">
              Live updates (GDELT)
            </span>
          </div>

          <div className="mt-6 grid gap-8 lg:grid-cols-2 lg:items-center">
            {/* Left */}
            <div>
              <h1 className="text-4xl font-extrabold tracking-tight text-slate-950 md:text-5xl">
                Make clean-energy decisions with speed and confidence
              </h1>

              <p className="mt-4 max-w-xl text-base leading-7 text-slate-700">
                CECECO Hub brings together{" "}
                <span className="font-semibold text-slate-900">
                  country context
                </span>
                ,{" "}
                <span className="font-semibold text-slate-900">
                  ecosystem discovery
                </span>
                , and{" "}
                <span className="font-semibold text-slate-900">
                  explainable matching
                </span>{" "}
                — so policymakers, founders, and investors can move from
                discovery to action faster.
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
            </div>

            {/* Right panel: quick product overview */}
            <div className="rounded-3xl border border-slate-200 bg-white/70 p-5 shadow-sm backdrop-blur-sm">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <div className="text-sm font-extrabold text-slate-900">
                    What you can do in a minute
                  </div>
                  <div className="mt-1 text-sm text-slate-600">
                    Explore → shortlist → validate
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
                    Countries
                  </div>
                  <div className="mt-2 text-sm font-semibold text-slate-900">
                    Readiness + policy context
                  </div>
                  <div className="mt-1 text-sm text-slate-600">
                    Compare signals, frameworks, and updates per country.
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-4">
                  <div className="text-xs font-extrabold uppercase tracking-wide text-slate-500">
                    Directory
                  </div>
                  <div className="mt-2 text-sm font-semibold text-slate-900">
                    Projects & ecosystem
                  </div>
                  <div className="mt-1 text-sm text-slate-600">
                    Filterable lists built for real evaluation workflows. Add
                    your own projects, startups, or investors.
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-4">
                  <div className="text-xs font-extrabold uppercase tracking-wide text-slate-500">
                    Matching
                  </div>
                  <div className="mt-2 text-sm font-semibold text-slate-900">
                    Explainable scoring (0–100)
                  </div>
                  <div className="mt-1 text-sm text-slate-600">
                    Country, sector, stage — with reasons and breakdown.
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-4">
                  <div className="text-xs font-extrabold uppercase tracking-wide text-slate-500">
                    Updates
                  </div>
                  <div className="mt-2 text-sm font-semibold text-slate-900">
                    Live news monitoring
                  </div>
                  <div className="mt-1 text-sm text-slate-600">
                    Search + country filters with click-through sources.
                  </div>
                </div>
              </div>

              <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <div className="text-xs font-extrabold uppercase tracking-wide text-slate-500">
                  Built for trust
                </div>
                <div className="mt-2 text-sm text-slate-700">
                  Structured models, stable APIs, and a data layer designed for
                  ingestion, moderation, and scale.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* VALUE STRIP */}
      <section className="grid gap-4 lg:grid-cols-3">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="text-xs font-extrabold uppercase tracking-wide text-slate-500">
            Clarity
          </div>
          <div className="mt-2 text-base font-bold text-slate-900">
            One place for context
          </div>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Replace fragmented spreadsheets and scattered links with structured,
            comparable country briefings and ecosystem views.
          </p>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="text-xs font-extrabold uppercase tracking-wide text-slate-500">
            Decision support
          </div>
          <div className="mt-2 text-base font-bold text-slate-900">
            Explainable evaluation
          </div>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Matching is transparent — scores are backed by a breakdown so users
            can validate results quickly.
          </p>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="text-xs font-extrabold uppercase tracking-wide text-slate-500">
            Live signals
          </div>
          <div className="mt-2 text-base font-bold text-slate-900">
            Stay current
          </div>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Monitor clean-energy policy and market developments with live news
            updates and country filtering.
          </p>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm md:p-10">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-extrabold tracking-tight text-slate-950">
              A simple flow from discovery to action
            </h2>
            <p className="mt-2 max-w-2xl text-sm text-slate-600">
              Designed for quick demos and real daily use.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <a
              href="/countries"
              className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-slate-800"
            >
              Explore countries →
            </a>
            <a
              href="/projects"
              className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-900 shadow-sm hover:bg-slate-50"
            >
              Projects
            </a>
            <a
              href="/startups"
              className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-900 shadow-sm hover:bg-slate-50"
            >
              Startups
            </a>
            <a
              href="/investors"
              className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-900 shadow-sm hover:bg-slate-50"
            >
              Investors
            </a>
          </div>
        </div>

        <div className="mt-7 grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
            <div className="flex items-center gap-3">
              <div className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-white text-sm font-extrabold text-slate-900 shadow-sm">
                1
              </div>
              <div className="text-sm font-bold text-slate-900">
                Explore country context
              </div>
            </div>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              Review readiness signals, policies, and updates in one place.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
            <div className="flex items-center gap-3">
              <div className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-white text-sm font-extrabold text-slate-900 shadow-sm">
                2
              </div>
              <div className="text-sm font-bold text-slate-900">
                Discover the ecosystem
              </div>
            </div>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              Browse projects, startups, and investors with intuitive filters.
              Use the "+ Add" buttons to contribute your own entries.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
            <div className="flex items-center gap-3">
              <div className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-white text-sm font-extrabold text-slate-900 shadow-sm">
                3
              </div>
              <div className="text-sm font-bold text-slate-900">
                Match and validate
              </div>
            </div>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              Open a project to see top investor matches with a clear score
              breakdown.
            </p>
          </div>
        </div>
      </section>

      {/* WHO IT'S FOR */}
      <section className="grid gap-4 lg:grid-cols-3">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="text-xs font-extrabold uppercase tracking-wide text-slate-500">
            Policy & public sector
          </div>
          <div className="mt-2 text-base font-bold text-slate-900">
            Planning with evidence
          </div>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-6 text-slate-600">
            <li>Compare readiness signals across countries</li>
            <li>Track policy and market updates</li>
            <li>Identify gaps and investment priorities</li>
          </ul>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="text-xs font-extrabold uppercase tracking-wide text-slate-500">
            Startups & builders
          </div>
          <div className="mt-2 text-base font-bold text-slate-900">
            Find aligned capital faster
          </div>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-6 text-slate-600">
            <li>Discover investors by sector, stage, and geography</li>
            <li>Add your startup or project to the directory</li>
            <li>Use match reasons to guide outreach</li>
            <li>Understand country context for market entry</li>
          </ul>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="text-xs font-extrabold uppercase tracking-wide text-slate-500">
            Investors & partners
          </div>
          <div className="mt-2 text-base font-bold text-slate-900">
            Context-aware pipeline
          </div>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-6 text-slate-600">
            <li>Shortlist projects and startups with filters</li>
            <li>Add your fund or investment program to the directory</li>
            <li>Review geo-policy context before outreach</li>
            <li>Use live news as diligence prompts</li>
          </ul>
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
              Where does the news come from?
            </div>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              News links are fetched from public sources via the GDELT API and
              displayed as live updates with search and filtering.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
            <div className="text-sm font-bold text-slate-900">
              How does matching work?
            </div>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Matches are scored 0–100 using country fit, sector alignment, and
              stage fit — each shown with reasons and a breakdown.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
            <div className="text-sm font-bold text-slate-900">
              Can I add my own projects or investors?
            </div>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Yes! Use the "+ Add" buttons on the Projects, Startups, and
              Investors pages to submit new entries. All submissions are
              immediately available in the directory.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
            <div className="text-sm font-bold text-slate-900">
              Can datasets be upgraded over time?
            </div>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Yes. The data layer is designed to ingest official datasets and
              replace curated values without rewriting the product.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
            <div className="text-sm font-bold text-slate-900">
              Where can I inspect the API?
            </div>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Open the interactive API docs to explore endpoints for countries,
              projects, investors, matching, and news.
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
