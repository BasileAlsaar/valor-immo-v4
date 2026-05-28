import type { Metadata } from "next"
import Image from "next/image"

import { PageHero } from "@/components/sections/page-hero"
import { Container } from "@/components/ui/container"
import { Eyebrow } from "@/components/ui/eyebrow"
import { CallbackSection } from "@/components/sections/callback-section"
import { RevealStagger, RevealItem } from "@/components/motion/reveal"
import { signatures } from "@/lib/data/signatures"
import { cn } from "@/lib/utils"

export const metadata: Metadata = {
  title: "Signatures",
  description:
    "Sélection de signatures récentes Valor Immo : baux commerciaux, cessions de fonds, acquisitions tertiaires sur Paris.",
}

export default function SignaturesPage() {
  return (
    <>
      <PageHero
        eyebrow="Signatures"
        title={
          <>
            Cinq signatures<br /><span className="text-gold">qui parlent pour nous.</span>
          </>
        }
        subtitle="Sélection anonymisée d'opérations récentes — baux flagship, cessions de fonds, acquisitions tertiaires. Conditions confidentielles par défaut, descriptifs validés avec nos clients."
        backgroundImage="/images/categories/locaux-commerciaux.jpg"
      />

      <section className="py-24 md:py-32">
        <Container>
          <RevealStagger className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
            {signatures.map((sig, i) => (
              <RevealItem key={sig.ref}>
                <article className="group h-full overflow-hidden rounded-2xl bg-white shadow-[0_8px_28px_-12px_rgba(15,61,46,0.18)] transition hover:-translate-y-1">
                  <div className="relative aspect-[4/3] overflow-hidden bg-fir-dark">
                    <Image
                      src={`/images/signatures/sig-${i + 1}.jpg`}
                      alt=""
                      fill
                      sizes="(min-width: 1280px) 33vw, (min-width: 768px) 50vw, 100vw"
                      className="object-cover transition duration-700 ease-out-expo group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-fir-darker/80 to-transparent" />
                    <span className={cn(
                      "absolute left-4 top-4 rounded-full px-3 py-1 text-xs font-medium uppercase tracking-wider",
                      sig.badge === "TRANSACTION" && "bg-gold text-ink",
                      sig.badge === "LOCATION" && "bg-white text-fir-dark",
                      sig.badge === "CESSION" && "bg-fir-darker text-gold",
                    )}>{sig.badge}</span>
                    <div className="absolute inset-x-0 bottom-0 p-5 text-white">
                      <p className="font-display text-2xl uppercase leading-tight tracking-tight">
                        {sig.descripteur}
                      </p>
                      <p className="mt-1 text-xs uppercase tracking-wider opacity-80">
                        {sig.quartier} · {sig.surface} m² · {sig.dateDisplay}
                      </p>
                    </div>
                  </div>
                  <div className="p-6">
                    <p className="eyebrow text-gold-deep">{sig.type}</p>
                    <p className="mt-4 text-sm leading-relaxed text-ink/80">
                      <strong className="text-fir-dark">Contexte —</strong> {sig.contexte}
                    </p>
                    <p className="mt-3 text-sm leading-relaxed text-ink/80">
                      <strong className="text-fir-dark">Réalisation —</strong> {sig.realisation}
                    </p>
                  </div>
                </article>
              </RevealItem>
            ))}
          </RevealStagger>
        </Container>
      </section>

      <CallbackSection />
    </>
  )
}
