"use client";

import { useState } from "react";

export default function TextTrimmer({ text, wordLimit = 30, className = "" }) {
  const words = text.split(" ");
  const isTrimmable = words.length > wordLimit;

  const [expanded, setExpanded] = useState(false);

  const displayedText = expanded
    ? text
    : words.slice(0, wordLimit).join(" ") + (isTrimmable ? "..." : "");

  return (
    <p className={`text-sm text-gray-600 leading-relaxed ${className}`}>
      {displayedText}{" "}
      {isTrimmable && (
        <button
          className="text-black font-medium underline ml-1"
          onClick={() => setExpanded(!expanded)}
        >
          {expanded ? "See Less" : "See More..."}
        </button>
      )}
    </p>
  );
}
