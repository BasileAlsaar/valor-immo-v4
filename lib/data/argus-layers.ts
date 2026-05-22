/**
 * Configurations des layers MapLibre pour la section ARGUS enrichie.
 * Centralisées ici pour rester découplées du composant carte.
 *
 * Palette : ivoire `#F5F2EC` (palier 1), gradient vers vert très foncé
 * `#0A2D22` (palier 6) sur l'axe `prix_commerce`. Outline or `#C9A961`.
 */

import type { FillLayerSpecification, LineLayerSpecification, HeatmapLayerSpecification, CircleLayerSpecification } from "maplibre-gl"

/** 6 paliers brief §141-146, interpolation linéaire sur `prix_commerce`. */
export const CHOROPLETH_FILL_PAINT: FillLayerSpecification["paint"] = {
  "fill-color": [
    "interpolate",
    ["linear"],
    ["get", "prix_commerce"],
    0, "#F5F2EC",
    1000, "#E0DCC4",
    1500, "#A8B59C",
    2000, "#5F7A5E",
    3000, "#2D4A3D",
    5000, "#0A2D22",
  ],
  "fill-opacity": [
    "case",
    ["boolean", ["feature-state", "hover"], false],
    0.75,
    0.55,
  ],
}

/** Outline or fin (0.5px, opacity 0.6) — brief §148. */
export const CHOROPLETH_LINE_PAINT: LineLayerSpecification["paint"] = {
  "line-color": "#C9A961",
  "line-width": 0.5,
  "line-opacity": 0.6,
}

/** Heatmap or-vers-vert profond, intensity et radius interpolés au zoom. */
export const HEATMAP_PAINT: HeatmapLayerSpecification["paint"] = {
  "heatmap-intensity": [
    "interpolate",
    ["linear"],
    ["zoom"],
    9, 1,
    15, 3,
  ],
  "heatmap-color": [
    "interpolate",
    ["linear"],
    ["heatmap-density"],
    0, "rgba(0,0,0,0)",
    0.2, "rgba(201,169,97,0.3)",
    0.5, "rgba(201,169,97,0.6)",
    1, "rgba(15,61,46,0.8)",
  ],
  "heatmap-radius": [
    "interpolate",
    ["linear"],
    ["zoom"],
    9, 8,
    15, 30,
  ],
  "heatmap-opacity": [
    "interpolate",
    ["linear"],
    ["zoom"],
    9, 0.7,
    14, 0.7,
    15, 0,
  ],
}

/** Points individuels visibles au-delà du zoom 14. */
export const POINTS_CIRCLE_PAINT: CircleLayerSpecification["paint"] = {
  "circle-radius": [
    "interpolate",
    ["linear"],
    ["zoom"],
    13, 0,
    14, 2,
    16, 4,
  ],
  "circle-color": "#C9A961",
  "circle-opacity": [
    "interpolate",
    ["linear"],
    ["zoom"],
    13, 0,
    14.5, 0.6,
    16, 0.8,
  ],
  "circle-stroke-color": "#0F3D2E",
  "circle-stroke-width": 0.5,
}
