"use client";

import dynamic from "next/dynamic";
import { useEffect, useMemo, useRef, useState } from "react";
import useMeasure from "react-use-measure";
import { feature } from "topojson-client";

const Globe = dynamic(() => import("react-globe.gl"), { ssr: false });

// Use names that match the dataset names (we’ll also do light normalization)
const ECO_SET = new Set([
  "Pakistan",
  "Uzbekistan",
  "Kyrgyzstan",
  "Kazakhstan",
  "Turkey",
  "Azerbaijan",
]);

function normName(s = "") {
  return s.trim().toLowerCase();
}

export default function PlanetGlobe({ accent = "#22c55e" }) {
  const globeRef = useRef(null);
  const [ref, bounds] = useMeasure();
  const [isMobile, setIsMobile] = useState(false);
  const [countries, setCountries] = useState(null);
  const [activeName, setActiveName] = useState(null);

  // mobile detect
  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 768);
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

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

  // Set initial view: focus around Central Asia / ECO region
  useEffect(() => {
    if (!globeRef.current) return;
    globeRef.current.pointOfView(
      { lat: 41, lng: 62, altitude: isMobile ? 2.2 : 1.9 },
      0
    );

    const controls = globeRef.current.controls();
    controls.enablePan = false;
    controls.enableZoom = true;
    controls.minDistance = 140;
    controls.maxDistance = 320;
    controls.autoRotate = !isMobile;
    controls.autoRotateSpeed = 0.25;
  }, [isMobile]);

  const polygonCapColor = (feat) => {
    const name =
      feat.properties?.name ||
      feat.properties?.NAME ||
      feat.properties?.admin ||
      "";

    const isEco =
      ECO_SET.has(
        // try both raw and normalized matching
        name
      ) ||
      ECO_SET.has(
        // fallback normalization
        name
          .replace("Kyrgyz Republic", "Kyrgyzstan")
          .replace("Türkiye", "Turkey")
      );

    if (isEco) return "rgba(34,197,94,0.55)"; // accent fill
    return "rgba(15,23,42,0.10)"; // very subtle world
  };

  const polygonSideColor = (feat) => {
    const name = feat.properties?.name || feat.properties?.NAME || "";
    const isEco = ECO_SET.has(name);
    return isEco ? "rgba(34,197,94,0.35)" : "rgba(15,23,42,0.03)";
  };

  const polygonStrokeColor = (feat) => {
    const name = feat.properties?.name || feat.properties?.NAME || "";
    const isEco = ECO_SET.has(name);
    return isEco ? "rgba(34,197,94,0.8)" : "rgba(148,163,184,0.08)";
  };

  const onPolyClick = (feat) => {
    const name = feat.properties?.name || feat.properties?.NAME || "Country";
    setActiveName(name);

    // center camera on polygon centroid-ish (bbox center)
    const coords = feat.geometry?.coordinates;
    // If you want perfect centroid: later, use turf/centroid. For MVP, just zoom in.
    if (globeRef.current) {
      globeRef.current.pointOfView(
        { lat: 41, lng: 62, altitude: isMobile ? 2.0 : 1.7 },
        700
      );
    }
  };

  const w = Math.max(1, Math.floor(bounds.width));
  const h = Math.max(1, Math.floor(bounds.height));

  return (
    <div className="w-full">
      {/* CARD that CONSTRAINS canvas */}
      <div
        ref={ref}
        className="
          relative w-full overflow-hidden rounded-3xl
          border border-slate-200 bg-white/60 shadow-sm backdrop-blur
          h-[260px] md:h-[340px]
        "
      >
        {/* Globe fills the card exactly */}
        <Globe
          ref={globeRef}
          width={w}
          height={h}
          backgroundColor="rgba(0,0,0,0)"
          globeImageUrl="//unpkg.com/three-globe/example/img/earth-dark.jpg"
          // Polygons highlight (instead of ugly markers)
          polygonsData={countries || []}
          polygonAltitude={(feat) => {
            const name = feat.properties?.name || feat.properties?.NAME || "";
            return ECO_SET.has(name) ? 0.06 : 0.01;
          }}
          polygonCapColor={polygonCapColor}
          polygonSideColor={polygonSideColor}
          polygonStrokeColor={polygonStrokeColor}
          polygonLabel={(feat) => {
            const name = feat.properties?.name || feat.properties?.NAME || "";
            const eco = ECO_SET.has(name);
            if (!eco) return "";
            return `
              <div style="font-size:12px;padding:6px 8px;border-radius:10px;background:rgba(15,23,42,0.9);color:white;">
                <b>${name}</b><br/>ECO focus
              </div>
            `;
          }}
          onPolygonClick={onPolyClick}
          // performance tweak
          rendererConfig={{ antialias: true, alpha: true }}
        />

        {/* subtle overlay for premium feel */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-slate-900/10 via-transparent to-emerald-500/10" />
      </div>

      {/* small caption / active country */}
      <div className="mt-2 flex items-center justify-between">
        <div className="text-xs text-slate-600">
          {activeName ? (
            <>
              Selected:{" "}
              <span className="font-semibold text-slate-900">{activeName}</span>
            </>
          ) : (
            "Tap a highlighted ECO country"
          )}
        </div>
        {activeName ? (
          <button
            onClick={() => setActiveName(null)}
            className="text-xs rounded-xl border border-slate-200 bg-white px-3 py-1 text-slate-700 hover:bg-slate-50"
          >
            Clear
          </button>
        ) : null}
      </div>
    </div>
  );
}
