"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"

import { cn } from "@/lib/utils"

const schema = z.object({
  name: z.string().min(2, "Renseignez votre nom"),
  email: z.string().email("Email invalide"),
  phone: z.string().optional(),
  subject: z.enum(["vente", "location", "estimation", "autre"]),
  message: z.string().min(10, "Décrivez votre projet en quelques mots"),
  // Honeypot
  hp: z.string().max(0).optional(),
})

type Values = z.infer<typeof schema>

export function ContactForm({ className }: { className?: string }) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: { subject: "vente" },
  })
  const [status, setStatus] = useState<null | "ok" | "err">(null)

  async function onSubmit(values: Values) {
    setStatus(null)
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      })
      if (!res.ok) throw new Error("Échec de l'envoi")
      setStatus("ok")
      reset()
    } catch {
      setStatus("err")
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className={cn("space-y-6", className)}>
      <input type="text" tabIndex={-1} autoComplete="off" className="hidden" {...register("hp")} />

      <div className="grid gap-6 md:grid-cols-2">
        <Field label="Nom complet *" error={errors.name?.message}>
          <input
            type="text"
            {...register("name")}
            className="mt-2 w-full border-0 border-b-2 border-ink/15 bg-transparent px-0 pb-2 text-base focus:border-gold focus:outline-none"
          />
        </Field>
        <Field label="Email *" error={errors.email?.message}>
          <input
            type="email"
            {...register("email")}
            className="mt-2 w-full border-0 border-b-2 border-ink/15 bg-transparent px-0 pb-2 text-base focus:border-gold focus:outline-none"
          />
        </Field>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Field label="Téléphone" error={errors.phone?.message}>
          <input
            type="tel"
            {...register("phone")}
            className="mt-2 w-full border-0 border-b-2 border-ink/15 bg-transparent px-0 pb-2 text-base focus:border-gold focus:outline-none"
          />
        </Field>
        <Field label="Sujet *" error={errors.subject?.message}>
          <select
            {...register("subject")}
            className="mt-2 w-full border-0 border-b-2 border-ink/15 bg-transparent px-0 pb-2 text-base focus:border-gold focus:outline-none"
          >
            <option value="vente">Acquisition / Vente</option>
            <option value="location">Location</option>
            <option value="estimation">Estimation</option>
            <option value="autre">Autre</option>
          </select>
        </Field>
      </div>

      <Field label="Votre projet *" error={errors.message?.message}>
        <textarea
          rows={5}
          {...register("message")}
          placeholder="Surface souhaitée, emplacement, activité, budget, échéance…"
          className="mt-2 w-full resize-none border-0 border-b-2 border-ink/15 bg-transparent px-0 pb-2 text-base focus:border-gold focus:outline-none"
        />
      </Field>

      <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
        <p className="max-w-md text-xs leading-relaxed text-ink/50">
          Vos données sont traitées pour répondre à votre demande uniquement.
          Voir notre <a href="/politique-de-confidentialite" className="underline">politique de confidentialité</a>.
        </p>
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex items-center justify-center rounded-full bg-fir-dark px-10 py-3.5 text-sm font-medium uppercase tracking-wider text-white transition hover:bg-ink disabled:opacity-50"
        >
          {isSubmitting ? "Envoi en cours…" : "Envoyer"}
        </button>
      </div>

      {status === "ok" && (
        <p className="rounded-xl bg-gold/15 px-4 py-3 text-sm text-fir-dark">
          Merci. Nous vous recontactons sous 24h ouvrées.
        </p>
      )}
      {status === "err" && (
        <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
          Une erreur est survenue. Merci d'essayer à nouveau ou de nous appeler directement.
        </p>
      )}
    </form>
  )
}

function Field({
  label,
  error,
  children,
}: {
  label: string
  error?: string
  children: React.ReactNode
}) {
  return (
    <label className="block">
      <span className="eyebrow text-ink/60">{label}</span>
      {children}
      {error && <span className="mt-2 block text-xs text-red-600">{error}</span>}
    </label>
  )
}
