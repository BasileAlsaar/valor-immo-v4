"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import maplibregl from "maplibre-gl"
import {
  AttributionControl,
  Layer,
  Map,
  Marker,
  NavigationControl,
  Popup,
  Source,
  type MapRef,
  type MapLayerMouseEvent,
} from "react-map-gl/maplibre"
import "maplibre-gl/dist/maplibre-gl.css"

import { ARRONDISSEMENTS_PARIS } from "@/lib/data/valeurs-locatives"
import {
  CHOROPLETH_FILL_PAINT,
  CHOROPLETH_LINE_PAINT,
  HEATMAP_PAINT,
  POINTS_CIRCLE_PAINT,
} from "@/lib/data/argus-layers"
import { MapLayerToggle, type LayersState } from "@/components/home/map-layer-toggle"
import { cn } from "@/lib/utils"

const MAP_STYLE = "https://basemaps.cartocdn.com/gl/positron-gl-style/style.json"
const ARR_SOURCE = "argus-arrondissements"
const REFS_SOURCE = "argus-references"
const ARR_FILL_LAYER = "argus-arr-fill"
const ARR_LINE_LAYER = "argus-arr-line"
const HEATMAP_LAYER = "argus-heatmap"
const POINTS_LAYER = "argus-points"

type Props = {
  focus: number | null
  onFocus: (n: number | null) => void
  layers: LayersState
  onLayersChange: (next: LayersState) => void
  /** Callback de mesure perf : delta ms entre mount et map.on("load"). */
  onLoadMs?: (ms: number) => void
}

type ArrFeatureProps = {
  code: string
  nom: string
  prix_commerce: number
  prix_restau_extract: number
}

type RefPopupData = {
  lng: number
  lat: number
  arr: string
  type: string
  prix: number
  surface: number
  annee: number
}

type ArrPopupData = {
  lng: number
  lat: number
  code: string
  nom: string
  prixCommerce: number
  prixRestauExtract: number
}

/**
 * Carte ARGUS enrichie — sprint 3.
 *
 * Comportements préservés du composant vanilla d'origine (cf. PR sprint 3) :
 *   - viewport initial [2.3522, 48.8566] zoom 10.6
 *   - style Carto Positron
 *   - cooperativeGestures
 *   - AttributionControl compact + NavigationControl sans compass
 *   - 20 markers gold dimensionnés par prix commerce
 *   - sync hover bidirectionnelle map ↔ tableau (state `focus` partagé)
 *   - popups markers avec commerce + restauration extraction
 *   - hauteurs responsive 440px / 560px
 *
 * Ajouts sprint 3 :
 *   - Source GeoJSON arrondissements + layers fill (6 paliers) + line outline or
 *   - Source GeoJSON points synthétiques + layer heatmap + layer circle (zoom 14+)
 *   - Popup arrondissement au click
 *   - Popup point individuel au click
 *   - Toggle UI des 3 calques
 */
