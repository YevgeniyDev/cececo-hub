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
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {displayedNews.map((n) => (
          <article
            key={n.id}
            className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all hover:shadow-lg hover:border-slate-300 cursor-pointer"
            onClick={() =>
              n.source_url &&
              window.open(n.source_url, "_blank", "noopener,noreferrer")
            }
          >
            {/* Image Section */}
            <div className="relative h-48 w-full overflow-hidden bg-gradient-to-br from-slate-100 to-slate-200">
              {n.image_url ? (
                <img
                  src={n.image_url}
                  alt={n.title}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  onError={(e) => {
                    // Show placeholder on error
                    e.target.style.display = "none";
                    const placeholder = e.target.nextElementSibling;
                    if (placeholder) placeholder.style.display = "flex";
                  }}
                />
              ) : null}
              {/* Placeholder (shown when no image or image fails) */}
              <div
                className={`absolute inset-0 flex items-center justify-center ${
                  n.image_url ? "hidden" : ""
                }`}
              >
                <div className="text-center">
                  <svg
                    className="mx-auto mb-2 h-12 w-12 text-slate-300"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
                    />
                  </svg>
                </div>
              </div>
              {/* Country badge overlay */}
              <div className="absolute top-3 right-3">
                <span
                  className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[10px] font-semibold backdrop-blur-sm ${
                    n.country_name === "Global" || !n.country_name
                      ? "border-slate-300/80 bg-slate-100/90 text-slate-700"
                      : "border-blue-200/80 bg-blue-50/90 text-blue-700"
                  }`}
                >
                  {n.country_name || "Global"}
                  {n.country_iso2 && n.country_name !== "Global" && (
                    <span className="ml-1 text-blue-600">
                      ({n.country_iso2})
                    </span>
                  )}
                </span>
              </div>
            </div>

            {/* Content Section */}
            <div className="flex flex-1 flex-col p-5">
              {/* Type badge */}
              <div className="mb-2">
                <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-slate-600">
                  {n.impact_type}
                </span>
              </div>

              {/* Title */}
              <h3 className="mb-2 line-clamp-2 text-lg font-bold leading-tight text-slate-900 group-hover:text-blue-600 transition-colors">
                {n.title}
              </h3>

              {/* Summary */}
              <p className="mb-4 line-clamp-3 flex-1 text-sm leading-relaxed text-slate-600">
                {n.summary}
              </p>

              {/* Footer */}
              <div className="mt-auto flex items-center justify-between border-t border-slate-100 pt-3 text-xs text-slate-500">
                <div className="flex items-center gap-2">
                  <DateDisplay dateString={n.published_at} />
                  {n.source_name && (
                    <>
                      <span className="text-slate-300">•</span>
                      <span className="truncate max-w-[120px]">
                        {n.source_name}
                      </span>
                    </>
                  )}
                </div>

                {n.source_url && (
                  <a
                    className="font-semibold text-slate-700 underline decoration-slate-300 underline-offset-4 hover:text-blue-600 hover:decoration-blue-400 transition-colors"
                    href={n.source_url}
                    target="_blank"
                    rel="noreferrer"
                    onClick={(e) => e.stopPropagation()}
                  >
                    Read →
                  </a>
                )}
              </div>
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
