"use client"

import { useMemo } from "react"
import { Layer, Map, Source } from "react-map-gl/maplibre"
import "maplibre-gl/dist/maplibre-gl.css"

import { cn } from "@/lib/utils"

const MAP_STYLE = "https://basemaps.cartocdn.com/gl/positron-gl-style/style.json"
const EARTH_RADIUS_M = 6_371_000
const CIRCLE_STEPS = 96

/**
 * Nombre d'anneaux concentriques pour approximer un dégradé radial. 6 est
 * un compromis entre lissage visuel et poids GeoJSON. Trop peu → dégradé
 * en marches ; trop → temps de rendu inutile car MapLibre `fill` est
 * limité à opacité uniforme par feature (pas de gradient natif).
 */
const RADIAL_SHELLS = 6

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

type ShellFeature = {
  type: "Feature"
  geometry: { type: "Polygon"; coordinates: [number, number][][] }
  properties: { opacity: number; ring: number }
}

/**
 * Polygone GeoJSON approximant un cercle de rayon `radiusM` autour du
 * point (lat, lng). Convertit mètres → degrés via le rayon terrestre et
 * cos(lat) pour la longitude.
 */
function circlePolygon(
  lat: number,
  lng: number,
  radiusM: number,
  steps = CIRCLE_STEPS,
): [number, number][] {
  const dLat = (radiusM / EARTH_RADIUS_M) * (180 / Math.PI)
  const dLng = dLat / Math.max(Math.cos((lat * Math.PI) / 180), 1e-6)
  const coords: [number, number][] = []
  for (let i = 0; i <= steps; i++) {
    const angle = (i / steps) * 2 * Math.PI
    coords.push([lng + dLng * Math.sin(angle), lat + dLat * Math.cos(angle)])
  }
  return coords
}

/**
 * FeatureCollection de N anneaux concentriques du plus petit au plus
 * grand, chacun porteur d'une `opacity` décroissante vers l'extérieur.
 * Empilés par MapLibre, ils simulent un dégradé radial : dense au centre
 * (~0.20 après cumul), transparent au bord (~0.03). Résultat : la voirie
 * et les labels restent lisibles sous les bords du cercle, tout en
 * suggérant clairement le centre de la zone.
 */
function radialShells(
  lat: number,
  lng: number,
  radiusM: number,
): { type: "FeatureCollection"; features: ShellFeature[] } {
  const features: ShellFeature[] = []
  for (let k = RADIAL_SHELLS; k >= 1; k--) {
    const r = (radiusM * k) / RADIAL_SHELLS
    // Opacité par shell : 0.055 → 0.055, cumul central ~0.28, cumul bord ~0.055.
    // Volontairement discret pour rester au-dessous de la voirie lisible.
    const opacity = 0.055
    features.push({
      type: "Feature",
      geometry: {
        type: "Polygon",
        coordinates: [circlePolygon(lat, lng, r)],
      },
      properties: { opacity, ring: k },
    })
  }
  return { type: "FeatureCollection", features }
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
  const shells = useMemo(
    () => radialShells(centerLat, centerLng, radiusMeters),
    [centerLat, centerLng, radiusMeters],
  )
  const outline = useMemo(
    () => ({
      type: "Feature" as const,
      geometry: {
        type: "Polygon" as const,
        coordinates: [circlePolygon(centerLat, centerLng, radiusMeters)],
      },
      properties: {},
    }),
    [centerLat, centerLng, radiusMeters],
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
          {/* Anneaux concentriques : opacité cumulative dense au centre,
              transparente au bord — la voirie et les labels restent
              lisibles sous le périmètre. */}
          <Source id="zone-shells" type="geojson" data={shells}>
            <Layer
              id="zone-shells-fill"
              type="fill"
              paint={{
                "fill-color": "#0F3D2E",
                "fill-opacity": ["get", "opacity"],
              }}
            />
          </Source>
          {/* Contour fin sur le rayon max — repère de zone sans trancher
              franchement, laisse deviner la limite. */}
          <Source id="zone-outline" type="geojson" data={outline}>
            <Layer
              id="zone-outline-line"
              type="line"
              paint={{
                "line-color": "#0F3D2E",
                "line-width": 1.25,
                "line-opacity": 0.55,
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
