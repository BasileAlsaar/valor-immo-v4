import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft } from "lucide-react"

import { Container } from "@/components/ui/container"
import { Eyebrow } from "@/components/ui/eyebrow"
import { CallbackSection } from "@/components/sections/callback-section"
import { articles } from "@/lib/data/articles"

type Params = { params: Promise<{ slug: string }> }

export async function generateStaticParams() {
  return articles.map((a) => ({ slug: a.slug }))
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params
  const a = articles.find((x) => x.slug === slug)
  if (!a) return { title: "Article introuvable" }
  return {
    title: a.title,
    description: a.excerpt,
  }
}

export default async function ArticlePage({ params }: Params) {
  const { slug } = await params
  const a = articles.find((x) => x.slug === slug)
  if (!a) notFound()

  return (
    <>
      <section className="relative isolate bg-fir-dark pt-40 pb-16 text-white">
        <div
          className="absolute inset-0 -z-20 bg-cover bg-center"
          style={{ backgroundImage: `url(/images/articles/${a.slug}.jpg)` }}
          aria-hidden
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-fir-dark/55 via-fir-dark/70 to-fir-darker/95" />
        <Container>
          <Link
            href="/actualites"
            className="inline-flex items-center gap-2 text-xs uppercase tracking-wider text-gold hover:text-white"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Retour aux actualités
          </Link>
          <Eyebrow className="mt-8 block text-gold">
            {a.dateDisplay} · {a.readingTimeMin} min · {a.author}
          </Eyebrow>
          <h1 className="font-display mt-6 max-w-5xl text-[clamp(2rem,6vw,5rem)] uppercase leading-[0.95] tracking-tight">
            {a.title}
          </h1>
          <p className="mt-8 max-w-3xl text-lg leading-relaxed opacity-90">{a.excerpt}</p>
        </Container>
      </section>

      <article className="bg-cream py-24 md:py-32">
        <Container>
          <div className="mx-auto max-w-3xl">
            <div className="prose-editorial">
              {a.body.map((block, i) => {
                if (block.kind === "p") {
                  return <p key={i}>{block.text}</p>
                }
                return (
                  <blockquote
                    key={i}
                    className="my-12 border-l-4 border-gold pl-6"
                  >
                    <p className="font-display text-[clamp(1.5rem,3vw,2.5rem)] uppercase leading-tight tracking-tight text-fir-dark">
                      « {block.text} »
                    </p>
                    <footer className="mt-4 text-xs uppercase tracking-wider text-gold-deep">
                      — {block.attribution}
                    </footer>
                  </blockquote>
                )
              })}
            </div>
          </div>
        </Container>
      </article>

      <CallbackSection />
    </>
  )
}
