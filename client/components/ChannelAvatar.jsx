"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

const BG_COLORS = [
  "#dc2626",
  "#ea580c",
  "#d97706",
  "#059669",
  "#0891b2",
  "#2563eb", 
  "#4f46e5", 
  "#7c3aed", 
  "#c026d3",
  "#db2777", 
];

function getBgColor(str = "") {
  if (!str) return BG_COLORS[0];
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return BG_COLORS[Math.abs(hash) % BG_COLORS.length];
}

export default function ChannelAvatar({ url, name = "", size = "md", className = "" }) {
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setHasError(false);
  }, [url]);

  const sizeClasses = {
    xs: "w-5 h-5",
    sm: "w-6 h-6",
    md: "w-9 h-9",
    lg: "w-12 h-12",
    xl: "w-16 h-16",
    "2xl": "w-24 h-24",
  };

  const textSizes = {
    xs: "text-[10px]",
    sm: "text-xs",
    md: "text-sm",
    lg: "text-base",
    xl: "text-2xl",
    "2xl": "text-4xl",
  };

  const validUrl = typeof url === "string" && url.trim().length > 0 ? url.trim() : null;
  const initial = (typeof name === "string" && name.trim().length > 0 ? name.trim().charAt(0) : "C").toUpperCase();
  const currentSizeClass = sizeClasses[size] || sizeClasses.md;
  const currentTextSize = textSizes[size] || textSizes.md;

  return (
    <div
      className={`relative rounded-full overflow-hidden flex-shrink-0 select-none ${currentSizeClass} ${className}`}
    >
      {validUrl && !hasError ? (
        <Image
          src={validUrl}
          alt={name || "Channel Avatar"}
          fill
          className="object-cover"
          sizes="(max-width: 48px) 100vw"
          onError={() => setHasError(true)}
        />
      ) : (
        <div
          className={`w-full h-full flex items-center justify-center font-medium text-white ${currentTextSize}`}
          style={{ backgroundColor: getBgColor(name) }}
        >
          {initial}
        </div>
      )}
    </div>
  );
}

