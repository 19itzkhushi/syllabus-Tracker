import * as React from "react"
import * as RechartsPrimitive from "recharts"
import { cn } from "../../lib/utils"

// Chart container component
const ChartContainer = React.forwardRef(({ className, config, children, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn("w-full", className)}
      style={{
        "--color-background": "hsl(var(--background))",
        "--color-foreground": "hsl(var(--foreground))",
        "--color-card": "hsl(var(--card))",
        "--color-card-foreground": "hsl(var(--card-foreground))",
        "--color-popover": "hsl(var(--popover))",
        "--color-popover-foreground": "hsl(var(--popover-foreground))",
        "--color-primary": "hsl(var(--primary))",
        "--color-primary-foreground": "hsl(var(--primary-foreground))",
        "--color-secondary": "hsl(var(--secondary))",
        "--color-secondary-foreground": "hsl(var(--secondary-foreground))",
        "--color-muted": "hsl(var(--muted))",
        "--color-muted-foreground": "hsl(var(--muted-foreground))",
        "--color-accent": "hsl(var(--accent))",
        "--color-accent-foreground": "hsl(var(--accent-foreground))",
        "--color-destructive": "hsl(var(--destructive))",
        "--color-destructive-foreground": "hsl(var(--destructive-foreground))",
        "--color-border": "hsl(var(--border))",
        "--color-input": "hsl(var(--input))",
        "--color-ring": "hsl(var(--ring))",
        "--color-chart-1": "hsl(var(--chart-1))",
        "--color-chart-2": "hsl(var(--chart-2))",
        "--color-chart-3": "hsl(var(--chart-3))",
        "--color-chart-4": "hsl(var(--chart-4))",
        "--color-chart-5": "hsl(var(--chart-5))",
        ...Object.entries(config).reduce((acc, [key, value]) => {
          if (value.color) {
            acc[`--color-${key}`] = value.color
          }
          return acc
        }, {}),
      }}
      {...props}
    >
      {children}
    </div>
  )
})
ChartContainer.displayName = "ChartContainer"

// Chart tooltip component
const ChartTooltip = RechartsPrimitive.Tooltip

const ChartTooltipContent = React.forwardRef(
  (
    {
      active,
      payload,
      className,
      indicator = "dot",
      hideLabel = false,
      hideIndicator = false,
      label,
      labelFormatter,
      labelClassName,
      formatter,
      color,
      nameKey,
      labelKey,
    },
    ref,
  ) => {
    const tooltipLabel = React.useMemo(() => {
      if (hideLabel || !payload?.length) {
        return null
      }

      const [item] = payload
      const key = `${labelKey || item.dataKey || item.name || "value"}`
      const itemConfig = item.payload

      if (labelFormatter) {
        return labelFormatter(label, payload)
      }

      return label
    }, [label, labelFormatter, payload, hideLabel, labelKey])

    if (!active || !payload?.length) {
      return null
    }

    return (
      <div
        ref={ref}
        className={cn(
          "grid min-w-[8rem] items-start gap-1.5 rounded-lg border border-border/50 bg-background px-2.5 py-1.5 text-xs shadow-xl",
          className,
        )}
      >
        {!hideLabel && tooltipLabel ? <div className={cn("font-medium", labelClassName)}>{tooltipLabel}</div> : null}
        <div className="grid gap-1.5">
          {payload.map((item, index) => {
            const key = `${nameKey || item.name || item.dataKey || "value"}`
            const itemConfig = item.payload
            const indicatorColor = color || item.payload?.fill || item.color

            return (
              <div
                key={item.dataKey}
                className={cn(
                  "flex w-full flex-wrap items-stretch gap-2 [&>svg]:h-2.5 [&>svg]:w-2.5 [&>svg]:text-muted-foreground",
                  indicator === "dot" && "items-center",
                )}
              >
                {!hideIndicator && (
                  <div
                    className={cn("shrink-0 rounded-[2px] border-[--color-border] bg-[--color-bg]", {
                      "h-2.5 w-2.5": indicator === "dot",
                      "w-1": indicator === "line",
                      "w-0 border-l-2 border-dashed bg-transparent": indicator === "dashed",
                      "my-0.5": indicator === "dashed",
                    })}
                    style={{
                      "--color-bg": indicatorColor,
                      "--color-border": indicatorColor,
                    }}
                  />
                )}
                <div
                  className={cn(
                    "flex flex-1 justify-between leading-none",
                    hideIndicator ? "items-end" : "items-center",
                  )}
                >
                  <div className="grid gap-1.5">
                    <span className="text-muted-foreground">{itemConfig?.label || key}</span>
                  </div>
                  {item.value && (
                    <span className="font-mono font-medium tabular-nums text-foreground">
                      {formatter ? formatter(item.value, item.name, item, index, payload) : item.value}
                    </span>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    )
  },
)
ChartTooltipContent.displayName = "ChartTooltipContent"

export { ChartContainer, ChartTooltip, ChartTooltipContent }
