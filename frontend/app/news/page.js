import NewsFiltersClient from "../components/NewsFiltersClient";
import NewsListWithLoading from "../components/NewsListWithLoading";

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

      <NewsListWithLoading initialNews={news} />
    </div>
  );
}
