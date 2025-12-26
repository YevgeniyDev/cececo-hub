"use client";

import { useState, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import NewsListClient from "./NewsListClient";
import NewsLoading from "./NewsLoading";

const API_BASE = (
  process.env.API_INTERNAL_BASE ||
  process.env.NEXT_PUBLIC_API_BASE ||
  "http://localhost:8000"
).replace(/\/+$/, "");

export default function NewsListWithLoading({ initialNews }) {
  const searchParams = useSearchParams();
  const [news, setNews] = useState(initialNews?.items || initialNews || []);
  const [total, setTotal] = useState(initialNews?.total || 0);
  const [hasMore, setHasMore] = useState(initialNews?.has_more || false);
  const [loading, setLoading] = useState(false);
  const [offset, setOffset] = useState(
    initialNews?.items?.length || initialNews?.length || 0
  );
  const prevParamsRef = useRef("");

  useEffect(() => {
    const currentCountryId = searchParams?.get("country_id") || "";
    const currentQ = searchParams?.get("q") || "";
    const currentParams = `${currentCountryId}|${currentQ}`;

    // Only fetch if params actually changed (skip initial mount)
    if (prevParamsRef.current && prevParamsRef.current !== currentParams) {
      setLoading(true);
      setOffset(0);
      const params = new URLSearchParams();
      if (currentCountryId) params.set("country_id", currentCountryId);
      if (currentQ) params.set("q", currentQ);
      params.set("limit", "20");
      params.set("offset", "0");

      fetch(`${API_BASE}/api/v1/news?${params.toString()}`)
        .then((res) => res.json())
        .then((data) => {
          setNews(data.items || data);
          setTotal(data.total || data.length || 0);
          setHasMore(data.has_more !== undefined ? data.has_more : false);
          setOffset(data.items?.length || data.length || 0);
          setLoading(false);
        })
        .catch((err) => {
          console.error("Failed to fetch news:", err);
          setLoading(false);
        });
    }

    prevParamsRef.current = currentParams;
  }, [searchParams]);

  const loadMore = async () => {
    const currentCountryId = searchParams?.get("country_id") || "";
    const currentQ = searchParams?.get("q") || "";
    const params = new URLSearchParams();
    if (currentCountryId) params.set("country_id", currentCountryId);
    if (currentQ) params.set("q", currentQ);
    params.set("limit", "20");
    params.set("offset", offset.toString());

    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/v1/news?${params.toString()}`);
      const data = await res.json();
      const newItems = data.items || data;
      setNews((prev) => [...prev, ...newItems]);
      setTotal(data.total || total);
      setHasMore(data.has_more !== undefined ? data.has_more : false);
      setOffset((prev) => prev + newItems.length);
    } catch (err) {
      console.error("Failed to load more news:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading && news.length === 0) {
    return <NewsLoading />;
  }

  return (
    <>
      <NewsListClient
        news={news}
        hasMore={hasMore}
        onLoadMore={loadMore}
        loading={loading}
      />
    </>
  );
}
