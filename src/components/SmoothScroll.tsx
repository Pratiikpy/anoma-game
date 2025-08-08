import React, { useEffect } from 'react'
import { motion, useScroll, useSpring } from 'framer-motion'

const SmoothScroll: React.FC = () => {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  })

  useEffect(() => {
    // Smooth scroll behavior
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault()
      const delta = e.deltaY
      const scrollSpeed = 0.5
      
      window.scrollBy({
        top: delta * scrollSpeed,
        behavior: 'smooth'
      })
    }

    // Only apply on desktop
    if (window.innerWidth > 768) {
      document.addEventListener('wheel', handleWheel, { passive: false })
    }

    return () => {
      document.removeEventListener('wheel', handleWheel)
    }
  }, [])

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-1 bg-anoma-red origin-left z-50"
      style={{ scaleX }}
    />
  )
}

export default SmoothScroll 