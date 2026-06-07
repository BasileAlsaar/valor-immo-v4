import type { Parcours } from "@/lib/validations/funnel"

export type FunnelFieldType =
  | "text"
  | "tel"
  | "email"
  | "number"
  | "textarea"
  | "toggle"

export type FunnelField = {
  name: string
  label: string
  type: FunnelFieldType
  required?: boolean
  placeholder?: string
  suffix?: string
  autoComplete?: string
  /** toggle uniquement — libellé du couple d'états. Défaut: "Non" / "Oui". */
  falseLabel?: string
  trueLabel?: string
  /** textarea uniquement. */
  maxLength?: number
  /** layout : champ full-width sur md, sinon 2 cols par défaut. */
  fullWidth?: boolean
}

export type FunnelChoiceOption = {
  value: string
  label: string
}

export type FunnelStep =
  | {
      kind: "choice"
      title: string
      subtitle?: string
      /** Nom de la clé du field où la valeur sera stockée. */
      field: string
      options: FunnelChoiceOption[]
    }
  | {
      kind: "fields"
      title: string
      subtitle?: string
      fields: FunnelField[]
    }

export type FunnelConfig = {
  parcours: Parcours
  pageTitle: string
  eyebrow: string
  subtitle: string
  steps: FunnelStep[]
  /** Affiché sur l'écran de confirmation. */
  confirmationMessage: string
  /** Étiquettes courtes pour la progress bar (1 par étape). */
  stepLabels: string[]
}

/* -------------------------------------------------------------------------- */
/*                                  CONFIGS                                   */
/* -------------------------------------------------------------------------- */

export const proprietaireFunnel: FunnelConfig = {
  parcours: "proprietaire",
  pageTitle: "Vous êtes propriétaire ?",
  eyebrow: "Propriétaire",
  subtitle:
    "Décrivez votre actif et votre intention. Un conseiller vous contacte sous 24h ouvrées.",
  stepLabels: ["Intention", "Actif", "Détails"],
  steps: [
    {
      kind: "choice",
      title: "Que souhaitez-vous faire ?",
      field: "intention",
      options: [
        { value: "louer", label: "Louer" },
        { value: "vendre", label: "Vendre" },
        { value: "faire-gerer", label: "Faire gérer" },
        { value: "avis-de-valeur", label: "Obtenir un avis de valeur" },
      ],
    },
    {
      kind: "choice",
      title: "Type d'actif",
      field: "typeActif",
      options: [
        { value: "local-commercial", label: "Local commercial" },
        { value: "bureau", label: "Bureau" },
        { value: "immeuble", label: "Immeuble" },
        { value: "hotel", label: "Hôtel" },
        { value: "logistique", label: "Logistique" },
      ],
    },
    {
      kind: "fields",
      title: "Votre actif et vos coordonnées",
      subtitle: "Réponse sous 24h ouvrées.",
      fields: [
        {
          name: "adresse",
          label: "Adresse de l'actif",
          type: "text",
          required: true,
          placeholder: "Numéro, rue, code postal, ville",
          autoComplete: "street-address",
          fullWidth: true,
        },
        {
          name: "surface",
          label: "Surface",
          type: "number",
          required: true,
          suffix: "m²",
          placeholder: "120",
        },
        {
          name: "occupe",
          label: "Statut d'occupation",
          type: "toggle",
          falseLabel: "Libre",
          trueLabel: "Occupé",
        },
        {
          name: "loyerActuel",
          label: "Loyer actuel (HT HC mensuel)",
          type: "number",
          suffix: "€",
          placeholder: "Optionnel",
        },
        {
          name: "telephone",
          label: "Téléphone",
          type: "tel",
          required: true,
          placeholder: "06 12 34 56 78",
          autoComplete: "tel",
        },
        {
          name: "email",
          label: "Email",
          type: "email",
          required: true,
          placeholder: "vous@exemple.com",
          autoComplete: "email",
        },
      ],
    },
  ],
  confirmationMessage: "Un conseiller vous contacte rapidement.",
}

