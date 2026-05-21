"use client"

import Link from "next/link"
import { motion, useReducedMotion } from "framer-motion"
import { Phone, Search } from "lucide-react"

import { Container } from "@/components/ui/container"
import { CtaPill } from "@/components/ui/cta-pill"
import { SearchBar } from "@/components/home/search-bar"
import { SITE } from "@/lib/site"

export function Hero() {
  const reduce = useReducedMotion()

  return (
    <section className="relative isolate flex min-h-screen flex-col overflow-hidden bg-fir-darker">
      {/* Background — photo Pexels boutique/commerce parisien.
          Vidéo MP4/WebM à ajouter dans /public/videos/ pour activer l'autoplay
          (cf. CONTENT_TODO.md — Vidéo hero Pexels). */}
      <div
        className="absolute inset-0 -z-20 h-full w-full bg-cover bg-center"
        style={{ backgroundImage: "url(/videos/hero-paris-commerce-poster.jpg)" }}
        aria-hidden
      />
      {/* Overlay vert sapin Valor Immo (identité) */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-fir-dark/60 via-fir-dark/55 to-fir-dark/85" aria-hidden />

      <Container className="relative flex flex-1 flex-col justify-center pt-40 pb-12 text-white">
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-5xl"
        >
          <p className="eyebrow text-gold">
            Valor Immo · Immobilier commercial · Paris
          </p>
          <h1 className="font-display mt-6 text-[clamp(3rem,11vw,12rem)] uppercase leading-[0.88] tracking-tight">
            Votre projet commercial<br />
            <span className="text-gold">mérite l'emplacement parfait.</span>
          </h1>
          <p className="mt-8 max-w-2xl text-lg leading-relaxed opacity-90 md:text-xl">
            Transaction · Location · Gestion sur boutiques, immeubles, bureaux et hôtellerie. Une équipe parisienne, un interlocuteur, pas de relais.
          </p>
        </motion.div>

        <motion.div
          initial={reduce ? false : { opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="mt-12 lg:mt-16"
        >
          <SearchBar />
        </motion.div>

        <motion.div
          initial={reduce ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="mt-10 flex flex-wrap items-center gap-4"
        >
          <CtaPill href="/contact" variant="outline-white" size="lg">
            Être rappelé gratuitement
          </CtaPill>
          <CtaPill href="/opportunites" variant="gold" size="lg">
            Voir les opportunités
          </CtaPill>
          <Link
            href={`tel:${SITE.telephoneTel}`}
            className="ml-2 inline-flex items-center gap-2 text-sm tracking-wider opacity-80 hover:text-gold hover:opacity-100"
          >
            <Phone className="h-4 w-4" /> {SITE.telephoneDisplay}
          </Link>
        </motion.div>
      </Container>

      {/* Scroll cue */}
      <div className="relative z-10 mx-auto mb-6 hidden h-12 w-px bg-gradient-to-b from-transparent via-gold/40 to-transparent md:block" aria-hidden />
    </section>
  )
}
