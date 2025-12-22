import Link from "next/link";

const API_BASE =
  process.env.API_INTERNAL_BASE ||
  process.env.NEXT_PUBLIC_API_BASE ||
  "http://localhost:8000";

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
    <span className="inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-semibold text-slate-700">
      {children}
    </span>
  );
}

export default async function CountriesPage() {
  const [countries, ranking] = await Promise.all([
    getCountries(),
    getRanking(),
  ]);
  const top3 = (ranking || []).slice(0, 3);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="flex flex-wrap gap-2">
            <Badge>Knowledge hub</Badge>
            <Badge>Country ranking</Badge>
            <Badge>Explainable indicators</Badge>
          </div>

          <h1 className="mt-3 text-3xl font-extrabold tracking-tight">
            Countries
          </h1>

          <p className="mt-2 max-w-3xl text-sm text-slate-600">
            Ranking is an MVP composite score (0–100) from curated, normalized
            indicators. Each score includes a breakdown for transparency.
          </p>
        </div>

        <div className="text-sm text-slate-500">
          Tip: open a country to see briefing + updates
        </div>
      </div>

      {/* Podium */}
      {top3.length ? (
        <div className="grid gap-4 md:grid-cols-3">
          {top3.map((c, idx) => (
            <Link
              key={c.country_id}
              href={`/countries/${c.country_id}`}
              className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md"
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
                <ScorePill score={c.score} />
              </div>

              <div className="mt-4 space-y-2">
                {(c.breakdown || []).map((b) => (
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

              <div className="mt-4 text-sm font-semibold text-slate-900 underline decoration-slate-300 underline-offset-4">
                Open briefing →
              </div>
            </Link>
          ))}
        </div>
      ) : null}

      {/* Full ranking table */}
      {ranking?.length ? (
        <div className="rounded-3xl border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 p-5">
            <div>
              <div className="text-base font-extrabold text-slate-900">
                Regional ranking dashboard
              </div>
              <div className="mt-1 text-sm text-slate-600">
                Compare countries quickly. Click a country to open its briefing.
              </div>
            </div>

            <Link
              href="/news"
              className="inline-flex h-10 items-center justify-center rounded-xl bg-slate-900 px-4 text-sm font-semibold text-white hover:bg-slate-800"
            >
              View news →
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[820px] border-collapse">
              <thead>
                <tr className="text-left text-xs font-extrabold uppercase tracking-wide text-slate-500">
                  <th className="px-5 py-3">Rank</th>
                  <th className="px-5 py-3">Country</th>
                  <th className="px-5 py-3">Score</th>
                  <th className="px-5 py-3">Policy</th>
                  <th className="px-5 py-3">Investment</th>
                  <th className="px-5 py-3">Renewables</th>
                  <th className="px-5 py-3">Efficiency</th>
                  <th className="px-5 py-3">Grid</th>
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
                      <td className="px-5 py-4 font-mono text-slate-600">
                        {i + 1}
                      </td>
                      <td className="px-5 py-4">
                        <Link
                          href={`/countries/${c.country_id}`}
                          className="font-bold text-slate-900 underline decoration-slate-200 underline-offset-4 hover:decoration-slate-400"
                        >
                          {c.name}
                        </Link>
                        <div className="mt-1 text-xs text-slate-500">
                          <span className="font-mono">{c.iso2}</span>
                          {c.region ? ` • ${c.region}` : ""}
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <ScorePill score={c.score} />
                      </td>

                      <td className="px-5 py-4 font-mono text-slate-700">
                        {m.policy_readiness == null
                          ? "—"
                          : `${meterPct(m.policy_readiness)}%`}
                      </td>
                      <td className="px-5 py-4 font-mono text-slate-700">
                        {m.investment_attractiveness == null
                          ? "—"
                          : `${meterPct(m.investment_attractiveness)}%`}
                      </td>
                      <td className="px-5 py-4 font-mono text-slate-700">
                        {m.renewable_proxy == null
                          ? "—"
                          : `${meterPct(m.renewable_proxy)}%`}
                      </td>
                      <td className="px-5 py-4 font-mono text-slate-700">
                        {m.efficiency_need == null
                          ? "—"
                          : `${meterPct(m.efficiency_need)}%`}
                      </td>
                      <td className="px-5 py-4 font-mono text-slate-700">
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

          <div className="border-t border-slate-200 p-5 text-xs text-slate-500">
            MVP note: indicators are curated placeholders. Production connects
            to official sources/datasets and tracked policy updates.
          </div>
        </div>
      ) : null}

      {/* Your existing country cards */}
      <div className="grid gap-4 md:grid-cols-2">
        {countries.map((c) => (
          <div
            key={c.id}
            className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="text-lg font-bold leading-tight">{c.name}</div>
                <div className="mt-1 text-sm text-slate-600">
                  <span className="font-semibold text-slate-800">ISO2:</span>{" "}
                  <span className="font-mono">{c.iso2}</span>
                  {c.region ? (
                    <>
                      {" "}
                      <span className="text-slate-300">•</span>{" "}
                      <span className="font-semibold text-slate-800">
                        Region:
                      </span>{" "}
                      {c.region}
                    </>
                  ) : null}
                </div>
              </div>

              <span className="rounded-full border border-slate-200 bg-slate-50 px-2 py-1 text-[11px] font-semibold text-slate-600">
                Country
              </span>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              <Link
                className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-slate-800"
                href={`/countries/${c.id}`}
              >
                Briefing →
              </Link>

              <Link
                className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-800 shadow-sm hover:bg-slate-50"
                href={`/projects?country_id=${c.id}`}
              >
                Projects →
              </Link>

              <Link
                className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-800 shadow-sm hover:bg-slate-50"
                href={`/startups?country_id=${c.id}`}
              >
                Startups →
              </Link>

              <Link
                className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-800 shadow-sm hover:bg-slate-50"
                href={`/news?country_id=${c.id}`}
              >
                Updates →
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
