/**
 * useScrollReveal.js
 * Хук для анімації появи елементів при скролі.
 * Повертає ref — прикріплюй до будь-якого DOM-елемента.
 *
 * Використання:
 *   const ref = useScrollReveal()
 *   <div ref={ref} className="reveal"> ... </div>
 */

import { useEffect, useRef } from 'react'

export function useScrollReveal(options = {}) {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible')
          // Після появи — відключаємо спостереження (одноразова анімація)
          observer.unobserve(entry.target)
        }
      },
      { threshold: 0.1, ...options }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return ref
}