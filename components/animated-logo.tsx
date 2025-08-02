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
      {/* Logo with rotation animation */}
      <div className="relative">
        <img
          src="https://cdn.builder.io/api/v1/image/assets%2F0b295e259b734d8bb96a58b78a9c499c%2F426a0a657c2340a2811200d88baf89e8?format=webp&width=800"
          alt="Momentum Creative Logo"
          className={cn(
            'size-6 object-contain transition-all duration-500 ease-in-out',
            isHovered && 'rotate-180 scale-110'
          )}
        />
      </div>

      {/* Text that slides in from the right */}
      <div className="overflow-hidden">
        <span
          className={cn(
            'font-semibold text-sm whitespace-nowrap transition-all duration-300 ease-in-out block',
            isHovered
              ? 'translate-x-0 opacity-100'
              : 'translate-x-full opacity-0'
          )}
          style={{
            transform: isHovered ? 'translateX(0)' : 'translateX(100%)',
          }}
        >
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