export const investisseurFunnel: FunnelConfig = {
  parcours: "investisseur",
  pageTitle: "Définissez votre recherche d'actif",
  eyebrow: "Investisseur",
  subtitle:
    "Précisez vos critères. Nous vous présentons les opportunités en cible — pas de bruit.",
  stepLabels: ["Budget", "Actif", "Secteur", "Coordonnées"],
  steps: [
    {
      kind: "choice",
      title: "Quel est votre budget ?",
      field: "budget",
      options: [
        { value: "lt-500k", label: "Moins de 500 K€" },
        { value: "500k-1m", label: "500 K€ – 1 M€" },
        { value: "1m-3m", label: "1 M€ – 3 M€" },
        { value: "3m-10m", label: "3 M€ – 10 M€" },
        { value: "gt-10m", label: "Plus de 10 M€" },
      ],
    },
    {
      kind: "choice",
      title: "Type d'actif recherché",
      field: "typeActif",
      options: [
        { value: "murs-occupes", label: "Murs occupés" },
        { value: "murs-libres", label: "Murs libres" },
        { value: "immeuble", label: "Immeuble" },
        { value: "hotel", label: "Hôtel" },
        { value: "bureau", label: "Bureau" },
        { value: "logistique", label: "Logistique" },
      ],
    },
    {
      kind: "choice",
      title: "Secteur géographique",
      field: "secteur",
      options: [
        { value: "paris", label: "Paris" },
        { value: "premiere-couronne", label: "Première couronne" },
        { value: "ile-de-france", label: "Île-de-France" },
        { value: "france", label: "France entière" },
      ],
    },
    {
      kind: "fields",
      title: "Affinez et laissez vos coordonnées",
      subtitle: "Réponse sous 24h ouvrées.",
      fields: [
        {
          name: "rendementRecherche",
          label: "Rendement recherché",
          type: "text",
          placeholder: "Ex. 5–7 % net",
        },
        {
          name: "financementValide",
          label: "Financement",
          type: "toggle",
          falseLabel: "En cours",
          trueLabel: "Validé",
        },
        {
          name: "telephone",
          label: "Téléphone",
          type: "tel",
          required: true,
          placeholder: "06 12 34 56 78",
          autoComplete: "tel",
        },
        {
          name: "email",
          label: "Email",
          type: "email",
          required: true,
          placeholder: "vous@exemple.com",
          autoComplete: "email",
        },
      ],
    },
  ],
  confirmationMessage: "Un conseiller vous contacte rapidement.",
}

export const commercantFunnel: FunnelConfig = {
  parcours: "commercant",
  pageTitle: "Déposez votre recherche",
  eyebrow: "Commerçant",
  subtitle:
    "Cadrons votre besoin ensemble. Nous ne vous montrons que des biens en cible.",
  stepLabels: ["Activité", "Brief"],
  steps: [
    {
      kind: "choice",
      title: "Quelle est votre activité ?",
      field: "activite",
      options: [
        { value: "restauration", label: "Restauration" },
        { value: "commerce", label: "Commerce" },
        { value: "sante", label: "Santé" },
        { value: "service", label: "Service" },
        { value: "sport", label: "Sport" },
        { value: "bureau", label: "Bureau" },
      ],
    },
    {
      kind: "fields",
      title: "Brief et coordonnées",
      subtitle: "Réponse sous 24h ouvrées.",
      fields: [
        {
          name: "surface",
          label: "Surface recherchée",
          type: "number",
          required: true,
          suffix: "m²",
          placeholder: "80",
        },
        {
          name: "budget",
          label: "Budget mensuel",
          type: "text",
          required: true,
          placeholder: "Ex. 4 000 €/mois HT HC",
        },
        {
          name: "secteurRecherche",
          label: "Secteur recherché",
          type: "text",
          required: true,
          placeholder: "Ex. Paris 1, 2, 8 ou Marais",
          fullWidth: true,
        },
        {
          name: "telephone",
          label: "Téléphone",
          type: "tel",
          required: true,
          placeholder: "06 12 34 56 78",
          autoComplete: "tel",
        },
        {
          name: "email",
          label: "Email",
          type: "email",
          required: true,
          placeholder: "vous@exemple.com",
          autoComplete: "email",
        },
        {
          name: "description",
          label: "Description du projet",
          type: "textarea",
          placeholder:
            "Concept, ancienneté, contraintes spécifiques (extraction, terrasse…)",
          maxLength: 1000,
          fullWidth: true,
        },
      ],
    },
  ],
  confirmationMessage: "Un conseiller vous contacte rapidement.",
}

export const FUNNELS: Record<Parcours, FunnelConfig> = {
  proprietaire: proprietaireFunnel,
  investisseur: investisseurFunnel,
  commercant: commercantFunnel,
}

/**
 * Résout la valeur brute d'un champ vers son libellé humain pour l'email.
 * - choice : retrouve l'option dans la config et renvoie son label.
 * - toggle : applique trueLabel/falseLabel.
 * - autres : value telle quelle.
 */
export function resolveFieldDisplay(
  config: FunnelConfig,
  fieldName: string,
  raw: string | boolean,
): { label: string; value: string } {
  for (const step of config.steps) {
    if (step.kind === "choice" && step.field === fieldName) {
      const opt = step.options.find((o) => o.value === raw)
      return { label: step.title, value: opt?.label ?? String(raw) }
    }
    if (step.kind === "fields") {
      const f = step.fields.find((x) => x.name === fieldName)
      if (!f) continue
      if (f.type === "toggle") {
        return {
          label: f.label,
          value: raw === true ? (f.trueLabel ?? "Oui") : (f.falseLabel ?? "Non"),
        }
      }
      const v = typeof raw === "boolean" ? (raw ? "Oui" : "Non") : raw
      const display = f.suffix && v ? `${v} ${f.suffix}` : v
      return { label: f.label, value: display || "—" }
    }
  }
  return { label: fieldName, value: String(raw) }
}
