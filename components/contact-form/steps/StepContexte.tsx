"use client"

import { useFormContext } from "react-hook-form"

import {
  DEADLINES,
  FINANCEMENTS,
  SECTEURS,
  ZONES,
  LABELS,
  zoneLabel,
  type ContactFormValues,
  type Zone,
} from "@/lib/validations/contact"
import { cn } from "@/lib/utils"

export function StepContexte() {
  const {
    register,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext<ContactFormValues>()

  const secteur = watch("secteur")
  const zones = watch("zones") ?? []

  function toggleZone(zone: Zone) {
    const next = zones.includes(zone)
      ? zones.filter((z) => z !== zone)
      : [...zones, zone]
    setValue("zones", next, { shouldValidate: true, shouldDirty: true })
  }

  return (
    <div className="space-y-10">
      {/* Deadline */}
      <fieldset>
        <legend className="eyebrow text-gold-deep">Horizon de décision</legend>
        <div className="mt-4 flex flex-wrap gap-2">
          {DEADLINES.map((d) => {
            const checked = watch("deadline") === d
            return (
              <label
                key={d}
                className={cn(
                  "cursor-pointer rounded-full border px-4 py-2 text-sm transition",
                  checked
                    ? "border-fir-dark bg-fir-dark text-cream"
                    : "border-fir-dark/15 bg-white text-ink/70 hover:border-fir-dark/40",
                )}
              >
                <input
                  type="radio"
                  value={d}
                  {...register("deadline")}
                  className="sr-only"
                />
                {LABELS.deadline[d]}
              </label>
            )
          })}
        </div>
        {errors.deadline && (
          <p className="mt-2 text-xs text-amber-700">{errors.deadline.message}</p>
        )}
      </fieldset>

      {/* Financement */}
      <fieldset>
        <legend className="eyebrow text-gold-deep">Financement</legend>
        <div className="mt-4 flex flex-wrap gap-2">
          {FINANCEMENTS.map((f) => {
            const checked = watch("financement") === f
            return (
              <label
                key={f}
                className={cn(
                  "cursor-pointer rounded-full border px-4 py-2 text-sm transition",
                  checked
                    ? "border-fir-dark bg-fir-dark text-cream"
                    : "border-fir-dark/15 bg-white text-ink/70 hover:border-fir-dark/40",
                )}
              >
                <input
                  type="radio"
                  value={f}
                  {...register("financement")}
                  className="sr-only"
                />
                {LABELS.financement[f]}
              </label>
            )
          })}
        </div>
        {errors.financement && (
          <p className="mt-2 text-xs text-amber-700">{errors.financement.message}</p>
        )}
      </fieldset>

      {/* Secteur */}
      <fieldset>
        <label className="block">
          <span className="eyebrow text-gold-deep">Secteur d'activité</span>
          <select
            {...register("secteur")}
            className="mt-3 w-full border-0 border-b-2 border-ink/15 bg-transparent px-0 pb-2 text-base text-fir-dark focus:border-gold focus:outline-none focus:ring-0"
          >
            <option value="">Sélectionner…</option>
            {SECTEURS.map((s) => (
              <option key={s} value={s}>
                {LABELS.secteur[s]}
              </option>
            ))}
          </select>
        </label>
        {secteur === "autre" && (
          <label className="mt-4 block">
            <span className="text-xs uppercase tracking-wider text-ink/60">
              Précisez votre secteur
            </span>
            <input
              type="text"
              {...register("secteurAutre")}
              placeholder="Description courte"
              className="mt-2 w-full border-0 border-b-2 border-ink/15 bg-transparent px-0 pb-2 text-base text-fir-dark focus:border-gold focus:outline-none focus:ring-0"
            />
          </label>
        )}
        {errors.secteur && (
          <p className="mt-2 text-xs text-amber-700">{errors.secteur.message}</p>
        )}
      </fieldset>

      {/* Zones — multi-select chips */}
      <fieldset>
        <legend className="eyebrow text-gold-deep">Zone(s) souhaitée(s)</legend>
        <p className="mt-2 text-xs text-ink/50">
          Sélection multiple possible. « Indifférent » exclut les autres.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          {ZONES.map((z) => {
            const checked = zones.includes(z)
            return (
              <button
                key={z}
                type="button"
                onClick={() => toggleZone(z)}
                className={cn(
                  "rounded-full border px-3 py-1.5 text-xs font-medium uppercase tracking-wider transition",
                  checked
                    ? "border-gold bg-gold/15 text-gold-deep"
                    : "border-fir-dark/15 bg-white text-ink/60 hover:border-fir-dark/40",
                )}
              >
                {zoneLabel(z)}
              </button>
            )
          })}
        </div>
        {errors.zones && (
          <p className="mt-2 text-xs text-amber-700">{errors.zones.message}</p>
        )}
      </fieldset>
    </div>
  )
}
