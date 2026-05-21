"use client"

import { useEffect, useRef } from "react"
import maplibregl, { type Map as MlMap } from "maplibre-gl"
import "maplibre-gl/dist/maplibre-gl.css"

import { ARRONDISSEMENTS_PARIS } from "@/lib/data/valeurs-locatives"

type Props = {
  focus: number | null
  onFocus: (n: number | null) => void
}

export function ArgusMap({ focus, onFocus }: Props) {
  const ref = useRef<HTMLDivElement | null>(null)
  const mapRef = useRef<MlMap | null>(null)
  const markersRef = useRef<maplibregl.Marker[]>([])

  useEffect(() => {
    if (!ref.current || mapRef.current) return

    const map = new maplibregl.Map({
      container: ref.current,
      style: "https://basemaps.cartocdn.com/gl/positron-gl-style/style.json",
      center: [2.3522, 48.8566],
      zoom: 10.6,
      attributionControl: false,
      cooperativeGestures: true,
    })
    map.addControl(new maplibregl.AttributionControl({ compact: true }))
    map.addControl(new maplibregl.NavigationControl({ showCompass: false }), "top-right")

    // Markers : taille proportionnelle au prix
    const min = Math.min(...ARRONDISSEMENTS_PARIS.map((a) => a.loyerCommerceMoyen))
    const max = Math.max(...ARRONDISSEMENTS_PARIS.map((a) => a.loyerCommerceMoyen))

    ARRONDISSEMENTS_PARIS.forEach((arr) => {
      const norm = (arr.loyerCommerceMoyen - min) / (max - min)
      const size = 16 + norm * 36

      const el = document.createElement("button")
      el.type = "button"
      el.setAttribute("aria-label", `${arr.display} — ${arr.loyerCommerceMoyen} €/m²/an`)
      el.dataset.arr = String(arr.num)
      el.style.width = `${size}px`
      el.style.height = `${size}px`
      el.style.borderRadius = "9999px"
      el.style.background = "rgba(201,169,97,0.85)"
      el.style.border = "2px solid #ffffff"
      el.style.boxShadow = "0 4px 14px rgba(15,61,46,0.35)"
      el.style.cursor = "pointer"
      el.style.transition = "transform 200ms ease"
      el.addEventListener("mouseenter", () => onFocus(arr.num))
      el.addEventListener("mouseleave", () => onFocus(null))

      const marker = new maplibregl.Marker({ element: el })
        .setLngLat(arr.center)
        .setPopup(
          new maplibregl.Popup({ offset: size / 2 + 6, closeButton: false }).setHTML(
            `<div style="font-family:var(--font-inter);">
              <div style="font-weight:600;color:#0F3D2E;">${arr.display}</div>
              <div style="margin-top:4px;font-size:12px;color:#5B6573;">Commerce</div>
              <div style="font-weight:700;color:#0F3D2E;">${arr.loyerCommerceMoyen.toLocaleString("fr-FR")} €/m²/an</div>
              <div style="margin-top:4px;font-size:12px;color:#5B6573;">Restauration extraction</div>
              <div style="font-weight:700;color:#7A571E;">${arr.loyerRestauExtract.toLocaleString("fr-FR")} €/m²/an</div>
            </div>`,
          ),
        )
        .addTo(map)

      markersRef.current.push(marker)
    })

    mapRef.current = map
    return () => {
      map.remove()
      mapRef.current = null
      markersRef.current = []
    }
  }, [onFocus])

  // Highlight focus via re-render
  useEffect(() => {
    markersRef.current.forEach((m) => {
      const el = m.getElement()
      const num = Number(el.dataset.arr)
      if (focus === num) {
        el.style.transform = "scale(1.25)"
        el.style.background = "#0F3D2E"
        el.style.border = "2px solid #C9A961"
      } else {
        el.style.transform = "scale(1)"
        el.style.background = "rgba(201,169,97,0.85)"
        el.style.border = "2px solid #ffffff"
      }
    })
  }, [focus])

  return (
    <div
      ref={ref}
      className="h-[440px] w-full md:h-[560px]"
      aria-label="Carte des valeurs locatives Paris par arrondissement"
      role="region"
    />
  )
}
