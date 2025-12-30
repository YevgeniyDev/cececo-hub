"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import useMeasure from "react-use-measure";
import { feature } from "topojson-client";

const Globe = dynamic(() => import("react-globe.gl"), { ssr: false });

const ECO_SET = new Set([
  "Pakistan",
  "Uzbekistan",
  "Kyrgyzstan",
  "Kazakhstan",
  "Turkey",
  "Azerbaijan",
]);

function normalizeCountryName(nameRaw = "") {
  return nameRaw
    .trim()
    .replace("Kyrgyz Republic", "Kyrgyzstan")
    .replace("Türkiye", "Turkey");
}

function isEco(nameRaw = "") {
  return ECO_SET.has(normalizeCountryName(nameRaw));
}

export default function PlanetGlobe({ accent = "#10b981" }) {
  const globeRef = useRef(null);

  // measure container width only
  const [ref, bounds] = useMeasure();
  const [W, setW] = useState(1);

  const [isMobile, setIsMobile] = useState(false);
  const [countries, setCountries] = useState(null);
  const [activeName, setActiveName] = useState(null);

  // fixed heights => no feedback loop
  const fixedH = isMobile ? 240 : 320; // smaller hero block (tweak if needed)

  // mobile detect
  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 768);
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // snap width updates to avoid 1px oscillation loops
  useEffect(() => {
    const next = Math.max(1, Math.round(bounds.width || 1));
    setW((prev) => (Math.abs(prev - next) <= 1 ? prev : next));
  }, [bounds.width]);

  // load world countries (TopoJSON -> GeoJSON)
  useEffect(() => {
    let cancelled = false;

    async function load() {
      const res = await fetch(
        "https://unpkg.com/world-atlas@2/countries-110m.json"
      );
      const topo = await res.json();
      const geo = feature(topo, topo.objects.countries);
      if (!cancelled) setCountries(geo.features);
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  // set camera + controls
  useEffect(() => {
    if (!globeRef.current) return;

    // Focus on ECO region (Central Asia-ish)
    globeRef.current.pointOfView(
      { lat: 41, lng: 62, altitude: isMobile ? 2.2 : 1.9 },
      0
    );

    const controls = globeRef.current.controls();
    controls.enablePan = false;
    controls.enableZoom = true;

    // Keep zoom bounded so it feels “hero-like”
    controls.minDistance = 140;
    controls.maxDistance = 320;

    // rotate only on desktop
    controls.autoRotate = !isMobile;
    controls.autoRotateSpeed = 0.25;
  }, [isMobile]);

  // styling for polygons
  const polygonCapColor = (feat) => {
    const name =
      feat.properties?.name ||
      feat.properties?.NAME ||
      feat.properties?.admin ||
      "";
    if (isEco(name)) {
      // Use accent but keep subtle
      // If you want, you can compute rgba from accent; MVP uses constant.
      return "rgba(16,185,129,0.55)";
    }
    return "rgba(15,23,42,0.10)";
  };

  const polygonSideColor = (feat) => {
    const name = feat.properties?.name || feat.properties?.NAME || "";
    return isEco(name) ? "rgba(16,185,129,0.30)" : "rgba(15,23,42,0.02)";
  };

  const polygonStrokeColor = (feat) => {
    const name = feat.properties?.name || feat.properties?.NAME || "";
    return isEco(name) ? "rgba(16,185,129,0.85)" : "rgba(148,163,184,0.08)";
  };

  const polygonAltitude = (feat) => {
    const name = feat.properties?.name || feat.properties?.NAME || "";
    return isEco(name) ? 0.055 : 0.01;
  };

  const onPolygonClick = (feat) => {
    const raw =
      feat.properties?.name || feat.properties?.NAME || feat.properties?.admin;
    const name = normalizeCountryName(raw || "Country");
    if (!isEco(name)) return;

    setActiveName(name);

    // Keep the focus region stable (hero) rather than jumping wildly.
    if (globeRef.current) {
      globeRef.current.pointOfView(
        { lat: 41, lng: 62, altitude: isMobile ? 2.0 : 1.7 },
        700
      );
    }
  };

  return (
    <div className="w-full">
      {/* Card that constrains the canvas */}
      <div
        ref={ref}
        className="
          relative w-full min-w-0 overflow-hidden rounded-3xl
          border border-slate-200 bg-white/60 shadow-sm backdrop-blur
          h-[240px] md:h-[320px]
        "
      >
        <Globe
          ref={globeRef}
          width={W}
          height={fixedH}
          backgroundColor="rgba(0,0,0,0)"
          globeImageUrl="//unpkg.com/three-globe/example/img/earth-dark.jpg"
          rendererConfig={{ antialias: true, alpha: true }}
          polygonsData={countries || []}
          polygonAltitude={polygonAltitude}
          polygonCapColor={polygonCapColor}
          polygonSideColor={polygonSideColor}
          polygonStrokeColor={polygonStrokeColor}
          polygonLabel={(feat) => {
            const raw =
              feat.properties?.name ||
              feat.properties?.NAME ||
              feat.properties?.admin ||
              "";
            const name = normalizeCountryName(raw);
            if (!isEco(name)) return "";
            return `
              <div style="font-size:12px;padding:6px 8px;border-radius:10px;background:rgba(15,23,42,0.92);color:white;">
                <b>${name}</b><br/>ECO focus
              </div>
            `;
          }}
          onPolygonClick={onPolygonClick}
        />

        {/* subtle overlay */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-slate-900/10 via-transparent to-emerald-500/10" />
      </div>

      {/* small caption */}
      <div className="mt-2 flex items-center justify-between">
        <div className="text-xs text-slate-600">
          {activeName ? (
            <>
              Selected:{" "}
              <span className="font-semibold text-slate-900">{activeName}</span>
            </>
          ) : (
            "ECO focus countries selected for analytical scope in this project."
          )}
        </div>

        {activeName ? (
          <button
            onClick={() => setActiveName(null)}
            className="rounded-xl border border-slate-200 bg-white px-3 py-1 text-xs text-slate-700 hover:bg-slate-50"
          >
            Clear
          </button>
        ) : null}
      </div>
    </div>
  );
}