export function ArgusMap({ focus, onFocus, layers, onLayersChange, onLoadMs }: Props) {
  const mapRef = useRef<MapRef | null>(null)
  const mountTime = useRef<number>(0)
  const [arrPopup, setArrPopup] = useState<ArrPopupData | null>(null)
  const [refPopup, setRefPopup] = useState<RefPopupData | null>(null)
  const [hoveredArrId, setHoveredArrId] = useState<string | null>(null)

  // Mark mount time pour la mesure perf (brief §227)
  useEffect(() => {
    mountTime.current = performance.now()
  }, [])

  // Sync `focus` → `feature-state.hover` sur les arrondissements
  useEffect(() => {
    const map = mapRef.current?.getMap()
    if (!map) return
    const focusedCode = focus !== null ? `750${String(focus).padStart(2, "0")}` : null
    // Reset previous
    if (hoveredArrId && hoveredArrId !== focusedCode) {
      try {
        map.setFeatureState({ source: ARR_SOURCE, id: hoveredArrId }, { hover: false })
      } catch {
        // Source pas encore chargée
      }
    }
    if (focusedCode) {
      try {
        map.setFeatureState({ source: ARR_SOURCE, id: focusedCode }, { hover: true })
      } catch {
        // ignore
      }
    }
    setHoveredArrId(focusedCode)
  }, [focus, hoveredArrId])

  const onLoad = useCallback(() => {
    const elapsed = Math.round(performance.now() - mountTime.current)
    onLoadMs?.(elapsed)
    if (process.env.NODE_ENV !== "production") {
      // Reporté en PR sprint 3 §227 — mesuré à `map.on("load")`
      console.info(`[argus-map] first-interactive-render: ${elapsed}ms`)
    }
  }, [onLoadMs])

  const onArrMouseMove = useCallback(
    (e: MapLayerMouseEvent) => {
      const feat = e.features?.[0]
      if (!feat) return
      const code = (feat.properties as ArrFeatureProps).code
      const arrNum = parseInt(code.slice(-2), 10)
      onFocus(arrNum)
    },
    [onFocus],
  )

  const onArrMouseLeave = useCallback(() => {
    onFocus(null)
  }, [onFocus])

  const onArrClick = useCallback((e: MapLayerMouseEvent) => {
    const feat = e.features?.[0]
    if (!feat) return
    const props = feat.properties as ArrFeatureProps
    setArrPopup({
      lng: e.lngLat.lng,
      lat: e.lngLat.lat,
      code: props.code,
      nom: props.nom,
      prixCommerce: props.prix_commerce,
      prixRestauExtract: props.prix_restau_extract,
    })
  }, [])

  const onPointClick = useCallback((e: MapLayerMouseEvent) => {
    const feat = e.features?.[0]
    if (!feat) return
    const p = feat.properties as {
      arr: string
      type: string
      prix_m2_an_ht_hc: number
      surface_estimee: number
      annee: number
    }
    setRefPopup({
      lng: e.lngLat.lng,
      lat: e.lngLat.lat,
      arr: p.arr,
      type: p.type,
      prix: p.prix_m2_an_ht_hc,
      surface: p.surface_estimee,
      annee: p.annee,
    })
  }, [])

  // Tailles markers proportionnelles au prix commerce (préservé sprint 1)
  const minPrix = Math.min(...ARRONDISSEMENTS_PARIS.map((a) => a.loyerCommerceMoyen))
  const maxPrix = Math.max(...ARRONDISSEMENTS_PARIS.map((a) => a.loyerCommerceMoyen))

  // Couches interactives (cursor + listeners) : seulement les layers actifs
  const interactiveLayerIds: string[] = []
  if (layers.choropleth) interactiveLayerIds.push(ARR_FILL_LAYER)
  if (layers.heatmap) interactiveLayerIds.push(POINTS_LAYER)

  return (
    <div className="relative h-[440px] w-full md:h-[560px]" role="region" aria-label="Carte des valeurs locatives Paris par arrondissement">
      <Map
        ref={mapRef}
        initialViewState={{ longitude: 2.3522, latitude: 48.8566, zoom: 10.6 }}
        mapStyle={MAP_STYLE}
        cooperativeGestures
        attributionControl={false}
        interactiveLayerIds={interactiveLayerIds}
        cursor="auto"
        onLoad={onLoad}
        onClick={(e) => {
          const top = e.features?.[0]
          if (!top) return
          if (top.layer.id === ARR_FILL_LAYER) onArrClick(e)
          else if (top.layer.id === POINTS_LAYER) onPointClick(e)
        }}
        onMouseMove={(e) => {
          const top = e.features?.[0]
          if (top?.layer.id === ARR_FILL_LAYER) onArrMouseMove(e)
          else if (focus !== null && !top) onArrMouseLeave()
        }}
        style={{ width: "100%", height: "100%" }}
      >
        <AttributionControl compact />
        <NavigationControl showCompass={false} position="top-right" />

        {/* Arrondissements (choroplèthes) */}
        {layers.choropleth && (
          <Source
            id={ARR_SOURCE}
            type="geojson"
            data="/arrondissements-paris.geojson"
            promoteId="code"
          >
            <Layer
              id={ARR_FILL_LAYER}
              type="fill"
              paint={CHOROPLETH_FILL_PAINT}
            />
            <Layer
              id={ARR_LINE_LAYER}
              type="line"
              paint={CHOROPLETH_LINE_PAINT}
            />
          </Source>
        )}

        {/* Heatmap + points individuels au zoom 14+ */}
        {layers.heatmap && (
          <Source
            id={REFS_SOURCE}
            type="geojson"
            data="/references-synthetic.json"
            cluster={false}
          >
            <Layer
              id={HEATMAP_LAYER}
              type="heatmap"
              paint={HEATMAP_PAINT}
              maxzoom={15}
            />
            <Layer
              id={POINTS_LAYER}
              type="circle"
              paint={POINTS_CIRCLE_PAINT}
              minzoom={13}
            />
          </Source>
        )}

        {/* Markers gold existants — DOM custom via children de <Marker> */}
        {layers.markers &&
          ARRONDISSEMENTS_PARIS.map((arr) => {
            const norm = (arr.loyerCommerceMoyen - minPrix) / (maxPrix - minPrix)
            const size = 16 + norm * 36
            const isFocused = focus === arr.num
            return (
              <Marker
                key={arr.num}
                longitude={arr.center[0]}
                latitude={arr.center[1]}
                anchor="center"
              >
                <button
                  type="button"
                  onMouseEnter={() => onFocus(arr.num)}
                  onMouseLeave={() => onFocus(null)}
                  onClick={(e) => {
                    e.stopPropagation()
                    // Popup marker (legacy) — affiché via MapLibre popup natif au click
                    const map = mapRef.current?.getMap()
                    if (!map) return
                    new maplibregl.Popup({ offset: size / 2 + 6, closeButton: false })
                      .setLngLat(arr.center)
                      .setHTML(buildMarkerPopupHtml(arr))
                      .addTo(map)
                  }}
                  aria-label={`${arr.display} — ${arr.loyerCommerceMoyen} €/m²/an`}
                  className={cn(
                    "rounded-full border-2 transition-transform duration-200 ease-out",
                    isFocused
                      ? "border-gold bg-fir-dark scale-125"
                      : "border-white bg-gold/85",
                  )}
                  style={{
                    width: `${size}px`,
                    height: `${size}px`,
                    boxShadow: "0 4px 14px rgba(15,61,46,0.35)",
                  }}
                />
              </Marker>
            )
          })}

        {/* Popups arrondissement (click) */}
        {arrPopup && (
          <Popup
            longitude={arrPopup.lng}
            latitude={arrPopup.lat}
            anchor="bottom"
            closeButton
            closeOnClick={false}
            onClose={() => setArrPopup(null)}
            className="argus-popup"
          >
            <div className="font-sans text-sm">
              <div className="font-semibold text-fir-dark">{arrPopup.nom}</div>
              <div className="mt-1 text-xs text-slate-muted">Commerce</div>
              <div className="font-semibold text-fir-dark">
                {arrPopup.prixCommerce.toLocaleString("fr-FR")} €/m²/an
              </div>
              <div className="mt-1 text-xs text-slate-muted">Restauration extraction</div>
              <div className="font-semibold text-gold-deep">
                {arrPopup.prixRestauExtract.toLocaleString("fr-FR")} €/m²/an
              </div>
            </div>
          </Popup>
        )}

        {/* Popups point individuel (click) */}
        {refPopup && (
          <Popup
            longitude={refPopup.lng}
            latitude={refPopup.lat}
            anchor="bottom"
            closeButton
            closeOnClick={false}
            onClose={() => setRefPopup(null)}
            className="argus-popup"
          >
            <div className="font-sans text-sm">
              <div className="font-semibold text-fir-dark">
                Référence — {labelType(refPopup.type)}
              </div>
              <div className="mt-1 text-xs text-slate-muted">
                {arrLabel(refPopup.arr)} · {refPopup.annee}
              </div>
              <div className="mt-2 font-mono text-xs">
                <span className="text-slate-muted">Surface :</span>{" "}
                <span className="text-fir-dark">{refPopup.surface} m²</span>
              </div>
              <div className="font-mono text-xs">
                <span className="text-slate-muted">Prix :</span>{" "}
                <span className="font-semibold text-fir-dark">
                  {refPopup.prix.toLocaleString("fr-FR")} €/m²/an HT HC
                </span>
              </div>
            </div>
          </Popup>
        )}
      </Map>

      <MapLayerToggle value={layers} onChange={onLayersChange} />
    </div>
  )
}

