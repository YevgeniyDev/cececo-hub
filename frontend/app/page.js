export default function Home() {
  const apiBase =
    process.env.NEXT_PUBLIC_API_BASE ||
    process.env.API_INTERNAL_BASE ||
    "https://cececo-hub.onrender.com" ||
    "https://cececo-hub.vercel.app";

  const sections = [
    { label: "What you get", href: "#what-you-get" },
    { label: "How it works", href: "#how-it-works" },
    { label: "Matching", href: "#matching" },
    { label: "Who is it for?", href: "#who-is-it-for" },
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
              Clean energy knowledge hub
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
                Investor? Policy maker? Entrepreneur? Or just interested in
                clean energy?
              </h1>

              <p className="max-w-2xl text-base leading-7 text-slate-700">
                Explore a single place to find{" "}
                <span className="font-semibold">most recent news</span>,{" "}
                <span className="font-semibold">
                  market state across countries
                </span>
                ,{" "}
                <span className="font-semibold">
                  high-potential projects & startups
                </span>
                , and{" "}
                <span className="font-semibold">ready-to-invest sponsors</span>.
              </p>

              {/* primary action */}
              <div className="flex flex-wrap items-center gap-3">
                <a
                  href="/countries"
                  className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-slate-800"
                >
                  Explore the Hub →
                </a>
                <div className="w-full text-xs text-slate-600">
                  <span className="font-semibold">No sign-up to browse.</span>{" "}
                  Transparent scoring. Sources attached to policy items.
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
            Built around decisions, not raw data volume
          </h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Every page is designed to answer:{" "}
            <span className="font-semibold text-slate-800">
              “What can we do next, and why?”
            </span>
          </p>
        </div>

        <div className="mt-7 grid gap-4 lg:grid-cols-4">
          {[
            {
              title: "Country intelligence",
              desc: "Indicators + opportunities + institutions + recent news.",
              tag: "Compare markets",
            },
            {
              title: "Projects & startups",
              desc: "Relevant information, strong filtering, and evaluated matching with investors.",
              tag: "Browse ecosystem",
            },
            {
              title: "Investors & partners",
              desc: "Focus, ticket, stage, and coverage aligned to matching logic.",
              tag: "Find sponsors",
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
              From “interesting market” to actionable insights
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              A simple workflow that fits daily diligence, market research, and
              stakeholder updates.
            </p>
          </div>
        </div>

        <div className="mt-7 grid gap-4 md:grid-cols-3">
          {[
            {
              step: "01",
              title: "Start with a country",
              desc: "See readiness news, key policies, institutions, and what projects/startups/investors are working there.",
            },
            {
              step: "02",
              title: "Browse the ecosystem",
              desc: "Projects and startups are evaluated consistently to find the best matches with investors.",
            },
            {
              step: "03",
              title: "Find sponsors",
              desc: "Find investors and partners with transparent scoring and reasons.",
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
              Find the best fit for you as an investor, entrepreneur, or policy
              maker.
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Matches are evaluated on clear criteria - so you can trust what
              you're seeing and adjust assumptions before outreach.
            </p>

            <div className="mt-6 space-y-3">
              {[
                {
                  title: "Transparent criteria",
                  desc: "Sector, stage, ticket size, and geography coverage.",
                },
                {
                  title: "Clear explanations",
                  desc: "Every score comes with the “why” - strong fits and weak points.",
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
                <li>Policy framework maturity may not be perfect</li>
              </ul>
            </div>

            <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
              <div className="text-xs text-slate-600">
                Transparent breakdown in the product - not hidden logic.
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

      {/* WHO IT'S FOR */}
      <section
        id="#who-is-it-for"
        className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm md:p-10"
      >
        <div className="text-xs font-extrabold uppercase tracking-wide text-slate-500">
          Who is it for?
        </div>
        <h2 className="mt-1 text-2xl font-extrabold tracking-tight text-slate-950">
          Investors, entrepreneurs, policy makers or just interested in clean
          energy - same truth, different views
        </h2>

        <div className="mt-7 grid gap-4 lg:grid-cols-3">
          {[
            {
              title: "Investors & partners",
              bullets: [
                "Find the best projects and startups to invest in",
                "Browse the market state and build your strategy with most recent factors",
              ],
            },
            {
              title: "Project & Startup builders",
              bullets: [
                "Find aligned investors and partners faster",
                "Use match reasons to refine your strategy",
                "Validate market entry with country context",
              ],
            },
            {
              title: "Policy makers & people interested in clean energy",
              bullets: [
                "See market gaps and bottlenecks in your country",
                "Compare readiness signals in your country with other countries",
                "Track frameworks that unlock investment in your country",
              ],
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
              Explore the Hub and make changes in minutes.
            </h2>
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
          </div>
        </div>
      </section>
    </div>
  );
}
