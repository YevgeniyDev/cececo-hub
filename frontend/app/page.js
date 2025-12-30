export default function Home() {
  const apiBase =
    process.env.NEXT_PUBLIC_API_BASE ||
    process.env.API_INTERNAL_BASE ||
    "https://cececo-hub.onrender.com" ||
    "https://cececo-hub.vercel.app";

  const apiDocsUrl = `${String(apiBase).replace(/\/+$/, "")}/docs`;

  const countries = [
    { name: "Türkiye", href: "/countries/TR" },
    { name: "Azerbaijan", href: "/countries/AZ" },
    { name: "Kazakhstan", href: "/countries/KZ" },
    { name: "Uzbekistan", href: "/countries/UZ" },
    { name: "Kyrgyzstan", href: "/countries/KG" },
    { name: "Pakistan", href: "/countries/PK" },
  ];

  const sections = [
    { label: "What you get", href: "#what-you-get" },
    { label: "How it works", href: "#how-it-works" },
    { label: "Matching", href: "#matching" },
    { label: "Trust", href: "#trust" },
  ];

  return (
    <div className="space-y-16">
      {/* HERO */}
      <section className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        {/* background */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -left-28 -top-28 h-80 w-80 rounded-full bg-blue-500/10 blur-3xl" />
          <div className="absolute -right-28 top-10 h-80 w-80 rounded-full bg-emerald-500/10 blur-3xl" />
          <div className="absolute left-1/2 top-1/2 h-[36rem] w-[36rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-slate-900/5 blur-3xl" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_18%,rgba(59,130,246,0.10),transparent_45%),radial-gradient(circle_at_85%_25%,rgba(16,185,129,0.10),transparent_45%)]" />
        </div>

        <div className="relative p-7 md:p-10">
          {/* top line */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-700">
              <span className="inline-block h-2 w-2 rounded-full bg-emerald-500" />
              Clean energy intelligence + explainable matching
            </div>

            {/* light anchor nav (landing only) */}
            <div className="hidden items-center gap-2 md:flex">
              {sections.map((s) => (
                <a
                  key={s.href}
                  href={s.href}
                  className="rounded-full px-3 py-1 text-xs font-semibold text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                >
                  {s.label}
                </a>
              ))}
            </div>
          </div>

          <div className="mt-6 grid gap-10 lg:grid-cols-[1.05fr,0.95fr] lg:items-start">
            {/* left: value prop */}
            <div className="space-y-6">
              <h1 className="text-4xl font-extrabold tracking-tight text-slate-950 md:text-5xl">
                Find real clean-energy opportunities — with policy context and
                investor matching.
              </h1>

              <p className="max-w-2xl text-base leading-7 text-slate-700">
                A single place to explore{" "}
                <span className="font-semibold">countries</span>,{" "}
                <span className="font-semibold">projects & startups</span>,{" "}
                <span className="font-semibold">investors</span>, and{" "}
                <span className="font-semibold">market frameworks</span> across
                emerging markets — built for action, not dashboards.
              </p>

              {/* primary action */}
              <div className="flex flex-wrap items-center gap-3">
                <a
                  href="/countries"
                  className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-slate-800"
                >
                  Explore the Hub →
                </a>

                <a
                  href="#matching"
                  className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-900 shadow-sm hover:bg-slate-50"
                >
                  See a match example
                </a>

                <div className="w-full text-xs text-slate-600">
                  <span className="font-semibold">No sign-up to browse.</span>{" "}
                  Transparent scoring. Sources attached to policy items.
                </div>
              </div>

              {/* country chips */}
              <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <div className="text-xs font-extrabold uppercase tracking-wide text-slate-500">
                      Coverage
                    </div>
                    <div className="mt-1 text-sm font-semibold text-slate-900">
                      Explore by country in one click
                    </div>
                  </div>
                  <a
                    href="/countries"
                    className="text-xs font-semibold text-slate-700 hover:text-slate-950"
                  >
                    View all →
                  </a>
                </div>

                <div className="mt-3 flex flex-wrap gap-2">
                  {countries.map((c) => (
                    <a
                      key={c.name}
                      href={c.href}
                      className="inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-700 hover:bg-white"
                    >
                      {c.name}
                    </a>
                  ))}
                </div>
              </div>

              {/* proof-by-structure */}
              <div className="grid gap-3 sm:grid-cols-3">
                <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                  <div className="text-xs font-semibold text-slate-500">
                    Explainable
                  </div>
                  <div className="mt-1 text-lg font-bold text-slate-900">
                    Score + reasons
                  </div>
                  <div className="text-xs text-slate-600">
                    See why a fit is strong or weak
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                  <div className="text-xs font-semibold text-slate-500">
                    Structured
                  </div>
                  <div className="mt-1 text-lg font-bold text-slate-900">
                    Same schema
                  </div>
                  <div className="text-xs text-slate-600">
                    Projects, startups, investors aligned
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                  <div className="text-xs font-semibold text-slate-500">
                    Sourced
                  </div>
                  <div className="mt-1 text-lg font-bold text-slate-900">
                    Links attached
                  </div>
                  <div className="text-xs text-slate-600">
                    Policies mapped to official references
                  </div>
                </div>
              </div>
            </div>

            {/* right: "product preview" panels */}
            <div className="space-y-4">
              <div className="rounded-3xl border border-slate-200 bg-white/80 p-6 shadow-sm backdrop-blur-sm">
                <div className="flex items-center justify-between gap-3">
                  <div className="text-xs font-extrabold uppercase tracking-wide text-slate-500">
                    Product preview
                  </div>
                  <div className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-3 py-1 text-xs font-semibold text-white">
                    Live
                    <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-400" />
                  </div>
                </div>

                <div className="mt-4 grid gap-3">
                  {/* preview: country card */}
                  <div className="rounded-2xl border border-slate-200 bg-white p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="text-xs font-extrabold uppercase tracking-wide text-slate-500">
                          Country intelligence
                        </div>
                        <div className="mt-1 text-sm font-semibold text-slate-900">
                          Readiness + opportunity notes
                        </div>
                        <div className="mt-1 text-sm text-slate-600">
                          Indicators, key institutions, frameworks, and “what to
                          do now”.
                        </div>
                      </div>
                      <a
                        href="/countries"
                        className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-white"
                      >
                        Open
                      </a>
                    </div>

                    <div className="mt-3 grid gap-2 sm:grid-cols-2">
                      <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                        <div className="text-xs font-semibold text-slate-500">
                          Policy readiness
                        </div>
                        <div className="mt-1 flex items-center gap-2">
                          <div className="h-2 w-full rounded-full bg-slate-200">
                            <div className="h-2 w-[68%] rounded-full bg-emerald-500" />
                          </div>
                          <div className="text-xs font-bold text-slate-900">
                            0.68
                          </div>
                        </div>
                      </div>
                      <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                        <div className="text-xs font-semibold text-slate-500">
                          Investment attractiveness
                        </div>
                        <div className="mt-1 flex items-center gap-2">
                          <div className="h-2 w-full rounded-full bg-slate-200">
                            <div className="h-2 w-[58%] rounded-full bg-blue-500" />
                          </div>
                          <div className="text-xs font-bold text-slate-900">
                            0.58
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* preview: filters */}
                  <div className="rounded-2xl border border-slate-200 bg-white p-4">
                    <div className="text-xs font-extrabold uppercase tracking-wide text-slate-500">
                      Projects & startups
                    </div>
                    <div className="mt-1 text-sm font-semibold text-slate-900">
                      Filterable ecosystem — consistent fields
                    </div>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {[
                        "Solar",
                        "Wind",
                        "Grid",
                        "Efficiency",
                        "Storage",
                        "Mobility",
                      ].map((t) => (
                        <span
                          key={t}
                          className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-700"
                        >
                          {t}
                        </span>
                      ))}
                      {["Pilot", "Seed", "Scaling", "Operational"].map((t) => (
                        <span
                          key={t}
                          className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-700"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                    <div className="mt-3 flex items-center justify-between gap-3">
                      <div className="text-xs text-slate-600">
                        Built for quick shortlists and comparisons.
                      </div>
                      <a
                        href="/projects"
                        className="text-xs font-semibold text-slate-700 hover:text-slate-950"
                      >
                        Browse →
                      </a>
                    </div>
                  </div>

                  {/* preview: policy */}
                  <div className="rounded-2xl border border-slate-200 bg-white p-4">
                    <div className="text-xs font-extrabold uppercase tracking-wide text-slate-500">
                      Policy & frameworks
                    </div>
                    <div className="mt-1 text-sm font-semibold text-slate-900">
                      Investment-relevant signals with sources
                    </div>
                    <div className="mt-3 space-y-2">
                      {[
                        {
                          title: "PPA framework",
                          note: "Why it matters: bankability & risk",
                        },
                        {
                          title: "Auction design",
                          note: "Why it matters: price discovery & pace",
                        },
                        {
                          title: "Grid code updates",
                          note: "Why it matters: interconnection",
                        },
                      ].map((p) => (
                        <div
                          key={p.title}
                          className="flex items-start justify-between gap-3 rounded-xl border border-slate-200 bg-slate-50 p-3"
                        >
                          <div>
                            <div className="text-xs font-semibold text-slate-900">
                              {p.title}
                            </div>
                            <div className="text-xs text-slate-600">
                              {p.note}
                            </div>
                          </div>
                          <div className="rounded-lg border border-slate-200 bg-white px-2 py-1 text-[11px] font-semibold text-slate-700">
                            Source
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* small “cta sidecar” */}
              <div className="rounded-3xl border border-slate-200 bg-slate-900 p-6 text-white shadow-sm">
                <div className="text-sm font-semibold">
                  Ready to build a shortlist?
                </div>
                <div className="mt-1 text-sm text-white/80">
                  Start from countries, then filter the ecosystem, then validate
                  matches.
                </div>
                <div className="mt-4 flex flex-wrap items-center gap-3">
                  <a
                    href="/countries"
                    className="inline-flex items-center justify-center rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-slate-900 hover:bg-white/90"
                  >
                    Explore the Hub →
                  </a>
                  <div className="text-xs text-white/70">
                    No sign-up to browse • Transparent scoring
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* WHAT YOU GET */}
      <section
        id="what-you-get"
        className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm md:p-10"
      >
        <div className="max-w-3xl">
          <div className="text-xs font-extrabold uppercase tracking-wide text-slate-500">
            What you get
          </div>
          <h2 className="mt-1 text-2xl font-extrabold tracking-tight text-slate-950">
            Built around decisions — not raw data volume
          </h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Every page is designed to answer:{" "}
            <span className="font-semibold text-slate-800">
              “What can we do next — and why?”
            </span>
          </p>
        </div>

        <div className="mt-7 grid gap-4 lg:grid-cols-4">
          {[
            {
              title: "Country intelligence",
              desc: "Indicators + opportunity narrative + institutions + “what to watch”.",
              href: "/countries",
              tag: "Compare markets",
            },
            {
              title: "Projects & startups",
              desc: "Consistent fields, strong filtering, and clear stage/sector mapping.",
              href: "/projects",
              tag: "Build pipeline",
            },
            {
              title: "Investor lens",
              desc: "Focus, ticket, stage, and coverage — aligned to matching logic.",
              href: "/investors",
              tag: "Find fit faster",
            },
            {
              title: "Policy & frameworks",
              desc: "Investment-relevant policy signals with sources and “why it matters”.",
              href: "/library",
              tag: "De-risk decisions",
            },
          ].map((f) => (
            <div
              key={f.title}
              className="rounded-3xl border border-slate-200 bg-slate-50 p-6 shadow-sm"
            >
              <div className="inline-flex items-center rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-700">
                {f.tag}
              </div>
              <div className="mt-3 text-base font-bold text-slate-900">
                {f.title}
              </div>
              <p className="mt-2 text-sm leading-6 text-slate-600">{f.desc}</p>
              <div className="mt-4">
                <a
                  href={f.href}
                  className="text-sm font-semibold text-slate-900 hover:text-slate-700"
                >
                  Open →
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section
        id="how-it-works"
        className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm md:p-10"
      >
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="max-w-3xl">
            <div className="text-xs font-extrabold uppercase tracking-wide text-slate-500">
              How it works
            </div>
            <h2 className="mt-1 text-2xl font-extrabold tracking-tight text-slate-950">
              From “interesting market” to actionable shortlist
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              A simple workflow that fits daily diligence, pipeline building,
              and stakeholder updates.
            </p>
          </div>
          <a
            href="/countries"
            className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-slate-800"
          >
            Explore the Hub →
          </a>
        </div>

        <div className="mt-7 grid gap-4 md:grid-cols-3">
          {[
            {
              step: "01",
              title: "Start with a country",
              desc: "See readiness signals, key frameworks, institutions, and what’s moving now.",
            },
            {
              step: "02",
              title: "Filter the ecosystem",
              desc: "Projects and startups are modeled consistently so comparisons stay clean.",
            },
            {
              step: "03",
              title: "Validate matches",
              desc: "Shortlist investors and partners with transparent scoring and reasons.",
            },
          ].map((s) => (
            <div
              key={s.step}
              className="rounded-3xl border border-slate-200 bg-slate-50 p-6 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <div className="text-xs font-extrabold uppercase tracking-wide text-slate-500">
                  Step {s.step}
                </div>
                <div className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-700">
                  Quick
                </div>
              </div>
              <div className="mt-3 text-base font-bold text-slate-900">
                {s.title}
              </div>
              <p className="mt-2 text-sm leading-6 text-slate-600">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* MATCHING (SHOW, DON'T TELL) */}
      <section
        id="matching"
        className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm md:p-10"
      >
        <div className="grid gap-8 lg:grid-cols-[1fr,1fr] lg:items-start">
          <div className="max-w-3xl">
            <div className="text-xs font-extrabold uppercase tracking-wide text-slate-500">
              Matching
            </div>
            <h2 className="mt-1 text-2xl font-extrabold tracking-tight text-slate-950">
              Explainable scoring — not a black box
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Matches are evaluated on clear criteria — so teams can trust what
              they’re seeing and adjust assumptions before outreach.
            </p>

            <div className="mt-6 space-y-3">
              {[
                {
                  title: "Transparent criteria",
                  desc: "Sector, stage, ticket size, geography coverage, and fit logic.",
                },
                {
                  title: "Reasons included",
                  desc: "Every score comes with the “why” — strong fits and weak points.",
                },
                {
                  title: "Strict or flexible country matching",
                  desc: "Compare outcomes when you tighten or relax geographic constraints.",
                },
              ].map((i) => (
                <div
                  key={i.title}
                  className="rounded-2xl border border-slate-200 bg-slate-50 p-5"
                >
                  <div className="text-sm font-bold text-slate-900">
                    {i.title}
                  </div>
                  <div className="mt-1 text-sm text-slate-600">{i.desc}</div>
                </div>
              ))}
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <a
                href="/projects"
                className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-slate-800"
              >
                Find projects →
              </a>
              <a
                href="/investors"
                className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-900 shadow-sm hover:bg-slate-50"
              >
                Browse investors
              </a>
              <div className="w-full text-xs text-slate-600">
                Microcopy: <span className="font-semibold">No sign-up</span> to
                explore lists. Use matches when you’re ready.
              </div>
            </div>
          </div>

          {/* Example match card */}
          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6 shadow-sm">
            <div className="flex items-center justify-between gap-3">
              <div className="text-xs font-extrabold uppercase tracking-wide text-slate-500">
                Example
              </div>
              <div className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-700">
                Match score{" "}
                <span className="font-extrabold text-slate-900">82</span>
              </div>
            </div>

            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl border border-slate-200 bg-white p-4">
                <div className="text-xs font-extrabold uppercase tracking-wide text-slate-500">
                  Investor
                </div>
                <div className="mt-2 text-sm font-semibold text-slate-900">
                  Infrastructure & Transition Fund
                </div>
                <div className="mt-2 text-xs text-slate-600">
                  Focus: Grid / Storage / Efficiency
                </div>
                <div className="text-xs text-slate-600">
                  Stage: Series A–Growth
                </div>
                <div className="text-xs text-slate-600">Ticket: $1–10M</div>
                <div className="mt-2 text-xs text-slate-600">
                  Coverage: Türkiye, Kazakhstan, Uzbekistan
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-4">
                <div className="text-xs font-extrabold uppercase tracking-wide text-slate-500">
                  Project / Startup
                </div>
                <div className="mt-2 text-sm font-semibold text-slate-900">
                  Grid-flex pilot → scaling rollout
                </div>
                <div className="mt-2 text-xs text-slate-600">Sector: Grid</div>
                <div className="text-xs text-slate-600">Stage: Scaling</div>
                <div className="text-xs text-slate-600">Country: Türkiye</div>
                <div className="mt-2 text-xs text-slate-600">
                  Need: partner + capital for rollout
                </div>
              </div>
            </div>

            <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-4">
              <div className="text-xs font-extrabold uppercase tracking-wide text-slate-500">
                Why this scores high
              </div>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-700">
                <li>Sector focus matches (Grid)</li>
                <li>Stage aligns (Scaling)</li>
                <li>Ticket range fits rollout needs</li>
              </ul>
            </div>

            <div className="mt-3 rounded-2xl border border-slate-200 bg-white p-4">
              <div className="text-xs font-extrabold uppercase tracking-wide text-slate-500">
                Potential friction
              </div>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-700">
                <li>Geography strictness affects alternatives</li>
                <li>Policy framework maturity impacts pace</li>
              </ul>
            </div>

            <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
              <div className="text-xs text-slate-600">
                Transparent breakdown in the product — not hidden logic.
              </div>
              <a
                href="/projects"
                className="text-xs font-semibold text-slate-700 hover:text-slate-950"
              >
                Try it with real data →
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* TRUST */}
      <section
        id="trust"
        className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm md:p-10"
      >
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="max-w-3xl">
            <div className="text-xs font-extrabold uppercase tracking-wide text-slate-500">
              Trust
            </div>
            <h2 className="mt-1 text-2xl font-extrabold tracking-tight text-slate-950">
              Built to be verifiable — not persuasive
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Credibility comes from transparency: sourced policy signals,
              consistent schemas, and clear labeling when values are curated or
              imported.
            </p>
          </div>

          <a
            href="/countries"
            className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-slate-800"
          >
            Explore the Hub →
          </a>
        </div>

        <div className="mt-7 grid gap-4 lg:grid-cols-3">
          {[
            {
              title: "Source-linked policy mapping",
              desc: "Policy and framework items can be traced back to official references.",
            },
            {
              title: "Transparent indicators",
              desc: "Indicators are explicit and comparable — no mystery dashboards.",
            },
            {
              title: "Scalable ingestion",
              desc: "Bulk imports and updates keep consistency as the dataset grows.",
            },
          ].map((t) => (
            <div
              key={t.title}
              className="rounded-3xl border border-slate-200 bg-slate-50 p-6 shadow-sm"
            >
              <div className="text-base font-bold text-slate-900">
                {t.title}
              </div>
              <p className="mt-2 text-sm leading-6 text-slate-600">{t.desc}</p>
            </div>
          ))}
        </div>

        {/* subtle technical credibility (NOT a CTA) */}
        <div className="mt-6 rounded-3xl border border-slate-200 bg-white p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <div className="text-xs font-extrabold uppercase tracking-wide text-slate-500">
                For teams integrating data
              </div>
              <div className="mt-1 text-sm text-slate-700">
                API docs available for inspection (countries, projects,
                investors, matching, news).
              </div>
            </div>
            <a
              href={apiDocsUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-900 hover:bg-white"
            >
              Open API docs →
            </a>
          </div>
        </div>
      </section>

      {/* WHO IT'S FOR (FAST, NON-FLUFF) */}
      <section className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm md:p-10">
        <div className="text-xs font-extrabold uppercase tracking-wide text-slate-500">
          Who it’s for
        </div>
        <h2 className="mt-1 text-2xl font-extrabold tracking-tight text-slate-950">
          Investors, builders, policy teams — same truth, different views
        </h2>

        <div className="mt-7 grid gap-4 lg:grid-cols-3">
          {[
            {
              title: "Investors & partners",
              bullets: [
                "Build context-aware pipeline across countries",
                "Use policy signals as diligence prompts",
                "Shortlist with transparent criteria",
              ],
              href: "/investors",
              cta: "Browse investors →",
            },
            {
              title: "Developers & startups",
              bullets: [
                "Find aligned capital faster",
                "Use match reasons to refine positioning",
                "Validate market entry with country context",
              ],
              href: "/projects",
              cta: "Browse projects →",
            },
            {
              title: "Public sector & DFIs",
              bullets: [
                "See market gaps and bottlenecks",
                "Compare readiness signals across countries",
                "Track frameworks that unlock investment",
              ],
              href: "/countries",
              cta: "Explore countries →",
            },
          ].map((a) => (
            <div
              key={a.title}
              className="rounded-3xl border border-slate-200 bg-slate-50 p-6 shadow-sm"
            >
              <div className="text-base font-bold text-slate-900">
                {a.title}
              </div>
              <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-6 text-slate-700">
                {a.bullets.map((b) => (
                  <li key={b}>{b}</li>
                ))}
              </ul>
              <div className="mt-4">
                <a
                  href={a.href}
                  className="text-sm font-semibold text-slate-900 hover:text-slate-700"
                >
                  {a.cta}
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="rounded-3xl border border-slate-200 bg-slate-900 p-8 text-white shadow-sm md:p-10">
        <div className="grid gap-6 lg:grid-cols-[1.2fr,0.8fr] lg:items-center">
          <div>
            <div className="text-xs font-extrabold uppercase tracking-wide text-white/70">
              Start here
            </div>
            <h2 className="mt-2 text-3xl font-extrabold tracking-tight">
              Explore the Hub and build a shortlist in minutes.
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-white/80">
              Browse countries, filter the ecosystem, and validate matches with
              reasons — without guesswork.
            </p>
          </div>
          <div className="rounded-3xl border border-white/15 bg-white/5 p-6">
            <a
              href="/countries"
              className="inline-flex w-full items-center justify-center rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-slate-900 hover:bg-white/90"
            >
              Explore the Hub →
            </a>
            <div className="mt-3 text-center text-xs text-white/70">
              No sign-up to browse • Transparent scoring • Source-linked policy
              items
            </div>

            <div className="mt-5 flex flex-wrap items-center justify-center gap-3 text-xs">
              <a href="/projects" className="text-white/80 hover:text-white">
                Projects
              </a>
              <span className="text-white/30">•</span>
              <a href="/investors" className="text-white/80 hover:text-white">
                Investors
              </a>
              <span className="text-white/30">•</span>
              <a href="/library" className="text-white/80 hover:text-white">
                Policy & Research
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
