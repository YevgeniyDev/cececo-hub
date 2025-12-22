import NewsFiltersClient from "../components/NewsFiltersClient";

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

async function getNews({ countryId, q }) {
  const params = new URLSearchParams();
  if (countryId) params.set("country_id", countryId);
  if (q) params.set("q", q);

  const res = await fetch(`${API_BASE}/api/v1/news?${params.toString()}`, {
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Failed to fetch news");
  return res.json();
}

export default async function NewsPage({ searchParams }) {
  const countryId = searchParams?.country_id || "";
  const q = searchParams?.q || "";

  const [countries, news] = await Promise.all([
    getCountries(),
    getNews({ countryId, q }),
  ]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">News</h1>
          <p className="mt-2 max-w-2xl text-sm text-slate-600">
            Latest curated updates on policies, regulations, projects, and
            achievements.
          </p>
        </div>

        <NewsFiltersClient countries={countries} />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {news.map((n) => (
          <article
            key={n.id}
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="text-base font-bold leading-snug">{n.title}</h3>
                <div className="mt-1 text-xs text-slate-500">
                  <span className="font-semibold text-slate-700">
                    {n.impact_type}
                  </span>{" "}
                  • Score <span className="font-mono">{n.impact_score}</span>
                </div>
              </div>

              <span className="rounded-full border border-slate-200 bg-slate-50 px-2 py-1 text-[11px] font-semibold text-slate-600">
                approved
              </span>
            </div>

            <p className="mt-3 text-sm leading-6 text-slate-700">{n.summary}</p>

            <div className="mt-4 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500">
              <div>
                Published: {new Date(n.published_at).toLocaleDateString()}
              </div>

              {n.source_url ? (
                <a
                  className="font-semibold text-slate-800 underline decoration-slate-300 underline-offset-4 hover:decoration-slate-500"
                  href={n.source_url}
                  target="_blank"
                  rel="noreferrer"
                >
                  Source →
                </a>
              ) : null}
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
