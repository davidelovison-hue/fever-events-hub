import { useEffect, useRef } from 'react'
import Lenis from 'lenis'

/**
 * Smooth scroll (Lenis) + optional scroll position callback for UI like sticky headers.
 */
export function useLenis(onScroll?: (scrollY: number) => void) {
  const lenisRef = useRef<Lenis | null>(null)
  const onScrollRef = useRef(onScroll)
  onScrollRef.current = onScroll

  useEffect(() => {
    const lenis = new Lenis({
      lerp: 0.09,
      smoothWheel: true,
      wheelMultiplier: 0.92,
    })
    lenisRef.current = lenis

    const offScroll = lenis.on('scroll', (instance) => {
      onScrollRef.current?.(instance.animatedScroll)
    })

    let rafId = 0
    function raf(time: number) {
      lenis.raf(time)
      rafId = requestAnimationFrame(raf)
    }
    rafId = requestAnimationFrame(raf)

    return () => {
      cancelAnimationFrame(rafId)
      offScroll()
      lenis.destroy()
      lenisRef.current = null
    }
  }, [])

  return lenisRef
}
