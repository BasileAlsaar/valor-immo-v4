"use client"

import { useEffect, useState, useCallback } from "react"
import Image from "next/image"
import { AnimatePresence, motion } from "framer-motion"
import { ChevronLeft, ChevronRight, Maximize2, X } from "lucide-react"

import { duration, easing } from "@/lib/motion"
import { cn } from "@/lib/utils"

type ImageItem = { src: string; alt: string }

type Props = {
  images: ImageItem[]
  aspectRatio?: "4/3" | "16/9" | "4/5"
  className?: string
}

const ASPECT: Record<NonNullable<Props["aspectRatio"]>, string> = {
  "4/3": "aspect-[4/3]",
  "16/9": "aspect-[16/9]",
  "4/5": "aspect-[4/5]",
}

/** Galerie 2 colonnes (principale + thumbnails) + lightbox plein écran custom. */
export function Gallery({ images, aspectRatio = "4/3", className }: Props) {
  const [mainIndex, setMainIndex] = useState(0)
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)
  const total = images.length

  const closeLightbox = useCallback(() => setLightboxIndex(null), [])
  const prev = useCallback(
    () => setLightboxIndex((i) => (i === null ? null : (i - 1 + total) % total)),
    [total],
  )
  const next = useCallback(
    () => setLightboxIndex((i) => (i === null ? null : (i + 1) % total)),
    [total],
  )

  useEffect(() => {
    if (lightboxIndex === null) return
    document.body.style.overflow = "hidden"
    return () => {
      document.body.style.overflow = ""
    }
  }, [lightboxIndex])

  useEffect(() => {
    if (lightboxIndex === null) return
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") closeLightbox()
      if (e.key === "ArrowLeft") prev()
      if (e.key === "ArrowRight") next()
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [lightboxIndex, closeLightbox, prev, next])

  if (total === 0) return null

  return (
    <>
      <div data-testid="opportunity-gallery" className={cn("w-full", className)}>
        <div className="grid h-[50vh] gap-3 md:h-[60vh] md:grid-cols-[2fr_1fr]">
          {/* Image principale */}
          <button
            type="button"
            onClick={() => setLightboxIndex(mainIndex)}
            aria-label="Ouvrir la galerie en plein écran"
            className={cn(
              "group relative overflow-hidden rounded-2xl bg-fir-dark",
              total === 1 && "md:col-span-1",
            )}
          >
            <Image
              src={images[mainIndex]!.src}
              alt={images[mainIndex]!.alt}
              fill
              sizes="(min-width: 768px) 66vw, 100vw"
              className="object-cover transition duration-700 ease-out group-hover:scale-[1.02]"
            />
            <span
              aria-hidden
              className="absolute right-4 top-4 inline-flex h-9 w-9 items-center justify-center rounded-full bg-fir-darker/80 text-cream opacity-0 backdrop-blur-sm transition group-hover:opacity-100"
            >
              <Maximize2 className="h-4 w-4" />
            </span>
          </button>

          {/* Thumbnails (colonne droite desktop, stack horizontal mobile) */}
          {total > 1 && (
            <div className="grid grid-cols-3 gap-3 md:grid-cols-1">
              {images.map((img, i) => {
                if (i === mainIndex) return null
                return (
                  <button
                    type="button"
                    key={img.src}
                    onClick={() => setMainIndex(i)}
                    aria-label={`Afficher ${img.alt}`}
                    className={cn(
                      "relative overflow-hidden rounded-xl bg-fir-dark transition hover:ring-2 hover:ring-gold",
                      ASPECT[aspectRatio],
                    )}
                  >
                    <Image
                      src={img.src}
                      alt={img.alt}
                      fill
                      sizes="(min-width: 768px) 33vw, 33vw"
                      className="object-cover"
                    />
                  </button>
                )
              })}
            </div>
          )}
        </div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxIndex !== null && (
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Galerie plein écran"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: easing.smooth }}
            className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-sm"
            onClick={closeLightbox}
          >
            <button
              type="button"
              onClick={closeLightbox}
              aria-label="Fermer la galerie"
              className="absolute right-6 top-6 z-10 inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/20 text-white transition hover:border-gold hover:text-gold"
            >
              <X className="h-5 w-5" />
            </button>

            {total > 1 && (
              <>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    prev()
                  }}
                  aria-label="Image précédente"
                  className="absolute left-6 top-1/2 z-10 inline-flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 text-white transition hover:border-gold hover:text-gold"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    next()
                  }}
                  aria-label="Image suivante"
                  className="absolute right-6 top-1/2 z-10 inline-flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 text-white transition hover:border-gold hover:text-gold"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </>
            )}

            <motion.div
              key={lightboxIndex}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: duration.fast, ease: easing.smooth }}
              className="relative flex h-full w-full items-center justify-center p-12"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative h-full w-full max-w-6xl">
                <Image
                  src={images[lightboxIndex]!.src}
                  alt={images[lightboxIndex]!.alt}
                  fill
                  sizes="100vw"
                  className="object-contain"
                />
              </div>
            </motion.div>

            {total > 1 && (
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 rounded-full bg-white/10 px-4 py-1.5 text-xs text-white/80 backdrop-blur-sm">
                {lightboxIndex + 1} / {total}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
