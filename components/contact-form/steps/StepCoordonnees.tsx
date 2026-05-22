"use client"

import { useFormContext } from "react-hook-form"
import Link from "next/link"

import {
  SOURCES,
  LABELS,
  type ContactFormValues,
} from "@/lib/validations/contact"

export function StepCoordonnees() {
  const {
    register,
    formState: { errors },
    watch,
  } = useFormContext<ContactFormValues>()

  const message = watch("message") ?? ""

  return (
    <div className="space-y-8">
      <div className="grid gap-6 sm:grid-cols-2">
        <Field label="Nom complet *" error={errors.nom?.message}>
          <input
            type="text"
            autoComplete="name"
            {...register("nom")}
            className="mt-2 w-full border-0 border-b-2 border-ink/15 bg-transparent px-0 pb-2 text-base text-fir-dark focus:border-gold focus:outline-none focus:ring-0"
          />
        </Field>
        <Field label="Société" error={errors.societe?.message}>
          <input
            type="text"
            autoComplete="organization"
            {...register("societe")}
            className="mt-2 w-full border-0 border-b-2 border-ink/15 bg-transparent px-0 pb-2 text-base text-fir-dark focus:border-gold focus:outline-none focus:ring-0"
          />
        </Field>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <Field label="Email professionnel *" error={errors.email?.message}>
          <input
            type="email"
            autoComplete="email"
            {...register("email")}
            className="mt-2 w-full border-0 border-b-2 border-ink/15 bg-transparent px-0 pb-2 text-base text-fir-dark focus:border-gold focus:outline-none focus:ring-0"
          />
        </Field>
        <Field label="Téléphone *" error={errors.telephone?.message}>
          <input
            type="tel"
            autoComplete="tel"
            placeholder="06 12 34 56 78"
            {...register("telephone")}
            className="mt-2 w-full border-0 border-b-2 border-ink/15 bg-transparent px-0 pb-2 text-base text-fir-dark focus:border-gold focus:outline-none focus:ring-0"
          />
        </Field>
      </div>

      <Field label="Comment nous avez-vous connus ?" error={errors.source?.message}>
        <select
          {...register("source")}
          className="mt-2 w-full border-0 border-b-2 border-ink/15 bg-transparent px-0 pb-2 text-base text-fir-dark focus:border-gold focus:outline-none focus:ring-0"
        >
          <option value="">— Optionnel —</option>
          {SOURCES.map((s) => (
            <option key={s} value={s}>
              {LABELS.source[s]}
            </option>
          ))}
        </select>
      </Field>

      <Field
        label="Précisions sur votre projet"
        hint={`${message.length}/500`}
        error={errors.message?.message}
      >
        <textarea
          rows={4}
          maxLength={500}
          placeholder="Contraintes spécifiques, calendrier impératif, exigences techniques, etc."
          {...register("message")}
          className="mt-2 w-full resize-none border-0 border-b-2 border-ink/15 bg-transparent px-0 pb-2 text-base text-fir-dark focus:border-gold focus:outline-none focus:ring-0"
        />
      </Field>

      {/* Honeypot caché */}
      <input
        type="text"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        {...register("website")}
        className="pointer-events-none absolute left-[-9999px] h-0 w-0 opacity-0"
      />

      <label className="flex cursor-pointer items-start gap-3">
        <input
          type="checkbox"
          {...register("consentement")}
          className="mt-1 h-4 w-4 rounded border-fir-dark/30 text-fir-dark focus:ring-gold"
        />
        <span className="text-xs leading-relaxed text-ink/70">
          J'accepte que mes données soient traitées par Valor Immo dans le cadre de
          ma demande. Voir notre{" "}
          <Link
            href="/politique-de-confidentialite"
            target="_blank"
            className="underline underline-offset-2 hover:text-fir-dark"
          >
            politique de confidentialité
          </Link>
          .
        </span>
      </label>
      {errors.consentement && (
        <p className="-mt-4 text-xs text-amber-700">{errors.consentement.message}</p>
      )}
    </div>
  )
}

function Field({
  label,
  hint,
  error,
  children,
}: {
  label: string
  hint?: string
  error?: string
  children: React.ReactNode
}) {
  return (
    <label className="block">
      <span className="flex items-center justify-between text-xs uppercase tracking-wider text-ink/60">
        <span>{label}</span>
        {hint && <span className="text-ink/40 normal-case tracking-normal">{hint}</span>}
      </span>
      {children}
      {error && <span className="mt-1 block text-xs text-amber-700">{error}</span>}
    </label>
  )
}
