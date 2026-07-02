"use client"

import { useEffect } from "react"

import { setHeaderMode } from "@/lib/header-mode"

/**
 * Force le `SiteHeader` en mode `light` (variante cream + logo vert +
 * texte ink) pour la durée du montage du composant. Utilisé sur les
 * pages qui n'ont pas de hero sombre en tête — sans ça, le rendu
 * transparent + logo blanc-inversé serait invisible sur cream.
 *
 * S'appuie sur le même store minimal que `SuccessScreen`.
 */
export function SetHeaderLight() {
  useEffect(() => {
    setHeaderMode("light")
    return () => setHeaderMode("default")
  }, [])
  return null
}
