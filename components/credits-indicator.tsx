'use client'

import { Coins } from 'lucide-react'
import { cn } from '@/lib/utils'

interface CreditsIndicatorProps {
  used?: number
  total?: number
  className?: string
}

export function CreditsIndicator({ used = 120, total = 500, className }: CreditsIndicatorProps) {
  const percentage = (used / total) * 100

  return (
    <div className={cn("flex items-center gap-2 px-3 py-2 bg-muted/50 rounded-full border border-border/50", className)}>
      <Coins className="w-4 h-4 text-yellow-500" />
      <div className="flex flex-col gap-1">
        <span className="text-xs font-medium text-foreground">
          {used} of {total} credits
        </span>
        {/* Simple progress bar */}
        <div className="w-20 h-1.5 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-green-500 to-yellow-500 transition-all duration-300"
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
    </div>
  )
}
