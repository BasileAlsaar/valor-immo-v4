"use client"

import { useFormContext } from "react-hook-form"
import { Building2, Briefcase, Hotel, Building, Warehouse, Key } from "lucide-react"

import {
  LABELS,
  TYPOLOGIES,
  TRANSACTIONS,
  type ContactFormValues,
  type Typologie,
  type Transaction,
} from "@/lib/validations/contact"
import { cn } from "@/lib/utils"

const TYPOLOGIE_ICONS: Record<Typologie, typeof Building2> = {
  "locaux-commerciaux": Building2,
  bureaux: Briefcase,
  hotellerie: Hotel,
  immeubles: Building,
  "entrepots-logistique": Warehouse,
  "cession-droit-au-bail": Key,
}

export function StepProjet() {
  const {
    register,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext<ContactFormValues>()

  const typologie = watch("typologie")
  const transaction = watch("transaction")

  return (
    <div className="space-y-10">
      {/* Typologie — cartes radio */}
      <fieldset>
        <legend className="eyebrow text-gold-deep">Quel type d'actif ?</legend>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {TYPOLOGIES.map((t) => {
            const Icon = TYPOLOGIE_ICONS[t]
            const checked = typologie === t
            return (
              <label
                key={t}
                className={cn(
                  "group relative flex cursor-pointer flex-col gap-3 rounded-2xl border-2 p-5 transition",
                  checked
                    ? "border-gold bg-gold/8 shadow-[0_4px_24px_-12px_rgba(201,169,97,0.4)]"
                    : "border-fir-dark/10 bg-white hover:border-fir-dark/30",
                )}
              >
                <input
                  type="radio"
                  value={t}
                  {...register("typologie")}
                  className="sr-only"
                />
                <Icon
                  className={cn(
                    "h-6 w-6 transition",
                    checked ? "text-gold-deep" : "text-fir-dark/40 group-hover:text-fir-dark",
                  )}
                  strokeWidth={1.5}
                />
                <span
                  className={cn(
                    "text-sm font-medium leading-tight",
                    checked ? "text-fir-dark" : "text-ink/80",
                  )}
                >
                  {LABELS.typologie[t]}
                </span>
              </label>
            )
          })}
        </div>
        {errors.typologie && (
          <p className="mt-2 text-xs text-amber-700">{errors.typologie.message}</p>
        )}
      </fieldset>

      {/* Transaction — radios horizontaux */}
      <fieldset>
        <legend className="eyebrow text-gold-deep">Type de transaction</legend>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {TRANSACTIONS.map((tx) => {
            const checked = transaction === tx
            return (
              <label
                key={tx}
                className={cn(
                  "cursor-pointer rounded-full border-2 px-5 py-3 text-center text-sm font-medium transition",
                  checked
                    ? "border-fir-dark bg-fir-dark text-cream"
                    : "border-fir-dark/15 bg-white text-ink/70 hover:border-fir-dark/40",
                )}
              >
                <input
                  type="radio"
                  value={tx}
                  {...register("transaction")}
                  className="sr-only"
                />
                {LABELS.transaction[tx]}
              </label>
            )
          })}
        </div>
        {errors.transaction && (
          <p className="mt-2 text-xs text-amber-700">{errors.transaction.message}</p>
        )}
      </fieldset>

      {/* Budget — conditionnel selon transaction (pas affiché pour gestion) */}
      {transaction && transaction !== "gestion" && (
        <fieldset>
          <legend className="eyebrow text-gold-deep">Budget</legend>
          {(transaction === "location" || transaction === "les-deux") && (
            <div className="mt-4">
              <p className="text-xs text-ink/50">
                Loyer mensuel (€/mois HT HC), 1 000 à 50 000.
              </p>
              <div className="mt-3 grid gap-4 sm:grid-cols-2">
                <NumberField
                  label="Loyer min"
                  name="budgetMin"
                  placeholder="3 000"
                  step={500}
                  max={50000}
                  register={register}
                  setValue={setValue}
                  error={errors.budgetMin?.message}
                />
                <NumberField
                  label="Loyer max"
                  name="budgetMax"
                  placeholder="12 000"
                  step={500}
                  max={50000}
                  register={register}
                  setValue={setValue}
                  error={errors.budgetMax?.message}
                />
              </div>
            </div>
          )}
          {(transaction === "acquisition" || transaction === "les-deux") && (
            <div className="mt-6">
              <p className="text-xs text-ink/50">
                Prix d'acquisition (€ total HT), 100 000 à 10 000 000.
              </p>
              <div className="mt-3 grid gap-4 sm:grid-cols-2">
                <NumberField
                  label="Prix min"
                  name={transaction === "acquisition" ? "budgetMin" : "budgetMinAcquisition"}
                  placeholder="800 000"
                  step={50000}
                  max={10000000}
                  register={register}
                  setValue={setValue}
                  error={(
                    transaction === "acquisition"
                      ? errors.budgetMin
                      : errors.budgetMinAcquisition
                  )?.message}
                />
                <NumberField
                  label="Prix max"
                  name={transaction === "acquisition" ? "budgetMax" : "budgetMaxAcquisition"}
                  placeholder="2 500 000"
                  step={50000}
                  max={10000000}
                  register={register}
                  setValue={setValue}
                  error={(
                    transaction === "acquisition"
                      ? errors.budgetMax
                      : errors.budgetMaxAcquisition
                  )?.message}
                />
              </div>
            </div>
          )}
        </fieldset>
      )}
    </div>
  )
}

type RegisterFn = ReturnType<typeof useFormContext<ContactFormValues>>["register"]
type SetValueFn = ReturnType<typeof useFormContext<ContactFormValues>>["setValue"]

function NumberField({
  label,
  name,
  placeholder,
  step,
  max,
  register,
  setValue,
  error,
}: {
  label: string
  name: keyof ContactFormValues
  placeholder?: string
  step: number
  max: number
  register: RegisterFn
  setValue: SetValueFn
  error?: string
}) {
  return (
    <label className="block">
      <span className="text-xs uppercase tracking-wider text-ink/60">{label}</span>
      <input
        type="number"
        inputMode="numeric"
        step={step}
        min={0}
        max={max}
        placeholder={placeholder}
        {...register(name as never, {
          setValueAs: (v) => {
            if (v === "" || v === null || v === undefined) return undefined
            const n = Number(v)
            return Number.isFinite(n) ? n : undefined
          },
        })}
        onBlur={(e) => {
          if (e.target.value === "") {
            setValue(name as never, undefined as never)
          }
        }}
        className="mt-2 w-full border-0 border-b-2 border-ink/15 bg-transparent px-0 pb-2 text-base text-fir-dark focus:border-gold focus:outline-none focus:ring-0"
      />
      {error && <span className="mt-1 block text-xs text-amber-700">{error}</span>}
    </label>
  )
}
