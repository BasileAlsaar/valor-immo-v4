"use client"

import { useMemo } from "react"
import { Layer, Map, Source } from "react-map-gl/maplibre"
import "maplibre-gl/dist/maplibre-gl.css"

type CirclePolygon = {
  type: "Feature"
  geometry: { type: "Polygon"; coordinates: [number, number][][] }
  properties: Record<string, never>
}

import { cn } from "@/lib/utils"

const MAP_STYLE = "https://basemaps.cartocdn.com/gl/positron-gl-style/style.json"
const EARTH_RADIUS_M = 6_371_000
const CIRCLE_STEPS = 96

type Props = {
  /** Latitude arrondie (≈ ±100 m). Ne JAMAIS passer la coord exacte. */
  centerLat: number
  centerLng: number
  /** Rayon en mètres du cercle de zone. */
  radiusMeters: number
  cityLabel?: string | null
  districtLabel?: string | null
  className?: string
}

/**
 * Polygon GeoJSON approximant un cercle en mètres. Convertit mètres → degrés
 * en utilisant le rayon terrestre et cos(lat) pour la longitude.
 */
function circleFeature(
  lat: number,
  lng: number,
  radiusM: number,
  steps = CIRCLE_STEPS
): CirclePolygon {
  const dLat = (radiusM / EARTH_RADIUS_M) * (180 / Math.PI)
  const dLng = dLat / Math.max(Math.cos((lat * Math.PI) / 180), 1e-6)
  const coords: [number, number][] = []
  for (let i = 0; i <= steps; i++) {
    const angle = (i / steps) * 2 * Math.PI
    coords.push([lng + dLng * Math.sin(angle), lat + dLat * Math.cos(angle)])
  }
  return {
    type: "Feature",
    geometry: { type: "Polygon", coordinates: [coords] },
    properties: {},
  }
}

/**
 * Carte MapLibre affichant UNIQUEMENT un cercle de zone (aucun marqueur
 * précis, cohérent avec l'affichage niveau ville dans le JSON-LD).
 * Zoom initial calé sur la taille de la zone.
 */
export function ZoneMap({
  centerLat,
  centerLng,
  radiusMeters,
  cityLabel,
  districtLabel,
  className,
}: Props) {
  const feature = useMemo(
    () => circleFeature(centerLat, centerLng, radiusMeters),
    [centerLat, centerLng, radiusMeters]
  )

  const initialZoom = radiusMeters <= 300 ? 15 : radiusMeters <= 600 ? 14 : 13
  const geoLabel = [districtLabel, cityLabel].filter(Boolean).join(" · ")

  return (
    <div className={cn("w-full", className)}>
      <div className="h-[280px] w-full overflow-hidden rounded-2xl border border-fir-dark/10 bg-fir-dark md:h-[360px]">
        <Map
          initialViewState={{
            longitude: centerLng,
            latitude: centerLat,
            zoom: initialZoom,
          }}
          mapStyle={MAP_STYLE}
          attributionControl={{ compact: true }}
          cooperativeGestures
          style={{ width: "100%", height: "100%" }}
          aria-label={`Zone approximative${geoLabel ? ` — ${geoLabel}` : ""}, rayon ${radiusMeters} mètres`}
        >
          <Source id="zone-circle" type="geojson" data={feature}>
            <Layer
              id="zone-circle-fill"
              type="fill"
              paint={{
                "fill-color": "#0F3D2E",
                "fill-opacity": 0.14,
              }}
            />
            <Layer
              id="zone-circle-outline"
              type="line"
              paint={{
                "line-color": "#0F3D2E",
                "line-width": 2,
                "line-opacity": 0.8,
              }}
            />
          </Source>
        </Map>
      </div>
      <p className="mt-2 text-xs text-ink/55">
        Zone approximative à l&apos;échelle du quartier — adresse exacte
        communiquée sur demande.
      </p>
    </div>
  )
}
