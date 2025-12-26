"use client";

import { useState } from "react";
import DateDisplay from "./DateDisplay";

const INITIAL_LIMIT = 10;
const LOAD_MORE_INCREMENT = 10;

export default function NewsListClient({ news }) {
  const [displayLimit, setDisplayLimit] = useState(INITIAL_LIMIT);

  const displayedNews = news.slice(0, displayLimit);
  const hasMore = displayLimit < news.length;

  const handleLoadMore = () => {
    setDisplayLimit((prev) => prev + LOAD_MORE_INCREMENT);
  };

  if (!news || news.length === 0) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center">
        <p className="text-lg font-semibold text-slate-700">
          No news articles found
        </p>
        <p className="mt-2 text-sm text-slate-500">
          Try adjusting your filters or check back later for updates.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="grid gap-4 md:grid-cols-2">
        {displayedNews.map((n) => (
          <article
            key={n.id}
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1">
                <h3 className="text-base font-bold leading-snug">{n.title}</h3>
                <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-slate-500">
                  <span className="font-semibold text-slate-700">
                    {n.impact_type}
                  </span>
                  <span className="text-slate-300">•</span>
                  <span
                    className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-semibold ${
                      n.country_name === "Global" || !n.country_name
                        ? "border-slate-300 bg-slate-100 text-slate-700"
                        : "border-blue-200 bg-blue-50 text-blue-700"
                    }`}
                  >
                    {n.country_name || "Global"}
                    {n.country_iso2 && n.country_name !== "Global" && (
                      <span className="ml-1 text-blue-500">
                        ({n.country_iso2})
                      </span>
                    )}
                  </span>
                </div>
              </div>

              <span className="rounded-full border border-slate-200 bg-slate-50 px-2 py-1 text-[11px] font-semibold text-slate-600">
                approved
              </span>
            </div>

            <p className="mt-3 text-sm leading-6 text-slate-700">{n.summary}</p>

            <div className="mt-4 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500">
              <div>
                Published: <DateDisplay dateString={n.published_at} />
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

      {hasMore && (
        <div className="flex justify-center pt-4">
          <button
            onClick={handleLoadMore}
            className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-6 py-2.5 text-sm font-semibold text-slate-800 shadow-sm hover:bg-slate-50 transition-colors"
          >
            Load More ({news.length - displayLimit} remaining)
          </button>
        </div>
      )}

      {!hasMore && news.length > INITIAL_LIMIT && (
        <div className="flex justify-center pt-2">
          <p className="text-sm text-slate-500">
            Showing all {news.length} articles
          </p>
        </div>
      )}
    </>
  );
}
