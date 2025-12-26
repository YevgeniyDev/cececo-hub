"use client";

import { useState, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import NewsListClient from "./NewsListClient";
import NewsLoading from "./NewsLoading";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8000";

export default function NewsListWithLoading({ initialNews }) {
  const searchParams = useSearchParams();
  const [news, setNews] = useState(initialNews);
  const [loading, setLoading] = useState(false);
  const prevParamsRef = useRef("");

  useEffect(() => {
    const currentCountryId = searchParams?.get("country_id") || "";
    const currentQ = searchParams?.get("q") || "";
    const currentParams = `${currentCountryId}|${currentQ}`;

    // Only fetch if params actually changed (skip initial mount)
    if (prevParamsRef.current && prevParamsRef.current !== currentParams) {
      setLoading(true);
      const params = new URLSearchParams();
      if (currentCountryId) params.set("country_id", currentCountryId);
      if (currentQ) params.set("q", currentQ);

      fetch(`${API_BASE}/api/v1/news?${params.toString()}`)
        .then((res) => res.json())
        .then((data) => {
          setNews(data);
          setLoading(false);
        })
        .catch((err) => {
          console.error("Failed to fetch news:", err);
          setLoading(false);
        });
    }

    prevParamsRef.current = currentParams;
  }, [searchParams]);

  if (loading) {
    return <NewsLoading />;
  }

  return <NewsListClient news={news} />;
}
