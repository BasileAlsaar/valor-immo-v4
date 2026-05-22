# HERO_VIDEO_CANDIDATES — Sprint 1 Valor Immo

**Statut :** ✅ **Candidat 1 retenu et intégré.** Boulevard Saint-Germain — Pexels ID 13648261 — auteur Judas Isariot.

---

## Candidat retenu — *Traffic Passing by the Boulevard Saint-Germain*

- **URL Pexels** : https://www.pexels.com/video/traffic-passing-by-the-boulevard-saint-germain-13648261/
- **ID** : 13648261
- **Auteur** : Judas Isariot (mention footer site activée — licence Pexels)
- **Source téléchargée** : `public/hero-paris-source.mp4` (3840×2160, 50 fps, 24.7 Mo, H.264, audio AAC à strip)

### Specs vidéos après transcodage (vérifiées `ffprobe`)

| Fichier | Taille | Durée | Résolution | Codec | Audio |
|---|---|---|---|---|---|
| `public/hero-paris.mp4` | 6.7 Mo | 13.93 s | 1920×1080 | H.264 High (CRF 26, preset slow, faststart) | strippé |
| `public/hero-paris.webm` | 4.4 Mo | 13.93 s | 1920×1080 | VP9 (2 Mbps target, row-mt) | strippé |
| `public/hero-poster.jpg` | 606 Ko | — | extrait à 2 s | JPEG q:v 2 | — |

### Conformité aux critères du brief

- Sujet « façades haussmanniennes parisiennes / boulevards / devantures de commerces » : ✓ Boulevard Saint-Germain, axe commerçant Paris 6ᵉ.
- Aucun signe étranger : à confirmer par revue visuelle à l'écran après lancement du dev server (frame-par-frame possible via `ffmpeg -vf fps=1` si doute).
- Durée 12-20 s : ✓ 13.93 s (pas de trim nécessaire, confirmé par Basile au brief).
- Résolution ≥ 1920×1080 paysage : ✓ exactement 1920×1080.
- Audio muted : ✓ piste audio strippée à l'encodage (`-an`).
- Format MP4 H.264 + WebM fallback ≤ 8 Mo : ✓ 6.7 Mo et 4.4 Mo respectivement. Première passe MP4 à CRF 23 = 11 Mo dépassait ; ré-encodage CRF 26 conforme.

### Pipeline FFmpeg exécuté

```bash
# Étape 1 — MP4 H.264 (réencodage CRF 26 après dépassement initial)
ffmpeg -y -i public/hero-paris-source.mp4 \
  -vf "scale=1920:1080:flags=lanczos,fps=30" \
  -c:v libx264 -crf 26 -preset slow -profile:v high \
  -pix_fmt yuv420p -movflags +faststart -an \
  public/hero-paris.mp4

# Étape 2 — WebM VP9
ffmpeg -y -i public/hero-paris-source.mp4 \
  -vf "scale=1920:1080:flags=lanczos,fps=30" \
  -c:v libvpx-vp9 -b:v 2M -minrate 1M -maxrate 4M -row-mt 1 -an \
  public/hero-paris.webm

# Étape 3 — Poster
ffmpeg -y -i public/hero-paris.mp4 -ss 00:00:02 -vframes 1 -q:v 2 public/hero-poster.jpg
```

### Mention auteur

Le footer du site inclut désormais : *« Vidéo hero : Judas Isariot via Pexels »* (composant `components/site/site-footer.tsx`).

### Intégration dans le composant Hero

`components/home/hero.tsx` — balise `<video>` strict-conforme au brief (autoplay, muted, loop, playsInline, poster, aria-hidden), classe `hero-video` définie dans `app/globals.css` sous `@layer components` (positionnement absolu, full-bleed, object-cover, z-index -20 pour passer derrière l'overlay vert sapin existant et le contenu).

### Note

Aucun fichier `public/hero-placeholder.mp4` créé en amont — j'ai attendu la validation du candidat plutôt que de générer un placeholder FFmpeg solid color. Le commentaire JSX `{/* TODO sprint-1-asset: ... */}` prévu par le brief n'a donc jamais été inséré, et il n'y a rien à retirer.

---

## Non retenus

### Candidat 2 — *Vibrant street market in Paris (Rue Cler)*

- URL : https://www.pexels.com/video/a-street-with-many-people-walking-down-it-19538311/
- ID : 19538311 — Auteur : kelly
- Tags Pexels : Paris, Rue Cler, Haussmannian Architecture.
- Description : *« vibrant street market in Paris with bustling crowds and shops »*.
- Raison écartement : risque touristes/enseignes lisibles dans une rue-marché, sans contrôle frame-par-frame préalable. Saint-Germain offrait un sujet plus net pour un positionnement commercial premium.

### Candidat 3 — *Rain-soaked Paris street scene with iconic Metro sign*

- URL : https://www.pexels.com/video/paris-20494368/
- ID : 20494368 — Auteur : Karography
- Description : *« Rain-soaked Paris street scene with iconic Metro sign and people walking »*.
- Raison écartement : esthétique mélancolique « pluie + ambiance cinématographique » trop émotionnelle pour le positionnement commerce premium. Saint-Germain neutre et lumineux mieux aligné.
