"use client";

import { useEffect, useRef, useState } from "react";
import type { Map as LeafletMap, Marker } from "leaflet";
import "leaflet/dist/leaflet.css";

/**
 * Optional precise map pin for the "Add a Place" submission form — the
 * island/atoll the place is tied to already narrows its rough location,
 * this just lets a submitter drop a more exact pin if they want to.
 * Click or drag the marker to set lat/lng; leaving it untouched submits
 * no coordinates at all (the admin can still see roughly where the
 * place is from its parent island/atoll).
 *
 * Same lazy `import("leaflet")` pattern as src/components/locations/
 * location-map.tsx, for the same SSR-safety reason — never a top-level
 * `import L from "leaflet"`.
 */
export function MapPicker({ initialLat, initialLng }: { initialLat?: number | null; initialLng?: number | null }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<LeafletMap | null>(null);
  const markerRef = useRef<Marker | null>(null);
  const [picked, setPicked] = useState<{ lat: number; lng: number } | null>(null);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;
    const centerLat = initialLat ?? 3.2;
    const centerLng = initialLng ?? 73.0;

    let cancelled = false;
    void import("leaflet").then(({ default: L }) => {
      if (cancelled || !containerRef.current || mapRef.current) return;
      const map = L.map(containerRef.current, { scrollWheelZoom: false, attributionControl: true }).setView([centerLat, centerLng], 12);
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 19,
      }).addTo(map);

      const placeMarker = (lat: number, lng: number) => {
        if (markerRef.current) {
          markerRef.current.setLatLng([lat, lng]);
        } else {
          markerRef.current = L.marker([lat, lng], { draggable: true }).addTo(map);
          markerRef.current.on("dragend", () => {
            const pos = markerRef.current!.getLatLng();
            setPicked({ lat: pos.lat, lng: pos.lng });
          });
        }
        setPicked({ lat, lng });
      };

      map.on("click", (event) => placeMarker(event.latlng.lat, event.latlng.lng));
      mapRef.current = map;
    });

    return () => {
      cancelled = true;
      markerRef.current?.remove();
      markerRef.current = null;
      mapRef.current?.remove();
      mapRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- intentionally only re-centers on mount; re-running on every lat/lng change would tear down the map on the picker's own setPicked updates.
  }, []);

  return (
    <div>
      <div ref={containerRef} className="h-56 w-full rounded-xl border border-neutral-300 sm:h-64" />
      <p className="mt-1.5 text-xs text-neutral-500">
        {picked ? `Pin set at ${picked.lat.toFixed(5)}, ${picked.lng.toFixed(5)} — click or drag to adjust.` : "Optional — click the map to drop a pin at the exact spot."}
      </p>
      <input type="hidden" name="lat" value={picked?.lat ?? ""} readOnly />
      <input type="hidden" name="lng" value={picked?.lng ?? ""} readOnly />
    </div>
  );
}
