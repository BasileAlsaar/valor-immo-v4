"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence, useReducedMotion } from "framer-motion"
import { ChevronLeft, ChevronRight } from "lucide-react"

import { Container } from "@/components/ui/container"
import { Eyebrow } from "@/components/ui/eyebrow"
import { quotes } from "@/lib/data/quotes"

export function QuotesCarousel() {
  const reduce = useReducedMotion()
  const [index, setIndex] = useState(0)
  const total = quotes.length

  useEffect(() => {
    if (reduce) return
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % total)
    }, 7000)
    return () => clearInterval(id)
  }, [reduce, total])

  const q = quotes[index]

  return (
    <section className="relative flex min-h-[60vh] items-center overflow-hidden bg-fir-dark py-24 text-white md:py-28 lg:py-32">
      <Container className="relative text-center">
        <Eyebrow className="text-gold">Ils nous ont confié leur projet</Eyebrow>

        <div className="relative mx-auto mt-10 max-w-3xl">
          {/* Guillemets décoratifs or */}
          <span
            aria-hidden
            className="font-display absolute -top-12 left-0 select-none text-[7rem] leading-none text-gold/30 md:-top-16 md:text-[10rem]"
          >
            «
          </span>
          <span
            aria-hidden
            className="font-display absolute -bottom-16 right-0 select-none text-[7rem] leading-none text-gold/30 md:-bottom-20 md:text-[10rem]"
          >
            »
          </span>

          <AnimatePresence mode="wait">
            <motion.blockquote
              key={q.id}
              initial={reduce ? false : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduce ? undefined : { opacity: 0, y: -16 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="relative z-10"
            >
              {/* leading-[1.35]! force-override : .font-display (globals.css hors layer) impose line-height:0.9, qui bat les utilities Tailwind v4 layered. Cf. PR fix(ui). */}
              <p className="font-display text-[clamp(1rem,1.25vw,1.5rem)] uppercase leading-[1.35]! tracking-[0.01em]">
                {q.text}
              </p>
              <footer className="mt-6">
                <p className="eyebrow text-gold">{q.attribution}</p>
              </footer>
            </motion.blockquote>
          </AnimatePresence>
        </div>

        <div className="mt-10 flex items-center justify-center gap-6">
          <button
            type="button"
            onClick={() => setIndex((i) => (i - 1 + total) % total)}
            aria-label="Citation précédente"
            className="rounded-full border border-white/20 p-3 transition hover:border-gold hover:text-gold"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <div className="flex gap-2">
            {quotes.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setIndex(i)}
                aria-label={`Citation ${i + 1}`}
                className={
                  "h-2 rounded-full transition-all " +
                  (i === index ? "w-8 bg-gold" : "w-2 bg-white/30 hover:bg-white/60")
                }
              />
            ))}
          </div>
          <button
            type="button"
            onClick={() => setIndex((i) => (i + 1) % total)}
            aria-label="Citation suivante"
            className="rounded-full border border-white/20 p-3 transition hover:border-gold hover:text-gold"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </Container>
    </section>
  )
}
