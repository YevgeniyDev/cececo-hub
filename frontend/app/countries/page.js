import Link from "next/link";

const API_BASE =
  process.env.API_INTERNAL_BASE ||
  process.env.NEXT_PUBLIC_API_BASE ||
  "https://cececo-hub.onrender.com"; // keep ONE stable fallback

async function getCountries() {
  const res = await fetch(`${API_BASE}/api/v1/countries`, {
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Failed to fetch countries");
  return res.json();
}

async function getRanking() {
  const res = await fetch(`${API_BASE}/api/v1/countries/ranking`, {
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Failed to fetch ranking");
  return res.json();
}

function meterPct(v01) {
  if (v01 == null) return 0;
  const n = Math.round(v01 * 100);
  return Math.max(0, Math.min(100, n));
}

function shortKey(k) {
  const map = {
    policy_readiness: "Policy",
    investment_attractiveness: "Investment",
    renewable_proxy: "Renewables",
    efficiency_need: "Efficiency",
    grid_proxy: "Grid",
  };
  return map[k] || k;
}

function ScorePill({ score }) {
  const tone =
    score >= 75
      ? "bg-emerald-50 text-emerald-800 border-emerald-200"
      : score >= 55
      ? "bg-amber-50 text-amber-800 border-amber-200"
      : "bg-rose-50 text-rose-800 border-rose-200";

  return (
    <span
      className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-extrabold ${tone}`}
    >
      {score}/100
    </span>
  );
}

function Badge({ children }) {
  return (
    <span className="inline-flex items-center rounded-full border border-slate-200 bg-white/70 px-2.5 py-1 text-xs font-semibold text-slate-700">
      {children}
    </span>
  );
}

function ScoreBar({ score }) {
  const pct = Math.max(0, Math.min(100, Math.round(score || 0)));
  return (
    <div className="h-2 w-28 rounded-full bg-slate-100">
      <div
        className="h-2 rounded-full bg-slate-900"
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}

export default async function CountriesPage() {
  const [countries, ranking] = await Promise.all([
    getCountries(),
    getRanking(),
  ]);
  const top3 = (ranking || []).slice(0, 3);

  return (
    <div className="space-y-8">
      {/* HEADER */}
      <section className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-7 shadow-sm md:p-10">
        {/* background glow (matches landing style) */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -left-24 -top-24 h-72 w-72 rounded-full bg-blue-500/10 blur-3xl" />
          <div className="absolute -right-28 top-10 h-80 w-80 rounded-full bg-emerald-500/10 blur-3xl" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(59,130,246,0.10),transparent_45%),radial-gradient(circle_at_85%_25%,rgba(16,185,129,0.10),transparent_45%)]" />
        </div>

        <div className="relative">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div className="max-w-3xl">
              <div className="flex flex-wrap gap-2">
                <Badge>Knowledge hub</Badge>
                <Badge>Country ranking</Badge>
                <Badge>Explainable indicators</Badge>
              </div>

              <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-950 md:text-4xl">
                Countries dashboard
              </h1>

              <p className="mt-2 text-sm leading-6 text-slate-700">
                MVP ranking is a composite score (0–100) from curated,
                normalized indicators. Each score includes a breakdown so you
                can see <span className="font-semibold">what drives it</span>.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <Link
                href="/news"
                className="inline-flex h-10 items-center justify-center rounded-xl bg-slate-900 px-4 text-sm font-semibold text-white hover:bg-slate-800"
              >
                View news →
              </Link>
              <Link
                href="/projects"
                className="inline-flex h-10 items-center justify-center rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-800 hover:bg-slate-50"
              >
                Browse projects →
              </Link>
            </div>
          </div>

          <div className="mt-4 text-xs text-slate-600">
            Tip: click a country to open briefing, then drill down into
            projects, startups, and updates.
          </div>
        </div>
      </section>

      {/* TOP 3 */}
      {top3.length ? (
        <section className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm md:p-10">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <div className="text-xs font-extrabold uppercase tracking-wide text-slate-500">
                Top ranking
              </div>
              <h2 className="mt-1 text-xl font-extrabold tracking-tight text-slate-950">
                Highest composite scores
              </h2>
              <p className="mt-2 text-sm text-slate-600">
                Quick shortlist for where to start your scan.
              </p>
            </div>
            <div className="text-xs text-slate-500">
              Click to open briefing →
            </div>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {top3.map((c, idx) => (
              <Link
                key={c.country_id}
                href={`/countries/${c.country_id}`}
                className={[
                  "group block rounded-3xl border p-6 transition",
                  "hover:-translate-y-0.5 hover:shadow-md",
                  "focus:outline-none focus:ring-2 focus:ring-emerald-500/40",
                  idx === 0
                    ? "border-emerald-200 bg-gradient-to-br from-emerald-50/60 via-white to-white"
                    : "border-slate-200 bg-slate-50 hover:border-slate-300",
                ].join(" ")}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-xs font-extrabold uppercase tracking-wide text-slate-500">
                      Rank #{idx + 1}
                    </div>
                    <div className="mt-1 text-lg font-extrabold text-slate-900">
                      {c.name}
                    </div>
                    <div className="mt-1 text-xs text-slate-500">
                      <span className="font-mono">{c.iso2}</span>
                      {c.region ? ` • ${c.region}` : ""}
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <ScorePill score={c.score} />
                    <ScoreBar score={c.score} />
                  </div>
                </div>

                <div className="mt-4 space-y-2">
                  {(c.breakdown || []).slice(0, 3).map((b) => (
                    <div key={b.key}>
                      <div className="flex items-center justify-between text-xs text-slate-600">
                        <span className="font-semibold">{shortKey(b.key)}</span>
                        <span className="font-mono">
                          {b.value == null ? "—" : `${meterPct(b.value)}%`}
                        </span>
                      </div>
                      <div className="mt-1 h-2 w-full rounded-full bg-slate-100">
                        <div
                          className="h-2 rounded-full bg-slate-900"
                          style={{ width: `${meterPct(b.value)}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-4 text-sm font-semibold text-slate-900 underline decoration-slate-300 underline-offset-4 group-hover:decoration-slate-400">
                  Open briefing →
                </div>
              </Link>
            ))}
          </div>
        </section>
      ) : null}

      {/* RANKING TABLE */}
      {ranking?.length ? (
        <section className="rounded-3xl border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 p-6">
            <div>
              <div className="text-base font-extrabold text-slate-900">
                Compare countries
              </div>
              <div className="mt-1 text-sm text-slate-600">
                Click a row to open briefing. Use the breakdown to understand
                the score drivers.
              </div>
            </div>

            <Link
              href="/countries"
              className="inline-flex h-10 items-center justify-center rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-800 hover:bg-slate-50"
            >
              Refresh →
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[920px] border-collapse">
              <thead className="sticky top-0 bg-white">
                <tr className="text-left text-xs font-extrabold uppercase tracking-wide text-slate-500">
                  <th className="px-6 py-3">Rank</th>
                  <th className="px-6 py-3">Country</th>
                  <th className="px-6 py-3">Score</th>
                  <th className="px-6 py-3">Policy</th>
                  <th className="px-6 py-3">Investment</th>
                  <th className="px-6 py-3">Renewables</th>
                  <th className="px-6 py-3">Efficiency</th>
                  <th className="px-6 py-3">Grid</th>
                </tr>
              </thead>

              <tbody>
                {ranking.map((c, i) => {
                  const m = {};
                  for (const b of c.breakdown || []) m[b.key] = b.value;

                  return (
                    <tr
                      key={c.country_id}
                      className="border-t border-slate-100 text-sm hover:bg-slate-50"
                    >
                      <td className="px-6 py-4 font-mono text-slate-600">
                        {i + 1}
                      </td>

                      <td className="px-6 py-4">
                        <Link
                          href={`/countries/${c.country_id}`}
                          className="font-extrabold text-slate-900 underline decoration-slate-200 underline-offset-4 hover:decoration-slate-400"
                        >
                          {c.name}
                        </Link>
                        <div className="mt-1 text-xs text-slate-500">
                          <span className="font-mono">{c.iso2}</span>
                          {c.region ? ` • ${c.region}` : ""}
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <ScorePill score={c.score} />
                          <ScoreBar score={c.score} />
                        </div>
                      </td>

                      <td className="px-6 py-4 font-mono text-slate-700">
                        {m.policy_readiness == null
                          ? "—"
                          : `${meterPct(m.policy_readiness)}%`}
                      </td>
                      <td className="px-6 py-4 font-mono text-slate-700">
                        {m.investment_attractiveness == null
                          ? "—"
                          : `${meterPct(m.investment_attractiveness)}%`}
                      </td>
                      <td className="px-6 py-4 font-mono text-slate-700">
                        {m.renewable_proxy == null
                          ? "—"
                          : `${meterPct(m.renewable_proxy)}%`}
                      </td>
                      <td className="px-6 py-4 font-mono text-slate-700">
                        {m.efficiency_need == null
                          ? "—"
                          : `${meterPct(m.efficiency_need)}%`}
                      </td>
                      <td className="px-6 py-4 font-mono text-slate-700">
                        {m.grid_proxy == null
                          ? "—"
                          : `${meterPct(m.grid_proxy)}%`}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="border-t border-slate-200 p-6 text-xs text-slate-500">
            MVP note: indicators are curated placeholders. Production connects
            to official sources/datasets and tracked policy updates.
          </div>
        </section>
      ) : null}

      {/* COUNTRY DIRECTORY (replaces redundant heavy cards) */}
      {countries?.length ? (
        <section className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm md:p-10">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <div className="text-xs font-extrabold uppercase tracking-wide text-slate-500">
                Directory
              </div>
              <h2 className="mt-1 text-xl font-extrabold tracking-tight text-slate-950">
                Browse all countries
              </h2>
              <p className="mt-2 text-sm text-slate-600">
                Open a briefing to see the narrative, latest updates, and
                drill-down links.
              </p>
            </div>
          </div>

          <div className="mt-6 grid gap-3 md:grid-cols-2">
            {countries.map((c) => (
              <div
                key={c.id}
                className="group rounded-2xl border border-slate-200 bg-slate-50 p-5 transition hover:bg-white hover:shadow-sm"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-base font-extrabold text-slate-900">
                      {c.name}
                    </div>
                    <div className="mt-1 text-xs text-slate-600">
                      <span className="font-mono">{c.iso2}</span>
                      {c.region ? ` • ${c.region}` : ""}
                    </div>
                  </div>

                  <span className="rounded-full border border-slate-200 bg-white px-2.5 py-1 text-[11px] font-semibold text-slate-600">
                    Country
                  </span>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  <Link
                    className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-3 py-2 text-sm font-semibold text-white hover:bg-slate-800"
                    href={`/countries/${c.id}`}
                  >
                    Briefing →
                  </Link>

                  <Link
                    className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-50"
                    href={`/projects?country_id=${c.id}`}
                  >
                    Projects →
                  </Link>

                  <Link
                    className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-50"
                    href={`/startups?country_id=${c.id}`}
                  >
                    Startups →
                  </Link>

                  <Link
                    className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-50"
                    href={`/news?country_id=${c.id}`}
                  >
                    Updates →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}
