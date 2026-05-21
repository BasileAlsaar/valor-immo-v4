import { cn } from "@/lib/utils"

export function Eyebrow({
  children,
  className,
  as: As = "span",
}: {
  children: React.ReactNode
  className?: string
  as?: "span" | "p" | "div"
}) {
  return (
    <As className={cn("eyebrow inline-block", className)}>{children}</As>
  )
}