function buildMarkerPopupHtml(arr: (typeof ARRONDISSEMENTS_PARIS)[number]): string {
  return `<div style="font-family:var(--font-inter);">
    <div style="font-weight:600;color:#0F3D2E;">${arr.display}</div>
    <div style="margin-top:4px;font-size:12px;color:#5B6573;">Commerce</div>
    <div style="font-weight:700;color:#0F3D2E;">${arr.loyerCommerceMoyen.toLocaleString("fr-FR")} €/m²/an</div>
    <div style="margin-top:4px;font-size:12px;color:#5B6573;">Restauration extraction</div>
    <div style="font-weight:700;color:#7A571E;">${arr.loyerRestauExtract.toLocaleString("fr-FR")} €/m²/an</div>
  </div>`
}

function labelType(t: string): string {
  if (t === "commerce") return "Local commercial"
  if (t === "restau_extract") return "Restauration extraction"
  if (t === "bureaux") return "Bureaux"
  return t
}

function arrLabel(code: string): string {
  if (code.startsWith("750")) {
    const n = parseInt(code.slice(-2), 10)
    return n === 1 ? "Paris 1ᵉʳ" : `Paris ${n}ᵉ`
  }
  // Petite couronne — labels manuels minimes
  const COMMUNES: Record<string, string> = {
    "92044": "Levallois-Perret",
    "92051": "Neuilly-sur-Seine",
    "92012": "Boulogne-Billancourt",
    "94067": "Saint-Mandé",
    "94080": "Vincennes",
  }
  return COMMUNES[code] ?? code
}
