"use client"

import { useSyncExternalStore } from "react"

/**
 * Store minimal pour piloter le SiteHeader depuis un composant éloigné
 * (`SuccessScreen` masque la nav le temps de l'écran de confirmation).
 *
 * `default` : header normal (logo + nav + CTA + tel).
 * `minimal` : logo seul, centré. Tout le reste est masqué.
 */
export type HeaderMode = "default" | "minimal"

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
