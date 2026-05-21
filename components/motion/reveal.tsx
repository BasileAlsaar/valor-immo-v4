"use client"

import { motion, useReducedMotion } from "framer-motion"
import type { ReactNode } from "react"

type Props = {
  children: ReactNode
  delay?: number
  className?: string
  as?: "div" | "section" | "header" | "article"
}

export function Reveal({ children, delay = 0, className, as }: Props) {
  const reduce = useReducedMotion()
  const Tag = motion[as ?? "div"]
  if (reduce) {
    return <Tag className={className}>{children}</Tag>
  }
  return (
    <Tag
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{
        duration: 0.8,
        delay,
        ease: [0.16, 1, 0.3, 1],
      }}
      className={className}
    >
      {children}
    </Tag>
  )
}

export function RevealStagger({
  children,
  className,
  staggerDelay = 0.08,
}: {
  children: ReactNode
  className?: string
  staggerDelay?: number
}) {
  const reduce = useReducedMotion()
  if (reduce) {
    return <div className={className}>{children}</div>
  }
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: staggerDelay } },
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

export function RevealItem({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 32 },
        visible: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}
