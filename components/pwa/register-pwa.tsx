"use client"

import { useEffect } from "react"

/**
 * Enregistrement du Service Worker généré par @serwist/next.
 * - Différé en `requestIdleCallback` pour ne pas concurrencer le LCP.
 * - Désactivé en dev car next.config.ts force `disable: true` côté Serwist.
 *   Le `window.serwist` est alors `undefined`, ce composant ne fait rien.
 */
type SerwistWindow = { register: () => Promise<unknown> }

declare global {
  interface Window {
    serwist?: SerwistWindow
  }
}

export function RegisterPWA() {
  useEffect(() => {
    if (typeof window === "undefined") return
    if (!("serviceWorker" in navigator)) return
    if (typeof window.serwist === "undefined") return

    const register = () => {
      window.serwist?.register().catch(() => {
        /* registration errors silenced — pas bloquant */
      })
    }

    if (typeof window.requestIdleCallback === "function") {
      window.requestIdleCallback(register)
    } else {
      setTimeout(register, 1500)
    }
  }, [])

  return null
}
