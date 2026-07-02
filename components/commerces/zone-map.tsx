"use client"

import { useMemo } from "react"
import { Layer, Map, Marker, Source } from "react-map-gl/maplibre"
import "maplibre-gl/dist/maplibre-gl.css"

import { cn } from "@/lib/utils"
import type { NearbyStop } from "@/lib/transports/nearest-stops"

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

/**
 * Traductions FR pour l'overlay des cooperative gestures MapLibre.
 * L'overlay par défaut est en anglais (chaîne du bundle maplibre-gl
 * mentionnant ⌘/Ctrl + molette). MapLibre choisit la clé Mac/Windows
 * selon l'OS ; on couvre les deux + le message mobile pour cohérence.
 */
const MAP_LOCALE_FR = {
  "CooperativeGesturesHandler.MacHelpText":
    "Maintenez ⌘ + molette pour zoomer",
  "CooperativeGesturesHandler.WindowsHelpText":
    "Maintenez Ctrl + molette pour zoomer",
  "CooperativeGesturesHandler.MobileHelpText":
    "Utilisez deux doigts pour déplacer la carte",
} as const

type Props = {
  /** Latitude arrondie (≈ ±100 m). Ne JAMAIS passer la coord exacte. */
  centerLat: number
  centerLng: number
  /** Rayon en mètres du cercle de zone. */
  radiusMeters: number
  cityLabel?: string | null
  districtLabel?: string | null
  /**
   * Stations de transport les plus proches, déjà résolues côté serveur
   * via `nearestStops()`. 0-3 items. Rendues comme repères sur la carte.
   */
  stops?: NearbyStop[]
  className?: string
}

/**
 * Libellé compact de la ligne à afficher dans la chip du marqueur.
 * Convention éditoriale : « M13 » pour métro, « RER B » pour RER,
 * « T3a » pour tramway, sinon le short name brut (TER, L, U…).
 */
function formatLineBadge(s: NearbyStop): string {
  const primary = s.lines[0] ?? ""
  if (s.type === "metro") return `M${primary}`
  if (s.type === "rer") return `RER ${primary}`
  if (s.type === "tram") return primary.toUpperCase().startsWith("T") ? primary : `T${primary}`
  return primary // train / TER / L / U…
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
  stops,
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
          locale={MAP_LOCALE_FR}
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

          {/* Repères transport : marqueur or + chip label serif. Les
              distances sont volontairement non affichées (dérivées de
              coord arrondies ±100 m → fausse précision au mètre). */}
          {stops?.map((s) => (
            <Marker
              key={`${s.name}-${s.type}`}
              longitude={s.lng}
              latitude={s.lat}
              anchor="bottom"
            >
              <div className="flex flex-col items-center gap-1">
                <span className="rounded-full bg-cream/95 px-2.5 py-0.5 font-accent text-[11px] font-medium tracking-wide text-fir-dark shadow-[0_2px_10px_rgba(15,61,46,0.18)] whitespace-nowrap">
                  <span className="text-gold-deep">{formatLineBadge(s)}</span>
                  <span className="ml-1.5 opacity-80">{s.name}</span>
                </span>
                <span
                  aria-hidden
                  className="h-2.5 w-2.5 rounded-full bg-gold border-2 border-white shadow-[0_1px_4px_rgba(15,61,46,0.35)]"
                />
              </div>
            </Marker>
          ))}
        </Map>
      </div>
      <p className="mt-2 text-xs text-ink/55">
        Zone approximative à l&apos;échelle du quartier — adresse exacte
        communiquée sur demande.
      </p>
    </div>
  )
}
