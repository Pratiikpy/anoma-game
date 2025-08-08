import React, { useEffect, useRef } from 'react'
import { analytics } from '../lib/analytics'

const PerformanceMonitor: React.FC = () => {
  const startTime = useRef<number>(Date.now())

  useEffect(() => {
    const handleLoad = () => {
      const loadTime = Date.now() - startTime.current
      analytics.track('page_load_time', { loadTime })
    }

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        analytics.track('page_visibility', { state: 'visible' })
      } else {
        analytics.track('page_visibility', { state: 'hidden' })
      }
    }

    const handleOnline = () => {
      analytics.track('connection_status', { status: 'online' })
    }

    const handleOffline = () => {
      analytics.track('connection_status', { status: 'offline' })
    }

    // Performance monitoring
    if ('performance' in window) {
      window.addEventListener('load', handleLoad)
      document.addEventListener('visibilitychange', handleVisibilityChange)
      window.addEventListener('online', handleOnline)
      window.addEventListener('offline', handleOffline)

      // Monitor Core Web Vitals
      if ('PerformanceObserver' in window) {
        try {
          const observer = new PerformanceObserver((list) => {
            for (const entry of list.getEntries()) {
              if (entry.entryType === 'largest-contentful-paint') {
                analytics.track('lcp', { value: entry.startTime })
              } else if (entry.entryType === 'first-input') {
                const firstInputEntry = entry as PerformanceEventTiming
                analytics.track('fid', { value: firstInputEntry.processingStart - entry.startTime })
              } else if (entry.entryType === 'layout-shift') {
                analytics.track('cls', { value: (entry as any).value })
              }
            }
          })

          observer.observe({ entryTypes: ['largest-contentful-paint', 'first-input', 'layout-shift'] })
        } catch (error) {
          console.warn('Performance monitoring not supported:', error)
        }
      }
    }

    return () => {
      window.removeEventListener('load', handleLoad)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  return null
}

export default PerformanceMonitor 