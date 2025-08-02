'use client'

import { useState } from 'react'
import Link from 'next/link'
import { cn } from '@/lib/utils'

export function AnimatedLogo() {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <Link
      href="/"
      className="flex items-center gap-2 group relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Logo with horizontal flip animation */}
      <div className="relative">
        <img
          src="https://cdn.builder.io/api/v1/image/assets%2F0b295e259b734d8bb96a58b78a9c499c%2F426a0a657c2340a2811200d88baf89e8?format=webp&width=800"
          alt="Momentum Creative Logo"
          className={cn(
            'w-8 h-8 object-contain transition-all duration-500 ease-in-out -scale-x-100',
            isHovered && 'scale-x-100 scale-y-110'
          )}
        />
      </div>

      {/* Text always visible */}
      <div className="ml-2">
        <span className="font-semibold text-sm whitespace-nowrap">
          Momentum Creative
        </span>
      </div>

      {/* Subtle background that expands on hover */}
      <div
        className={cn(
          'absolute inset-0 bg-accent/20 rounded-lg transition-all duration-300 ease-in-out -z-10',
          isHovered ? 'scale-100 opacity-100' : 'scale-90 opacity-0'
        )}
      />
    </Link>
  )
}
