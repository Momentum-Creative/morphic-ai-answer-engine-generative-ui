'use client'

import { Progress } from './ui/progress'
import { Coins } from 'lucide-react'

interface CreditsIndicatorProps {
  used?: number
  total?: number
  className?: string
}

export function CreditsIndicator({ used = 10, total = 500, className }: CreditsIndicatorProps) {
  const percentage = (used / total) * 100

  return (
    <div className={`flex items-center gap-2 px-3 py-2 bg-muted/50 rounded-full border border-border/50 ${className}`}>
      <Coins className="w-4 h-4 text-yellow-500" />
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-foreground">
            {used} of {total} credits
          </span>
          <span className="text-xs text-muted-foreground">
            ({Math.round(percentage)}%)
          </span>
        </div>
        <Progress 
          value={percentage} 
          className="h-1.5 w-20"
        />
      </div>
    </div>
  )
}
