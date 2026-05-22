"use client"

import Link from "next/link"
import { useRef } from "react"
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion"
import { Phone, ChevronDown } from "lucide-react"

import { Container } from "@/components/ui/container"
import { CtaPill } from "@/components/ui/cta-pill"
import { SearchBar } from "@/components/home/search-bar"
import { HeroLogo } from "@/components/home/hero-logo"
import { CallbackTrigger } from "@/components/callback/CallbackTrigger"
import { SITE } from "@/lib/site"
import {
  duration,
  easing,
  fadeUp,
  splitTextReveal,
  stagger,
} from "@/lib/motion"

const H1_WORDS_WHITE = ["Votre", "projet", "commercial"]
const H1_WORDS_GOLD = ["mérite", "l'emplacement", "parfait."]
// Délai 200 ms après mount avant que le split-text démarre — cf. brief sprint 1 ❻.1
const SPLIT_DELAY = 0.2

export function Hero() {
  const reduce = useReducedMotion()
  const sectionRef = useRef<HTMLElement>(null)
  const { scrollY } = useScroll()
  // Parallax léger : translate-y de 0 à -8 % sur les 100 premiers vh.
  // Sur SSR `window` est indéfini : on borne via `useTransform` qui lit la
  // valeur de scrollY au runtime côté client.
  const videoY = useTransform(scrollY, [0, 1000], ["0%", "-8%"])

  return (
    <section
      ref={sectionRef}
      className="relative isolate flex min-h-screen flex-col overflow-hidden bg-fir-darker"
    >
      <motion.div
        style={reduce ? undefined : { y: videoY }}
        className="absolute inset-0 -z-20 h-[108%] w-full"
        aria-hidden
      >
        <video
          autoPlay
          muted
          loop
          playsInline
          poster="/hero-poster.jpg"
          className="hero-video"
          aria-hidden="true"
        >
          <source src="/hero-paris.webm" type="video/webm" />
          <source src="/hero-paris.mp4" type="video/mp4" />
        </video>
      </motion.div>
      {/* Logo XL surimposé — sprint 5a (le SiteHeader masque son logo sur '/') */}
      <HeroLogo />

      {/* Overlay vert sapin Valor Immo — opacité ajustable pour contraste AA sur H1 */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-fir-dark/60 via-fir-dark/55 to-fir-dark/85" aria-hidden />

      <Container className="relative flex flex-1 flex-col justify-center pt-20 pb-6 text-white">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={stagger(0.08)}
          transition={{ delayChildren: SPLIT_DELAY }}
          className="max-w-4xl"
        >
          <motion.p
            variants={fadeUp}
            transition={{ duration: duration.base, ease: easing.smooth }}
            className="eyebrow text-gold"
          >
            Valor Immo · Immobilier commercial · Paris
          </motion.p>

          <h1
            aria-label="Votre projet commercial mérite l'emplacement parfait."
            className="font-display mt-3 text-[clamp(2rem,5.5vw,6rem)] uppercase leading-[0.95] tracking-tight"
          >
            <SplitWords words={H1_WORDS_WHITE} reduce={reduce ?? false} />
            <span className="text-gold">
              {" "}
              <SplitWords words={H1_WORDS_GOLD} reduce={reduce ?? false} startIndex={H1_WORDS_WHITE.length} />
            </span>
          </h1>

          <motion.p
            variants={fadeUp}
            transition={{ duration: duration.base, ease: easing.smooth, delay: 0.4 }}
            className="mt-5 max-w-xl text-sm leading-relaxed opacity-90 md:text-base"
          >
            Transaction · Location · Gestion sur boutiques, immeubles, bureaux et hôtellerie. Une équipe parisienne, un interlocuteur, pas de relais.
          </motion.p>
        </motion.div>

        <motion.div
          initial={reduce ? false : "hidden"}
          animate="visible"
          variants={fadeUp}
          transition={{ duration: duration.base, ease: easing.smooth, delay: SPLIT_DELAY + 0.6 }}
          className="mt-6"
        >
          <SearchBar />
        </motion.div>

        <motion.div
          initial={reduce ? false : "hidden"}
          animate="visible"
          variants={fadeUp}
          transition={{ duration: duration.base, ease: easing.smooth, delay: SPLIT_DELAY + 0.8 }}
          className="mt-5 flex flex-wrap items-center gap-4"
        >
          <CallbackTrigger variant="outline-white" size="lg">
            Être rappelé gratuitement
          </CallbackTrigger>
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

      {/* Indicateur de scroll — flèche pulsation infinie subtile */}
      <motion.div
        aria-hidden
        initial={reduce ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: SPLIT_DELAY + 1.2, duration: duration.base }}
        className="pointer-events-none relative z-10 mx-auto mb-6 hidden md:block"
      >
        <motion.div
          animate={reduce ? undefined : { y: [0, 8, 0] }}
          transition={{ duration: 2, ease: easing.inOut, repeat: Infinity }}
          className="flex flex-col items-center gap-2 text-gold/70"
        >
          <span className="text-[10px] uppercase tracking-[0.3em]">Scroll</span>
          <ChevronDown className="h-4 w-4" strokeWidth={1.5} />
        </motion.div>
      </motion.div>
    </section>
  )
}

function SplitWords({
  words,
  reduce,
  startIndex = 0,
}: {
  words: string[]
  reduce: boolean
  startIndex?: number
}) {
  if (reduce) {
    return <>{words.join(" ")}</>
  }
  return (
    <>
      {words.map((w, i) => (
        <span
          key={`${startIndex + i}-${w}`}
          className="inline-block overflow-hidden align-bottom pr-[0.18em] last:pr-0"
        >
          <motion.span variants={splitTextReveal} className="inline-block">
            {w}
          </motion.span>
        </span>
      ))}
    </>
  )
}
