import PlanetGlobe from "./components/PlanetGlobe";
import { Globe2, Layers, Handshake } from "lucide-react";

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

            {/* RIGHT: interactive planet */}
            <div className="min-w-0 md:pl-6">
              <div className="min-w-0 w-full overflow-hidden rounded-3xl border border-slate-200 bg-white/60 p-3 md:p-4 shadow-sm backdrop-blur">
                <PlanetGlobe accent="#10b981" />
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

        <div className="mt-7 grid gap-4 lg:grid-cols-3">
          {[
            {
              title: "Country intelligence",
              outcome: "Choose which markets to prioritize.",
              bullets: [
                "Policy & incentives",
                "Market + grid signals",
                "Recent news context",
              ],
              cta: "Compare markets →",
              href: "/countries",
              Icon: Globe2,
              featured: true,
            },
            {
              title: "Projects & startups",
              outcome: "Find high-potential opportunities faster.",
              bullets: [
                "Filters that matter",
                "Shortlisted pipeline",
                "Match-ready profiles",
              ],
              cta: "Browse ecosystem →",
              href: "/projects",
              Icon: Layers,
            },
            {
              title: "Investors & partners",
              outcome: "Identify the right funding fit.",
              bullets: [
                "Ticket & stage",
                "Thesis & focus",
                "Coverage alignment",
              ],
              cta: "Find sponsors →",
              href: "/investors",
              Icon: Handshake,
            },
          ].map((f) => (
            <a
              key={f.title}
              href={f.href}
              className={[
                "group block rounded-3xl border p-6 transition",
                "hover:-translate-y-0.5 hover:shadow-md",
                "focus:outline-none focus:ring-2 focus:ring-emerald-500/40",
                f.featured
                  ? "border-emerald-200 bg-gradient-to-br from-emerald-50/60 via-white to-white"
                  : "border-slate-200 bg-slate-50 hover:border-slate-300",
              ].join(" ")}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div
                    className={[
                      "rounded-2xl p-2",
                      f.featured
                        ? "bg-emerald-500/10 text-emerald-700"
                        : "bg-slate-900/5 text-slate-700",
                    ].join(" ")}
                  >
                    <f.Icon className="h-5 w-5" />
                  </div>
                  <div className="text-base font-extrabold text-slate-900">
                    {f.title}
                  </div>
                </div>

                {/* micro label (subtle) */}
                <div className="rounded-full bg-slate-900/5 px-3 py-1 text-xs font-semibold text-slate-600">
                  What it unlocks
                </div>
              </div>

              <div className="mt-3 text-sm font-semibold text-slate-800">
                {f.outcome}
              </div>

              <ul className="mt-3 space-y-1 text-sm text-slate-600">
                {f.bullets.map((b) => (
                  <li key={b} className="flex gap-2">
                    <span className="mt-2 h-1.5 w-1.5 rounded-full bg-emerald-500/70" />
                    <span>{b}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-4 text-sm font-semibold text-emerald-700 group-hover:text-emerald-800">
                {f.cta}
              </div>
            </a>
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
              From signal → decision in three steps
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Designed for daily diligence: quick context, consistent
              evaluation, and clear next actions.
            </p>
          </div>

          <a
            href="/countries"
            className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-50"
          >
            Start with a country →
          </a>
        </div>

        {/* “rail” that connects steps (design intent) */}
        <div className="relative mt-7">
          <div className="pointer-events-none absolute inset-x-2 top-10 hidden h-0.5 bg-slate-200/70 md:block" />

          <div className="grid gap-4 md:grid-cols-3">
            {[
              {
                step: "01",
                title: "Start with a country",
                desc: "See readiness, key policies, institutions, and recent news in one view.",
                outcome: "Outcome: you understand the market context.",
                href: "/countries",
              },
              {
                step: "02",
                title: "Browse the ecosystem",
                desc: "Explore projects and startups with consistent evaluation, not noise.",
                outcome: "Outcome: you identify viable opportunities.",
                href: "/projects",
              },
              {
                step: "03",
                title: "Find sponsors",
                desc: "Discover investors and partners with transparent scoring and reasons.",
                outcome: "Outcome: you know who to contact and why.",
                href: "/investors",
                featured: true,
              },
            ].map((s) => (
              <a
                key={s.step}
                href={s.href}
                className={[
                  "group relative block rounded-3xl border p-6 transition",
                  "hover:-translate-y-0.5 hover:shadow-md",
                  "focus:outline-none focus:ring-2 focus:ring-emerald-500/40",
                  s.featured
                    ? "border-emerald-200 bg-gradient-to-br from-emerald-50/60 via-white to-white"
                    : "border-slate-200 bg-slate-50 hover:border-slate-300",
                ].join(" ")}
              >
                {/* step bubble sitting on the “rail” */}
                <div className="flex items-center justify-between gap-3">
                  <div className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 text-xs font-extrabold uppercase tracking-wide text-slate-600 ring-1 ring-slate-200">
                    Step {s.step}
                  </div>

                  <div className="text-xs font-semibold text-slate-500 group-hover:text-slate-700">
                    Open →
                  </div>
                </div>

                <div className="mt-3 text-base font-extrabold text-slate-900">
                  {s.title}
                </div>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  {s.desc}
                </p>

                <div className="mt-3 rounded-2xl bg-slate-900/5 px-3 py-2 text-xs font-semibold text-slate-700">
                  {s.outcome}
                </div>
              </a>
            ))}
          </div>
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
              Transparent matching you can audit
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Every match is built from explicit criteria — so you can validate
              fit, spot gaps early, and adjust assumptions before outreach.
            </p>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {[
                {
                  title: "Criteria are visible",
                  desc: "Sector, stage, ticket size, geography, and stated thesis.",
                },
                {
                  title: "Explanations are explicit",
                  desc: "Strong fits + weak points, not a black-box score.",
                },
              ].map((i) => (
                <div
                  key={i.title}
                  className="rounded-2xl border border-slate-200 bg-slate-50 p-5"
                >
                  <div className="text-sm font-extrabold text-slate-900">
                    {i.title}
                  </div>
                  <div className="mt-1 text-sm text-slate-600">{i.desc}</div>
                </div>
              ))}
            </div>

            <div className="mt-4 rounded-2xl border border-emerald-200 bg-emerald-50/50 p-5">
              <div className="text-sm font-extrabold text-slate-900">
                Trust signal
              </div>
              <div className="mt-1 text-sm text-slate-700">
                Scores are accompanied by sources (policy items) and reasoning.
                No hidden logic.
              </div>
            </div>
          </div>

          {/* Example match card */}
          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6 shadow-sm">
            <div className="flex items-center justify-between gap-3">
              <div className="text-xs font-extrabold uppercase tracking-wide text-slate-500">
                Example
              </div>

              {/* Make score the anchor */}
              <div className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-700 ring-1 ring-slate-200">
                Match score
                <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-800">
                  82
                </span>
              </div>
            </div>

            {/* INPUTS */}
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl border border-slate-200 bg-white p-4">
                <div className="text-xs font-extrabold uppercase tracking-wide text-slate-500">
                  Investor
                </div>
                <div className="mt-2 text-sm font-extrabold text-slate-900">
                  Infrastructure & Transition Fund
                </div>

                <div className="mt-3 space-y-1 text-xs text-slate-600">
                  <div>
                    <span className="font-semibold text-slate-700">Focus:</span>{" "}
                    Grid / Storage / Efficiency
                  </div>
                  <div>
                    <span className="font-semibold text-slate-700">Stage:</span>{" "}
                    Series A–Growth
                  </div>
                  <div>
                    <span className="font-semibold text-slate-700">
                      Ticket:
                    </span>{" "}
                    $1–10M
                  </div>
                  <div>
                    <span className="font-semibold text-slate-700">
                      Coverage:
                    </span>{" "}
                    Turkey, Kazakhstan, Uzbekistan
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-4">
                <div className="text-xs font-extrabold uppercase tracking-wide text-slate-500">
                  Project / Startup
                </div>
                <div className="mt-2 text-sm font-extrabold text-slate-900">
                  Grid-flex pilot → scaling rollout
                </div>

                <div className="mt-3 space-y-1 text-xs text-slate-600">
                  <div>
                    <span className="font-semibold text-slate-700">
                      Sector:
                    </span>{" "}
                    Grid
                  </div>
                  <div>
                    <span className="font-semibold text-slate-700">Stage:</span>{" "}
                    Scaling
                  </div>
                  <div>
                    <span className="font-semibold text-slate-700">
                      Country:
                    </span>{" "}
                    Turkey
                  </div>
                  <div>
                    <span className="font-semibold text-slate-700">Need:</span>{" "}
                    Partner + capital for rollout
                  </div>
                </div>
              </div>
            </div>

            {/* WHY / FRICTION as two columns on desktop */}
            <div className="mt-4 grid gap-3 md:grid-cols-2">
              <div className="rounded-2xl border border-slate-200 bg-white p-4">
                <div className="text-xs font-extrabold uppercase tracking-wide text-slate-500">
                  Why it scores high
                </div>
                <ul className="mt-2 space-y-2 text-sm text-slate-700">
                  {[
                    ["Sector match", "Grid focus aligns with thesis."],
                    ["Stage fit", "Scaling is within target stage."],
                    ["Ticket fit", "Funding range matches rollout needs."],
                  ].map(([k, v]) => (
                    <li key={k} className="flex gap-2">
                      <span className="mt-2 h-1.5 w-1.5 rounded-full bg-emerald-500/70" />
                      <span>
                        <span className="font-semibold">{k}:</span> {v}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-4">
                <div className="text-xs font-extrabold uppercase tracking-wide text-slate-500">
                  Potential friction
                </div>
                <ul className="mt-2 space-y-2 text-sm text-slate-700">
                  {[
                    [
                      "Policy maturity",
                      "Framework depth may vary by sub-sector.",
                    ],
                  ].map(([k, v]) => (
                    <li key={k} className="flex gap-2">
                      <span className="mt-2 h-1.5 w-1.5 rounded-full bg-slate-400/70" />
                      <span>
                        <span className="font-semibold">{k}:</span> {v}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
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

      {/* WHO IT'S FOR */}
      <section
        id="who-is-it-for"
        className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm md:p-10"
      >
        <div className="max-w-3xl">
          <div className="text-xs font-extrabold uppercase tracking-wide text-slate-500">
            Who is it for?
          </div>
          <h2 className="mt-1 text-2xl font-extrabold tracking-tight text-slate-950">
            Same data. Different decisions.
          </h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Pick your perspective — CECECO shows the same market truth as
            country context, opportunity pipeline, or funding fit.
          </p>
        </div>

        <div className="mt-7 grid gap-4 lg:grid-cols-3">
          {[
            {
              title: "Investors & partners",
              lead: "Screen markets and opportunities faster.",
              bullets: [
                [
                  "Shortlist faster",
                  "Compare markets with decision-ready signals.",
                ],
                [
                  "Reduce outreach waste",
                  "See fit + gaps before you message anyone.",
                ],
                [
                  "De-risk early",
                  "Spot policy/market friction before committing time.",
                ],
              ],
              cta: "Explore countries →",
              href: "/countries",
              featured: true,
            },
            {
              title: "Project & Startup builders",
              lead: "Validate market entry and investor fit.",
              bullets: [
                ["Find aligned capital", "Match by thesis, stage, and ticket."],
                [
                  "Improve positioning",
                  "Use match reasons to refine your narrative.",
                ],
                [
                  "Choose the right markets",
                  "Enter with policy + ecosystem context.",
                ],
              ],
              cta: "Browse projects →",
              href: "/projects",
            },
            {
              title: "Policy makers & analysts",
              lead: "See bottlenecks and investment unlockers.",
              bullets: [
                ["Benchmark", "Compare readiness signals across peers."],
                ["Spot gaps", "Identify missing frameworks and institutions."],
                ["Track progress", "Follow policy items with linked sources."],
              ],
              cta: "See country view →",
              href: "/countries",
            },
          ].map((a) => (
            <a
              key={a.title}
              href={a.href}
              className={[
                "group block rounded-3xl border p-6 transition",
                "hover:-translate-y-0.5 hover:shadow-md",
                "focus:outline-none focus:ring-2 focus:ring-emerald-500/40",
                a.featured
                  ? "border-emerald-200 bg-gradient-to-br from-emerald-50/60 via-white to-white"
                  : "border-slate-200 bg-slate-50 hover:border-slate-300",
              ].join(" ")}
            >
              <div className="text-base font-extrabold text-slate-900">
                {a.title}
              </div>
              <div className="mt-2 text-sm font-semibold text-slate-800">
                {a.lead}
              </div>

              <ul className="mt-4 space-y-2 text-sm text-slate-700">
                {a.bullets.map(([k, v]) => (
                  <li key={k} className="flex gap-2">
                    <span className="mt-2 h-1.5 w-1.5 rounded-full bg-emerald-500/70" />
                    <span>
                      <span className="font-semibold">{k}:</span> {v}
                    </span>
                  </li>
                ))}
              </ul>

              <div className="mt-4 text-sm font-semibold text-emerald-700 group-hover:text-emerald-800">
                {a.cta}
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="relative overflow-hidden rounded-3xl border border-slate-200 bg-slate-950 text-white shadow-sm">
        {/* background glow */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-blue-500/10 blur-3xl" />
          <div className="absolute -right-32 -bottom-32 h-96 w-96 rounded-full bg-emerald-500/10 blur-3xl" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_25%,rgba(59,130,246,0.12),transparent_55%),radial-gradient(circle_at_80%_65%,rgba(16,185,129,0.10),transparent_55%)]" />
        </div>

        <div className="relative p-8 md:p-10">
          <div className="grid gap-8 lg:grid-cols-[1.2fr,0.8fr] lg:items-center">
            {/* left */}
            <div>
              <div className="text-xs font-extrabold uppercase tracking-wide text-white/70">
                Start here
              </div>
              <h2 className="mt-3 text-3xl font-extrabold tracking-tight md:text-4xl">
                Explore the Hub and make changes in minutes.
              </h2>
              <p className="mt-3 max-w-xl text-sm leading-6 text-white/75">
                Decision-ready country context, opportunity pipeline, and
                matching system - without sign-up.
              </p>
            </div>

            {/* right “glass” card */}
            <div className="rounded-3xl border border-white/15 bg-white/5 p-6 backdrop-blur">
              <a
                href="/countries"
                className="inline-flex w-full items-center justify-center rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-slate-900 shadow-sm hover:bg-white/90"
              >
                Explore the Hub →
              </a>

              <div className="mt-3 text-center text-xs text-white/70">
                No sign-up • Transparent scoring • Source-linked policy items
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
