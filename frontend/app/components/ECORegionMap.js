"use client";

import { useState } from "react";

export default function ECORegionMap() {
  const [hoveredCountry, setHoveredCountry] = useState(null);

  const countries = [
    {
      id: "turkiye",
      name: "Türkiye",
      path: "M180,240 L240,235 L265,245 L270,265 L250,275 L220,278 L190,268 L175,250 Z",
      center: { x: 220, y: 256 },
    },
    {
      id: "azerbaijan",
      name: "Azerbaijan",
      path: "M290,250 L310,245 L325,255 L320,268 L305,270 L290,260 Z",
      center: { x: 308, y: 258 },
    },
    {
      id: "kazakhstan",
      name: "Kazakhstan",
      path: "M320,180 L450,170 L480,185 L495,210 L485,235 L450,245 L380,240 L340,225 L315,200 Z",
      center: { x: 400, y: 210 },
    },
    {
      id: "uzbekistan",
      name: "Uzbekistan",
      path: "M350,240 L395,235 L410,245 L408,265 L390,275 L365,273 L350,258 Z",
      center: { x: 380, y: 255 },
    },
    {
      id: "kyrgyzstan",
      name: "Kyrgyzstan",
      path: "M415,240 L445,235 L460,245 L455,260 L435,265 L418,255 Z",
      center: { x: 438, y: 250 },
    },
    {
      id: "pakistan",
      name: "Pakistan",
      path: "M380,280 L410,275 L425,285 L435,305 L430,330 L415,345 L395,348 L380,335 L375,310 Z",
      center: { x: 407, y: 312 },
    },
  ];

  return (
    <div className="relative w-full space-y-3">
      {/* Title */}
      <div className="flex items-center justify-between">
        <div>
          <div className="text-xs font-extrabold uppercase tracking-wide text-slate-500">
            Coverage
          </div>
          <div className="mt-0.5 text-sm font-semibold text-slate-900">
            ECO Region Focus
          </div>
        </div>
        <div className="rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-900">
          6 countries
        </div>
      </div>

      {/* Map container */}
      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl border border-slate-200 bg-gradient-to-br from-slate-50 to-white shadow-sm">
        <svg
          viewBox="140 140 400 240"
          className="h-full w-full"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Background grid (subtle) */}
          <defs>
            <pattern
              id="grid"
              width="40"
              height="40"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 40 0 L 0 0 0 40"
                fill="none"
                stroke="rgb(148 163 184 / 0.1)"
                strokeWidth="0.5"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />

          {/* Country shapes */}
          {countries.map((country) => (
            <g key={country.id}>
              {/* Country path */}
              <path
                d={country.path}
                fill={
                  hoveredCountry === country.id
                    ? "rgb(16 185 129 / 0.4)"
                    : "rgb(16 185 129 / 0.25)"
                }
                stroke="rgb(16 185 129)"
                strokeWidth="2"
                className="cursor-pointer transition-all duration-300"
                onMouseEnter={() => setHoveredCountry(country.id)}
                onMouseLeave={() => setHoveredCountry(null)}
              />

              {/* Country dot marker */}
              <circle
                cx={country.center.x}
                cy={country.center.y}
                r={hoveredCountry === country.id ? "5" : "3.5"}
                fill="white"
                stroke="rgb(16 185 129)"
                strokeWidth="2"
                className="pointer-events-none transition-all duration-300"
              />
              <circle
                cx={country.center.x}
                cy={country.center.y}
                r={hoveredCountry === country.id ? "2" : "1.5"}
                fill="rgb(16 185 129)"
                className="pointer-events-none transition-all duration-300"
              />

              {/* Country label (visible on hover) */}
              {hoveredCountry === country.id && (
                <>
                  {/* Label background */}
                  <rect
                    x={country.center.x - country.name.length * 3}
                    y={country.center.y - 24}
                    width={country.name.length * 6}
                    height="16"
                    rx="4"
                    fill="white"
                    stroke="rgb(226 232 240)"
                    strokeWidth="1"
                    className="pointer-events-none"
                  />
                  {/* Label text */}
                  <text
                    x={country.center.x}
                    y={country.center.y - 13}
                    textAnchor="middle"
                    className="pointer-events-none fill-slate-900 text-[10px] font-semibold md:text-xs"
                    style={{ userSelect: "none" }}
                  >
                    {country.name}
                  </text>
                </>
              )}
            </g>
          ))}

          {/* Connection lines (subtle) */}
          <g opacity="0.15">
            <line
              x1="220"
              y1="256"
              x2="308"
              y2="258"
              stroke="rgb(16 185 129)"
              strokeWidth="1"
              strokeDasharray="3,2"
            />
            <line
              x1="308"
              y1="258"
              x2="380"
              y2="255"
              stroke="rgb(16 185 129)"
              strokeWidth="1"
              strokeDasharray="3,2"
            />
            <line
              x1="380"
              y1="255"
              x2="400"
              y2="210"
              stroke="rgb(16 185 129)"
              strokeWidth="1"
              strokeDasharray="3,2"
            />
            <line
              x1="380"
              y1="255"
              x2="438"
              y2="250"
              stroke="rgb(16 185 129)"
              strokeWidth="1"
              strokeDasharray="3,2"
            />
            <line
              x1="380"
              y1="255"
              x2="407"
              y2="312"
              stroke="rgb(16 185 129)"
              strokeWidth="1"
              strokeDasharray="3,2"
            />
          </g>
        </svg>

        {/* Legend */}
        <div className="absolute bottom-3 left-3 right-3 rounded-xl border border-slate-200 bg-white/90 p-3 backdrop-blur-sm">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
            <div className="flex items-center gap-1.5">
              <div className="h-2 w-2 rounded-full bg-emerald-500" />
              <span className="text-xs font-semibold text-slate-700">
                ECO Region
              </span>
            </div>
            <span className="text-xs text-slate-600">
              {hoveredCountry
                ? countries.find((c) => c.id === hoveredCountry)?.name
                : "6 focus countries"}
            </span>
          </div>
        </div>
      </div>

      {/* Mobile country list */}
      <div className="mt-3 flex flex-wrap gap-2 md:hidden">
        {countries.map((country) => (
          <button
            key={country.id}
            onClick={() =>
              setHoveredCountry(
                hoveredCountry === country.id ? null : country.id
              )
            }
            className={`rounded-full border px-3 py-1 text-xs font-semibold transition-colors ${
              hoveredCountry === country.id
                ? "border-emerald-500 bg-emerald-50 text-emerald-900"
                : "border-slate-200 bg-white text-slate-700 hover:border-slate-300"
            }`}
          >
            {country.name}
          </button>
        ))}
      </div>
    </div>
  );
}

