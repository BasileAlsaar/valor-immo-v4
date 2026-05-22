"use client"

import { useState } from "react"

import { CtaPill } from "@/components/ui/cta-pill"
import { CallbackQuickForm } from "@/components/callback/CallbackQuickForm"

type Props = {
  variant?: "gold" | "fir" | "outline-gold" | "outline-white" | "outline-ink"
  size?: "md" | "lg"
  className?: string
  children?: React.ReactNode
}

/**
 * Bouton "Être rappelé gratuitement" qui ouvre le modal CallbackQuickForm.
 * Le bouton POST `/api/callback`, distinct du formulaire qualifiant 3 étapes
 * de `/contact` (qui POST `/api/contact`).
 */
export function CallbackTrigger({
  variant = "outline-white",
  size = "lg",
  className,
  children = "Être rappelé gratuitement",
}: Props) {
  const [open, setOpen] = useState(false)
  return (
    <>
      <CtaPill
        variant={variant}
        size={size}
        className={className}
        onClick={() => setOpen(true)}
      >
        {children}
      </CtaPill>
      <CallbackQuickForm open={open} onClose={() => setOpen(false)} />
    </>
  )
}
