"use client";

import { useState, useEffect } from "react";

export default function DateDisplay({ dateString }) {
  const [formattedDate, setFormattedDate] = useState("");

  useEffect(() => {
    // Format date only on client side to avoid hydration mismatches
    const date = new Date(dateString);
    const year = date.getUTCFullYear();
    const month = String(date.getUTCMonth() + 1).padStart(2, "0");
    const day = String(date.getUTCDate()).padStart(2, "0");
    setFormattedDate(`${month}/${day}/${year}`);
  }, [dateString]);

  // Show placeholder during SSR to avoid hydration mismatch
  if (!formattedDate) {
    return <span>—</span>;
  }

  return <span>{formattedDate}</span>;
}

