'use client'

import { useState, useEffect } from 'react'
import { cn } from '@/lib/utils'
import { Button } from './ui/button'

interface BrandCreatorPopupProps {
  onSelection: (type: 'brand' | 'creator') => void
}

export function BrandCreatorPopup({ onSelection }: BrandCreatorPopupProps) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Check if user has already made a selection
    const hasSelected = localStorage.getItem('user-type-selected')
    if (!hasSelected) {
      setIsVisible(true)
    }
  }, [])

  const handleSelection = (type: 'brand' | 'creator') => {
    localStorage.setItem('user-type-selected', 'true')
    localStorage.setItem('user-type', type)
    setIsVisible(false)
    onSelection(type)
  }

  if (!isVisible) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

      {/* Popup Content */}
      <div className="relative bg-background/95 backdrop-blur-md border border-border rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl">
        <div className="text-center space-y-6">
          <h2 className="text-2xl font-semibold text-foreground">
            Are you a brand or a creator?
          </h2>

          <div className="flex gap-4 justify-center">
            <Button
              onClick={() => handleSelection('brand')}
              className={cn(
                'px-8 py-4 text-lg font-medium',
                'bg-background/40 backdrop-blur-sm',
                'border-2 border-blue-500/50',
                'hover:border-blue-400 hover:bg-blue-500/10',
                'transition-all duration-200',
                'rounded-xl shadow-lg',
                'text-foreground hover:text-blue-400'
              )}
              variant="outline"
            >
              Brand
            </Button>

            <Button
              onClick={() => handleSelection('creator')}
              className={cn(
                'px-8 py-4 text-lg font-medium',
                'bg-background/40 backdrop-blur-sm',
                'border-2 border-blue-500/50',
                'hover:border-blue-400 hover:bg-blue-500/10',
                'transition-all duration-200',
                'rounded-xl shadow-lg',
                'text-foreground hover:text-blue-400'
              )}
              variant="outline"
            >
              Creator
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
