"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence, useReducedMotion } from "framer-motion"
import { Loader2, Phone, X } from "lucide-react"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

import { PHONE_FR_REGEX } from "@/lib/validations/contact"
import { duration, easing } from "@/lib/motion"
import { SITE } from "@/lib/site"
import { cn } from "@/lib/utils"

const callbackSchema = z.object({
  name: z.string().min(2, "Nom requis").max(120),
  phone: z.string().regex(PHONE_FR_REGEX, "Numéro français invalide"),
  slot: z.string().max(120).optional(),
  // honeypot — doit rester vide
  hp: z.string().max(0).optional(),
})

type Values = z.infer<typeof callbackSchema>

const SLOTS = [
  { id: "matin", label: "Matin (9h–12h)" },
  { id: "apres-midi", label: "Après-midi (14h–17h)" },
  { id: "fin-journee", label: "Fin de journée (17h–19h)" },
  { id: "indifferent", label: "Indifférent" },
] as const

type Props = {
  open: boolean
  onClose: () => void
}

/**
 * Mini-form callback (modal) — bouton "Être rappelé gratuitement".
 * Postule vers `/api/callback`. Volontairement court (3 champs).
 */
export function CallbackQuickForm({ open, onClose }: Props) {
  const reduce = useReducedMotion()
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle")
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<Values>({
    resolver: zodResolver(callbackSchema),
    defaultValues: { slot: "" },
  })

  useEffect(() => {
    if (!open) return
    document.body.style.overflow = "hidden"
    return () => {
      document.body.style.overflow = ""
    }
  }, [open])

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose()
    }
    if (open) window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [open, onClose])

  async function onSubmit(values: Values) {
    setStatus("submitting")
    try {
      const res = await fetch("/api/callback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      })
      if (!res.ok) throw new Error("Envoi impossible")
      setStatus("success")
      reset()
    } catch {
      setStatus("error")
    }
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={reduce ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={reduce ? undefined : { opacity: 0 }}
          transition={{ duration: 0.3, ease: easing.smooth }}
          className="fixed inset-0 z-50 flex items-end justify-center bg-fir-darker/70 backdrop-blur-sm md:items-center"
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-labelledby="callback-title"
        >
          <motion.div
            initial={reduce ? false : { y: 24, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={reduce ? undefined : { y: 24, opacity: 0 }}
            transition={{ duration: duration.fast, ease: easing.smooth }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-md rounded-t-3xl bg-cream-soft p-8 md:rounded-3xl md:p-10"
          >
            <button
              type="button"
              onClick={onClose}
              aria-label="Fermer"
              className="absolute right-4 top-4 inline-flex h-9 w-9 items-center justify-center rounded-full text-ink/50 transition hover:bg-fir-dark/5 hover:text-ink"
            >
              <X className="h-4 w-4" />
            </button>

            {status === "success" ? (
              <div className="py-6 text-center">
                <p className="eyebrow text-gold-deep">Demande enregistrée</p>
                <h2 className="font-display mt-3 text-3xl uppercase leading-tight tracking-tight text-fir-dark">
                  Nous vous rappelons.
                </h2>
                <p className="mt-3 text-sm text-ink/70">
                  Sous 24h ouvrées, au numéro indiqué.
                </p>
                <button
                  type="button"
                  onClick={onClose}
                  className="mt-8 inline-flex items-center gap-2 rounded-full bg-fir-dark px-6 py-2.5 text-sm font-medium uppercase tracking-wider text-cream hover:bg-ink"
                >
                  Fermer
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
                <div>
                  <p className="eyebrow text-gold-deep">Être rappelé gratuitement</p>
                  <h2
                    id="callback-title"
                    className="font-display mt-2 text-3xl uppercase leading-tight tracking-tight text-fir-dark"
                  >
                    Laissez vos coordonnées.
                  </h2>
                  <p className="mt-2 text-sm text-ink/60">
                    Pour un brief plus long, utilisez{" "}
                    <a href="/contact" className="underline underline-offset-2">
                      notre formulaire en 3 étapes
                    </a>
                    .
                  </p>
                </div>

                <input
                  type="text"
                  tabIndex={-1}
                  autoComplete="off"
                  aria-hidden="true"
                  {...register("hp")}
                  className="pointer-events-none absolute left-[-9999px] h-0 w-0 opacity-0"
                />

                <label className="block">
                  <span className="text-xs uppercase tracking-wider text-ink/60">Nom complet *</span>
                  <input
                    type="text"
                    autoComplete="name"
                    {...register("name")}
                    className="mt-2 w-full border-0 border-b-2 border-ink/15 bg-transparent px-0 pb-2 text-base text-fir-dark focus:border-gold focus:outline-none"
                  />
                  {errors.name && (
                    <span className="mt-1 block text-xs text-amber-700">{errors.name.message}</span>
                  )}
                </label>

                <label className="block">
                  <span className="text-xs uppercase tracking-wider text-ink/60">Téléphone *</span>
                  <input
                    type="tel"
                    autoComplete="tel"
                    placeholder="06 12 34 56 78"
                    {...register("phone")}
                    className="mt-2 w-full border-0 border-b-2 border-ink/15 bg-transparent px-0 pb-2 text-base text-fir-dark focus:border-gold focus:outline-none"
                  />
                  {errors.phone && (
                    <span className="mt-1 block text-xs text-amber-700">{errors.phone.message}</span>
                  )}
                </label>

                <fieldset>
                  <legend className="text-xs uppercase tracking-wider text-ink/60">Créneau souhaité</legend>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {SLOTS.map((s) => (
                      <label
                        key={s.id}
                        className={cn(
                          "cursor-pointer rounded-full border px-3 py-1.5 text-xs font-medium uppercase tracking-wider transition",
                          "border-fir-dark/15 bg-white text-ink/60 hover:border-fir-dark/40",
                          "has-[:checked]:border-fir-dark has-[:checked]:bg-fir-dark has-[:checked]:text-cream",
                        )}
                      >
                        <input type="radio" value={s.label} {...register("slot")} className="sr-only" />
                        {s.label}
                      </label>
                    ))}
                  </div>
                </fieldset>

                {status === "error" && (
                  <div className="rounded-xl bg-amber-50 px-4 py-3 text-xs text-amber-900">
                    Erreur d'envoi. Appelez-nous au{" "}
                    <a href={`tel:${SITE.telephoneTel}`} className="underline">
                      {SITE.telephoneDisplay}
                    </a>
                    .
                  </div>
                )}

                <button
                  type="submit"
                  disabled={status === "submitting"}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-gold px-6 py-3 text-sm font-medium uppercase tracking-wider text-ink transition hover:bg-gold-warm disabled:opacity-60"
                >
                  {status === "submitting" ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" /> Envoi…
                    </>
                  ) : (
                    <>
                      <Phone className="h-4 w-4" /> Demander un rappel
                    </>
                  )}
                </button>
              </form>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
