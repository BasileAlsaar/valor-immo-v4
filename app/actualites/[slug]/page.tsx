import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft } from "lucide-react"

import { PageHero } from "@/components/sections/page-hero"
import { Container } from "@/components/ui/container"
import { SectionTitle } from "@/components/ui/section-title"
import { CallbackSection } from "@/components/sections/callback-section"
import { ARTICLES, type Article } from "@/lib/data/articles"

type Params = { params: Promise<{ slug: string }> }

export async function generateStaticParams() {
  return ARTICLES.map((a) => ({ slug: a.slug }))
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params
  const a = ARTICLES.find((x) => x.slug === slug)
  if (!a) return { title: "Article introuvable" }
  return {
    title: a.titre,
    description: a.metaDescription,
    openGraph: {
      type: "article",
      title: a.titre,
      description: a.metaDescription,
      authors: [a.auteur],
    },
    alternates: { canonical: `/actualites/${a.slug}` },
  }
}

export default async function ArticlePage({ params }: Params) {
  const { slug } = await params
  const article = ARTICLES.find((x) => x.slug === slug)
  if (!article) notFound()

  return (
    <>
      <PageHero
        eyebrow="Actualités"
        title={article.titre}
        subtitle={`${article.datePublication} · ${article.auteur}`}
        backgroundImage="/images/categories/bureaux.jpg"
      />

      <section className="bg-cream-soft py-20 md:py-28">
        <Container>
          <article className="mx-auto max-w-3xl">
            <ArticleBody article={article} />
          </article>

          <div className="mx-auto mt-16 max-w-3xl border-t border-fir-dark/10 pt-8">
            <Link
              href="/actualites"
              className="inline-flex items-center gap-2 text-sm uppercase tracking-wider text-gold-deep transition-colors hover:text-fir-dark"
            >
              <ArrowLeft className="h-4 w-4" aria-hidden /> Toutes les analyses
            </Link>
          </div>
        </Container>
      </section>

      <CallbackSection />
    </>
  )
}

function ArticleBody({ article }: { article: Article }) {
  return (
    <div className="prose-editorial">
      <p>{article.chapo}</p>

      {article.sections.map((sec) => (
        <section key={sec.titre} className="mt-12">
          <SectionTitle as="h2" size="md">
            {sec.titre}
          </SectionTitle>
          <div aria-hidden className="mt-3 mb-6 h-px w-12 bg-gold/60" />
          {sec.paragraphes.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </section>
      ))}

      <section className="mt-16 rounded-2xl border border-fir-dark/10 bg-white p-6 md:p-8">
        <p className="eyebrow text-gold-deep">Sources</p>
        <ul className="mt-4 space-y-2 text-[15px] leading-[1.7] text-ink/75">
          {article.sources.map((src) => (
            <li key={src} className="flex gap-2">
              <span aria-hidden className="text-gold-deep">—</span>
              <span>{src}</span>
            </li>
          ))}
        </ul>
        {article.sourceNote && (
          <p className="mt-4 text-xs italic text-ink/55">{article.sourceNote}</p>
        )}
      </section>
    </div>
  )
}
