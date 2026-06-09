"use client"

import { useEffect } from "react"

/**
 * Scroll automatique vers la section #resultats, déclenché UNIQUEMENT au
 * montage du composant. Si `active === false` (arrivée directe sur la page
 * sans paramètre de recherche), no-op.
 *
 * `useEffect` avec dépendance vide → ne se rejoue pas quand l'utilisateur
 * clique une chip dans OpportunitiesFilters (qui met à jour l'URL via
 * router.push sans remonter ce composant). SSR-safe : useEffect ne tourne
 * jamais côté server.
 */
export function ScrollToResultsOnMount({ active }: { active: boolean }) {
  useEffect(() => {
    if (!active) return
    const el = document.getElementById("resultats")
    if (!el) return
    // rAF pour s'assurer que le layout est posé avant de scroller.
    requestAnimationFrame(() => {
      el.scrollIntoView({ behavior: "smooth", block: "start" })
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  return null
}
