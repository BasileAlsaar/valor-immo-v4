"use client"

import { useMemo } from "react"
import { Map, Marker, NavigationControl, AttributionControl } from "react-map-gl/maplibre"
import "maplibre-gl/dist/maplibre-gl.css"

const MAP_STYLE = "https://basemaps.cartocdn.com/gl/positron-gl-style/style.json"

type Props = {
  /** Latitude du centroïde du bien. */
  lat: number
  /** Longitude du centroïde du bien. */
  lng: number
  /** Seed pour l'offset déterministe (typiquement le slug du bien). */
  slug: string
  arrondissement?: string
}

/** djb2 hash (simple, stable, déterministe par caractère). */
function djb2(str: string): number {
  let hash = 5381
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) + hash + str.charCodeAt(i)) | 0
  }
  // Retourne un entier positif 32-bit
  return hash >>> 0
}

/**
 * Calcule un offset déterministe à partir du slug, max ±50 m.
 *
 * 50 m en degrés latitude ≈ 0.00045 (50 / 111 000)
 * 50 m en degrés longitude à Paris (48.85°) ≈ 0.00068 (50 / (111 000 × cos(48.85°)))
 */
function deterministicOffset(slug: string): { dLat: number; dLng: number } {
  const h1 = djb2(slug)
  const h2 = djb2(slug + ":lng")
  // Normalise en [-1, 1]
  const r1 = (h1 % 10000) / 10000
  const r2 = (h2 % 10000) / 10000
  const signedLat = (r1 - 0.5) * 2 // [-1, 1]
  const signedLng = (r2 - 0.5) * 2
  return {
    dLat: signedLat * 0.00045,
    dLng: signedLng * 0.00068,
  }
}

export function MiniMap({ lat, lng, slug, arrondissement }: Props) {
  const offsetCoords = useMemo(() => {
    const { dLat, dLng } = deterministicOffset(slug)
    return { lat: lat + dLat, lng: lng + dLng }
  }, [lat, lng, slug])

  return (
    <div data-testid="opportunity-minimap" className="w-full">
      <div className="h-[280px] w-full overflow-hidden rounded-2xl border border-fir-dark/10 bg-fir-dark md:h-[360px]">
        <Map
          initialViewState={{
            longitude: offsetCoords.lng,
            latitude: offsetCoords.lat,
            zoom: 15,
          }}
          mapStyle={MAP_STYLE}
          attributionControl={false}
          cooperativeGestures
          style={{ width: "100%", height: "100%" }}
        >
          <AttributionControl compact />
          <NavigationControl position="bottom-right" showCompass={false} />
          <Marker longitude={offsetCoords.lng} latitude={offsetCoords.lat} anchor="bottom">
            <span
              aria-label={`Localisation approximative${arrondissement ? ` — ${arrondissement}` : ""}`}
              className="block h-8 w-8 -translate-y-1 rounded-full border-[3px] border-white bg-gold shadow-[0_6px_18px_rgba(15,61,46,0.5)]"
            />
          </Marker>
        </Map>
      </div>
      <p className="mt-2 text-xs text-ink/55">
        Localisation approximative à l'échelle du quartier — adresse exacte
        communiquée sur demande.
      </p>
    </div>
  )
}
