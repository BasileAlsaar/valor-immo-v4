"use client"

import { useSyncExternalStore } from "react"

/**
 * Store minimal pour piloter le SiteHeader depuis un composant éloigné
 * (`SuccessScreen` masque la nav le temps de l'écran de confirmation ;
 * les fiches détail Apimo forcent le rendu clair car il n'y a pas de
 * hero sombre pour porter le logo blanc-inversé).
 *
 * `default` : header normal — variante blanche/transparente en haut de
 *   page, bascule en variante claire (cream + logo vert + texte ink) au
 *   scroll > 60 px.
 * `minimal` : logo seul, centré. Tout le reste est masqué.
 * `light`   : variante claire FORCÉE indépendamment du scroll (cream +
 *   logo vert + texte ink). Utilisée quand la page n'a pas de hero
 *   sombre — sans ça, le logo apparaîtrait blanc sur cream.
 */
export type HeaderMode = "default" | "minimal" | "light"

let currentMode: HeaderMode = "default"
const listeners = new Set<() => void>()

function notify() {
  for (const listener of listeners) listener()
}

function subscribe(listener: () => void) {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}

function getSnapshot(): HeaderMode {
  return currentMode
}

function getServerSnapshot(): HeaderMode {
  return "default"
}

export function useHeaderMode(): HeaderMode {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
}

export function setHeaderMode(next: HeaderMode): void {
  if (currentMode === next) return
  currentMode = next
  notify()
}
