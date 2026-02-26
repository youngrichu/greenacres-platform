"use client";

import { useEffect, useRef } from "react";
import "leaflet/dist/leaflet.css";
import type {
  Map as LeafletMap,
  GeoJSON as LeafletGeoJSON,
  Layer,
} from "leaflet";

interface LeafletMapProps {
  activeRegionId: string | null;
  onRegionClick: (regionId: string) => void;
}

// Brand colours
const GOLD = "#d4a853";

// Maps each GeoJSON regionId → the coffee display name shown on hover/panel
// This prevents confusion when the admin zone name (e.g. "West Harerge") differs
// from the well-known coffee name (e.g. "Lekempti").
const REGION_DISPLAY_NAMES: Record<string, string> = {
  yirgacheffe: "Yirgacheffe",
  sidama: "Sidama",
  guji: "Guji",
  jimma: "Jimma",
  kaffa: "Kaffa",
  teppi: "Teppi",
  andrecha: "Andrecha",
  limmu: "Limmu",
  lekempti: "Lekempti",
  harar: "Harar",
};

export default function EthiopiaLeafletMap({
  activeRegionId,
  onRegionClick,
}: LeafletMapProps) {
  const mapRef = useRef<LeafletMap | null>(null);
  const geoJsonLayerRef = useRef<LeafletGeoJSON | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  // Keep latest callback in a ref to avoid stale closure inside Leaflet events
  const onClickRef = useRef(onRegionClick);
  useEffect(() => {
    onClickRef.current = onRegionClick;
  }, [onRegionClick]);

  // Boot the map on first mount
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    // Leaflet must be imported client-side only
    const L = require("leaflet") as typeof import("leaflet");

    const map = L.map(containerRef.current, {
      // Temporary center — will be overridden by fitBounds once GeoJSON loads
      center: [8.0, 39.0],
      zoom: 6,
      scrollWheelZoom: false, // never hijack mouse wheel scroll
      dragging: !L.Browser.touch, // on touch devices, let finger scroll the page
      zoomControl: false, // we add it bottom-right manually
      attributionControl: true,
    });

    // Reposition zoom control away from default top-left
    L.control.zoom({ position: "bottomright" }).addTo(map);

    // CartoDB Dark Matter — free, no API key
    L.tileLayer(
      "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
      {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/">CARTO</a>',
        subdomains: "abcd",
        maxZoom: 19,
      },
    ).addTo(map);

    // Style helpers
    const defaultStyle = () => ({
      fillColor: GOLD,
      fillOpacity: 0.12,
      color: GOLD,
      weight: 1.5,
      opacity: 0.6,
    });

    const hoverStyle = {
      fillColor: GOLD,
      fillOpacity: 0.35,
      color: GOLD,
      weight: 2.5,
      opacity: 1,
    };

    const activeStyle = {
      fillColor: GOLD,
      fillOpacity: 0.55,
      color: "#ffffff",
      weight: 2.5,
      opacity: 1,
    };

    // Load GeoJSON from /public
    fetch("/data/ethiopia-coffee-regions.geojson")
      .then((r) => r.json())
      .then((geojsonData) => {
        const geojsonLayer = L.geoJson(geojsonData, {
          style: defaultStyle,
          onEachFeature(feature, layer) {
            const regionId: string = feature.properties?.regionId ?? "";

            // Always show the COFFEE name in the tooltip, not the admin zone name.
            // e.g. "Lekempti" instead of "West Harerge" — avoids user confusion.
            const displayName = REGION_DISPLAY_NAMES[regionId] ?? regionId;

            // Tooltips are distracting & oversized on touch —
            // the button strip below the map handles mobile navigation.
            if (!L.Browser.touch) {
              layer.bindTooltip(displayName, {
                sticky: true,
                className: "leaflet-coffee-tooltip",
                direction: "auto",
              });
            }

            layer.on({
              mouseover(e) {
                const l = e.target as LeafletGeoJSON & {
                  setStyle: (s: object) => void;
                  bringToFront: () => void;
                };
                // Don't override the active region highlight on hover
                if (
                  regionId !==
                  (mapRef.current as LeafletMap & { _activeRegionId?: string })
                    ?._activeRegionId
                ) {
                  l.setStyle(hoverStyle);
                }
                l.bringToFront();
              },
              mouseout(e) {
                const l = e.target as LeafletGeoJSON & {
                  setStyle: (s: object) => void;
                };
                if (
                  regionId !==
                  (mapRef.current as LeafletMap & { _activeRegionId?: string })
                    ?._activeRegionId
                ) {
                  l.setStyle(defaultStyle());
                }
              },
              click() {
                onClickRef.current(regionId);
              },
            });
          },
        }).addTo(map);

        // Auto-fit the map to show ALL 10 regions (including Harar in the east)
        // on first load, without requiring the user to zoom out.
        map.fitBounds(geojsonLayer.getBounds(), {
          padding: [28, 28],
          maxZoom: 7,
        });

        geoJsonLayerRef.current = geojsonLayer;
      })
      .catch((err) => console.error("Failed to load GeoJSON:", err));

    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
      geoJsonLayerRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Update styles when activeRegionId changes
  useEffect(() => {
    const map = mapRef.current as
      | (LeafletMap & { _activeRegionId?: string })
      | null;
    const geojsonLayer = geoJsonLayerRef.current;
    if (!map || !geojsonLayer) return;

    map._activeRegionId = activeRegionId ?? undefined;

    const defaultStyle = () => ({
      fillColor: GOLD,
      fillOpacity: 0.12,
      color: GOLD,
      weight: 1.5,
      opacity: 0.6,
    });

    geojsonLayer.eachLayer((layer) => {
      const l = layer as Layer & {
        feature?: GeoJSON.Feature;
        setStyle: (s: object) => void;
      };
      const regionId = l.feature?.properties?.regionId;
      if (regionId === activeRegionId) {
        l.setStyle({
          fillColor: GOLD,
          fillOpacity: 0.55,
          color: "#ffffff",
          weight: 2.5,
          opacity: 1,
        });
      } else {
        l.setStyle(defaultStyle());
      }
    });
  }, [activeRegionId]);

  return (
    <>
      {/* Leaflet tooltip custom styles injected once */}
      <style>{`
        .leaflet-coffee-tooltip {
          background: rgba(18, 35, 18, 0.92) !important;
          border: 1px solid ${GOLD} !important;
          color: ${GOLD} !important;
          font-family: var(--font-inter, sans-serif) !important;
          font-size: 0.75rem !important;
          font-weight: 600 !important;
          letter-spacing: 0.05em !important;
          text-transform: uppercase !important;
          padding: 4px 10px !important;
          border-radius: 4px !important;
          box-shadow: 0 2px 8px rgba(0,0,0,0.5) !important;
          white-space: nowrap !important;
        }
        .leaflet-coffee-tooltip::before {
          border-top-color: ${GOLD} !important;
        }
        /* Hide built-in zoom box border on dark theme */
        .leaflet-bar a {
          background-color: rgba(18,35,18,0.9) !important;
          color: ${GOLD} !important;
          border-color: ${GOLD}44 !important;
        }
        .leaflet-bar a:hover {
          background-color: rgba(212,168,83,0.15) !important;
        }
        /* Attribution legibility on dark */
        .leaflet-control-attribution {
          background: rgba(0,0,0,0.6) !important;
          color: rgba(255,255,255,0.4) !important;
          font-size: 9px !important;
        }
        .leaflet-control-attribution a {
          color: rgba(212,168,83,0.6) !important;
        }
      `}</style>
      <div
        ref={containerRef}
        className="w-full h-full rounded-xl overflow-hidden"
        style={{ minHeight: "360px" }}
      />
    </>
  );
}
