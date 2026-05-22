"use client"

import { motion } from "framer-motion"
import { easing } from "@/lib/motion"
import { cn } from "@/lib/utils"

type Props = {
  current: 1 | 2 | 3
  labels?: [string, string, string]
}

const DEFAULT_LABELS: [string, string, string] = ["Projet", "Contexte", "Coordonnées"]

export function ProgressBar({ current, labels = DEFAULT_LABELS }: Props) {
  return (
    <div className="w-full">
      <div className="flex items-center gap-2">
        {[1, 2, 3].map((step) => {
          const isActive = step === current
          const isDone = step < current
          return (
            <div key={step} className="relative flex-1">
              <div className="h-[3px] w-full overflow-hidden rounded-full bg-fir-dark/10">
                <motion.div
                  initial={false}
                  animate={{
                    width: isActive ? "60%" : isDone ? "100%" : "0%",
                    backgroundColor: isActive
                      ? "#C9A961"
                      : isDone
                        ? "#0F3D2E"
                        : "#0F3D2E",
                  }}
                  transition={{ duration: 0.8, ease: easing.smooth }}
                  className="h-full origin-left"
                />
              </div>
            </div>
          )
        })}
      </div>
      <div className="mt-3 flex justify-between text-[11px] uppercase tracking-[0.16em]">
        {labels.map((label, i) => {
          const step = (i + 1) as 1 | 2 | 3
          const isActive = step === current
          const isDone = step < current
          return (
            <span
              key={label}
              className={cn(
                "transition-colors",
                isActive && "text-gold-deep font-medium",
                isDone && "text-fir-dark",
                !isActive && !isDone && "text-ink/40",
              )}
            >
              {label}
            </span>
          )
        })}
      </div>
    </div>
  )
}
