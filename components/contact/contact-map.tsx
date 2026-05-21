"use client"

import { useEffect, useRef } from "react"
import maplibregl, { type Map as MlMap } from "maplibre-gl"
import "maplibre-gl/dist/maplibre-gl.css"

import { SITE } from "@/lib/site"

export function ContactMap() {
  const ref = useRef<HTMLDivElement | null>(null)
  const mapRef = useRef<MlMap | null>(null)

  useEffect(() => {
    if (!ref.current || mapRef.current) return
    const map = new maplibregl.Map({
      container: ref.current,
      style: "https://basemaps.cartocdn.com/gl/positron-gl-style/style.json",
      center: [SITE.coords.lng, SITE.coords.lat],
      zoom: 15,
      attributionControl: false,
    })
    map.addControl(new maplibregl.AttributionControl({ compact: true }))
    map.addControl(new maplibregl.NavigationControl({ showCompass: false }), "top-right")

    const el = document.createElement("div")
    el.style.width = "24px"
    el.style.height = "24px"
    el.style.borderRadius = "9999px"
    el.style.background = "#C9A961"
    el.style.border = "3px solid #fff"
    el.style.boxShadow = "0 6px 18px rgba(15,61,46,0.35)"

    new maplibregl.Marker({ element: el })
      .setLngLat([SITE.coords.lng, SITE.coords.lat])
      .setPopup(
        new maplibregl.Popup({ offset: 18, closeButton: false }).setHTML(
          `<div style="font-family:var(--font-inter);">
            <div style="font-weight:600;color:#0F3D2E;">${SITE.name}</div>
            <div style="margin-top:2px;font-size:12px;color:#5B6573;">${SITE.address.line1}<br/>${SITE.address.line2}</div>
          </div>`,
        ),
      )
      .addTo(map)

    mapRef.current = map
    return () => {
      map.remove()
      mapRef.current = null
    }
  }, [])

  return (
    <div
      ref={ref}
      className="h-[360px] w-full"
      aria-label="Carte de l'agence Valor Immo"
      role="region"
    />
  )
}
