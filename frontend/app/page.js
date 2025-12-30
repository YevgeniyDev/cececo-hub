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
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -left-24 -top-24 h-72 w-72 rounded-full bg-blue-500/10 blur-3xl" />
          <div className="absolute -right-28 top-10 h-80 w-80 rounded-full bg-emerald-500/10 blur-3xl" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(59,130,246,0.10),transparent_40%),radial-gradient(circle_at_85%_25%,rgba(16,185,129,0.10),transparent_45%)]" />
        </div>

        <div className="relative p-7 md:p-10">
          <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-700">
            <span className="inline-block h-2 w-2 rounded-full bg-emerald-500" />
            Clean-energy intelligence for fast decisions
          </div>

          <div className="mt-5 grid gap-10 lg:grid-cols-[1.1fr,0.9fr] lg:items-center">
            <div className="space-y-5">
              <h1 className="text-4xl font-extrabold tracking-tight text-slate-950 md:text-5xl">
                Decide, fund, and launch clean-energy moves faster
              </h1>
              <p className="max-w-2xl text-base leading-7 text-slate-700">
                One workspace for readiness, policy signals, live news, and
                explainable matches across Azerbaijan, Türkiye, Pakistan,
                Kazakhstan, Uzbekistan, and Kyrgyzstan. Go from scan → shortlist
                → validated outreach in minutes.
              </p>
              <div className="flex flex-wrap gap-3">
                <a
                  href="/countries"
                  className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-slate-800"
                >
                  Explore live intelligence →
                </a>
                <a
                  href={apiDocsUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-900 shadow-sm hover:bg-slate-50"
                >
                  View API docs
                </a>
              </div>
              <div className="grid gap-3 sm:grid-cols-3">
                <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                  <div className="text-xs font-semibold text-slate-500">
                    Coverage
                  </div>
                  <div className="mt-1 text-lg font-bold text-slate-900">
                    6 focus countries
                  </div>
                  <div className="text-xs text-slate-600">
                    Policy, market, and ecosystem signals
                  </div>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                  <div className="text-xs font-semibold text-slate-500">
                    Matching
                  </div>
                  <div className="mt-1 text-lg font-bold text-slate-900">
                    Explainable 0–100
                  </div>
                  <div className="text-xs text-slate-600">
                    Country, sector, and stage breakdown
                  </div>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                  <div className="text-xs font-semibold text-slate-500">
                    Freshness
                  </div>
                  <div className="mt-1 text-lg font-bold text-slate-900">
                    Signals refreshed hourly
                  </div>
                  <div className="text-xs text-slate-600">
                    Live news and policy updates
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white/80 p-6 shadow-sm backdrop-blur-sm">
              <div className="text-xs font-extrabold uppercase tracking-wide text-slate-500">
                Product snapshot
              </div>
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl border border-slate-200 bg-white p-4">
                  <div className="text-xs font-extrabold uppercase tracking-wide text-slate-500">
                    Countries
                  </div>
                  <div className="mt-2 text-sm font-semibold text-slate-900">
                    Readiness + policy context
                  </div>
                  <div className="mt-1 text-sm text-slate-600">
                    Compare readiness, policies, funding signals, and updates.
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-4">
                  <div className="text-xs font-extrabold uppercase tracking-wide text-slate-500">
                    Ecosystem
                  </div>
                  <div className="mt-2 text-sm font-semibold text-slate-900">
                    Projects & directory
                  </div>
                  <div className="mt-1 text-sm text-slate-600">
                    Filter projects, startups, investors; add your own
                    instantly.
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-4">
                  <div className="text-xs font-extrabold uppercase tracking-wide text-slate-500">
                    Matching
                  </div>
                  <div className="mt-2 text-sm font-semibold text-slate-900">
                    Explainable scoring
                  </div>
                  <div className="mt-1 text-sm text-slate-600">
                    Country, sector, stage fit with reasons and breakdown.
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-4">
                  <div className="text-xs font-extrabold uppercase tracking-wide text-slate-500">
                    Signals
                  </div>
                  <div className="mt-2 text-sm font-semibold text-slate-900">
                    Live news monitoring
                  </div>
                  <div className="mt-1 text-sm text-slate-600">
                    Searchable, filterable updates from public sources.
                  </div>
                </div>
              </div>
              <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <div className="text-xs font-extrabold uppercase tracking-wide text-slate-500">
                  Trust
                </div>
                <div className="mt-2 text-sm text-slate-700">
                  Structured data layer, explainable models, and stable APIs for
                  ingestion, moderation, and scale.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURE PILLARS */}
      <section className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm md:p-10">
        <div className="flex items-center justify-between gap-4">
          <div>
            <div className="text-xs font-extrabold uppercase tracking-wide text-slate-500">
              Why teams use CECECO Hub
            </div>
            <h2 className="mt-1 text-2xl font-extrabold tracking-tight text-slate-950">
              Clarity, confidence, and speed in one place
            </h2>
          </div>
          <a
            href="/countries"
            className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-slate-800"
          >
            Start with a country →
          </a>
        </div>
        <div className="mt-6 grid gap-4 lg:grid-cols-3">
          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6 shadow-sm">
            <div className="text-xs font-extrabold uppercase tracking-wide text-slate-500">
              Clarity
            </div>
            <div className="mt-2 text-base font-bold text-slate-900">
              One place for context
            </div>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Replace scattered links with structured country briefings,
              comparable signals, and ecosystem views built for decisions.
            </p>
          </div>
          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6 shadow-sm">
            <div className="text-xs font-extrabold uppercase tracking-wide text-slate-500">
              Decision support
            </div>
            <div className="mt-2 text-base font-bold text-slate-900">
              Explainable evaluation
            </div>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Transparent scoring with reasons so teams can trust and validate
              every match before outreach.
            </p>
          </div>
          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6 shadow-sm">
            <div className="text-xs font-extrabold uppercase tracking-wide text-slate-500">
              Speed
            </div>
            <div className="mt-2 text-base font-bold text-slate-900">
              Move faster
            </div>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Monitor policy and market shifts, refresh matches, and act while
              others are still compiling slides.
            </p>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm md:p-10">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="text-xs font-extrabold uppercase tracking-wide text-slate-500">
              How it works
            </div>
            <h2 className="text-2xl font-extrabold tracking-tight text-slate-950">
              From scan to outreach in three steps
            </h2>
            <p className="mt-2 max-w-2xl text-sm text-slate-600">
              Built for quick demos and daily workflows.
            </p>
          </div>
          <a
            href="/countries"
            className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-slate-800"
          >
            Explore countries →
          </a>
        </div>

        <div className="mt-7 grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
            <div className="flex items-center gap-3">
              <div className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-white text-sm font-extrabold text-slate-900 shadow-sm">
                1
              </div>
              <div className="text-sm font-bold text-slate-900">
                Pick a country
              </div>
            </div>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              Scan readiness signals, policies, and live updates in one place.
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
              Filter projects, startups, and investors; add your own records to
              complete the picture.
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
              Open any record to see explainable matches with a score breakdown
              by country, sector, and stage.
            </p>
          </div>
        </div>
      </section>

      {/* WHO IT'S FOR */}
      <section className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm md:p-10">
        <div className="text-xs font-extrabold uppercase tracking-wide text-slate-500">
          Who it’s for
        </div>
        <h2 className="mt-1 text-2xl font-extrabold tracking-tight text-slate-950">
          Built for policy teams, founders, and investors
        </h2>
        <div className="mt-6 grid gap-4 lg:grid-cols-3">
          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6 shadow-sm">
            <div className="text-xs font-extrabold uppercase tracking-wide text-slate-500">
              Policy & public sector
            </div>
            <div className="mt-2 text-base font-bold text-slate-900">
              Evidence-led planning
            </div>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-6 text-slate-600">
              <li>Compare readiness signals across focus countries</li>
              <li>Track policy and market shifts with live updates</li>
              <li>
                Spot gaps and investment priorities with explainable scores
              </li>
            </ul>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6 shadow-sm">
            <div className="text-xs font-extrabold uppercase tracking-wide text-slate-500">
              Startups & builders
            </div>
            <div className="mt-2 text-base font-bold text-slate-900">
              Find aligned capital faster
            </div>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-6 text-slate-600">
              <li>Discover investors by sector, stage, and geography</li>
              <li>Add your startup or project; stay visible in searches</li>
              <li>Use match reasons to tailor outreach</li>
              <li>Validate market entry with country context</li>
            </ul>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6 shadow-sm">
            <div className="text-xs font-extrabold uppercase tracking-wide text-slate-500">
              Investors & partners
            </div>
            <div className="mt-2 text-base font-bold text-slate-900">
              Context-aware pipeline
            </div>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-6 text-slate-600">
              <li>Shortlist projects and startups with filters and scores</li>
              <li>Add your fund or program to attract aligned deals</li>
              <li>Review geo-policy context before outreach</li>
              <li>Use live news as diligence prompts</li>
            </ul>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm md:p-10">
        <div className="text-xs font-extrabold uppercase tracking-wide text-slate-500">
          FAQ
        </div>
        <h2 className="mt-1 text-2xl font-extrabold tracking-tight text-slate-950">
          Answers in one place
        </h2>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
            <div className="text-sm font-bold text-slate-900">
              Where does the news come from?
            </div>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Public sources, including GDELT, are ingested and refreshed with
              search and country filters so you can trace every item.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
            <div className="text-sm font-bold text-slate-900">
              How do matches work?
            </div>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Each match is scored 0–100 with country, sector, and stage fit,
              plus reasons and a breakdown so you can validate quickly.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
            <div className="text-sm font-bold text-slate-900">
              Can I add my own projects or investors?
            </div>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Yes. Use the "+ Add" buttons on Projects, Startups, and Investors.
              Submissions appear instantly and can be updated anytime.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
            <div className="text-sm font-bold text-slate-900">
              Can datasets be upgraded over time?
            </div>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Yes. The data layer is built to ingest official datasets and swap
              curated values without rewriting the product.
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
