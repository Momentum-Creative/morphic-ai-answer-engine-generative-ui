'use client'

import { useEffect, useRef } from 'react'

export function SplineBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const loadSpline = async () => {
      if (!canvasRef.current) return

      try {
        // Dynamically import Spline runtime
        const { Application } = await import('@splinetool/runtime')
        
        const app = new Application(canvasRef.current)
        await app.load('https://prod.spline.design/animatedbackgroundgradientforweb-ld2Q15Q1Q1zUYr1RQxb2Uiac/scene.splinecode')
      } catch (error) {
        console.error('Failed to load Spline scene:', error)
      }
    }

    loadSpline()
  }, [])

  return (
    <div className="fixed inset-0 z-0 pointer-events-none">
      <canvas 
        ref={canvasRef}
        className="w-full h-full object-cover"
        style={{ width: '100%', height: '100%' }}
      />
    </div>
  )
}
