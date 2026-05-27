import { SITE } from "@/lib/site"
import { cn } from "@/lib/utils"

type Props = {
  className?: string
  labelClassName?: string
  valueClassName?: string
}

export function HoursBlock({ className, labelClassName, valueClassName }: Props) {
  return (
    <div className={cn("flex flex-col gap-1", className)}>
      {SITE.hours.schedule.map((row) => (
        <div key={row.days} className="flex items-baseline gap-3">
          <span
            className={cn(
              "min-w-[5.25rem] text-[11px] uppercase tracking-wider opacity-60",
              labelClassName,
            )}
          >
            {row.days}
          </span>
          <span className={cn("text-sm", valueClassName)}>{row.time}</span>
        </div>
      ))}
    </div>
  )
}
