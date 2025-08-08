import React, { useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import Header from './components/Header'
import Home from './pages/Home'
import IntentDemo from './pages/IntentDemo'
import About from './pages/About'
import Footer from './components/Footer'
import ParticleBackground from './components/ParticleBackground'
import SmoothScroll from './components/SmoothScroll'
import ErrorBoundary from './lib/errorBoundary'
import PerformanceMonitor from './components/PerformanceMonitor'
import { analytics } from './lib/analytics'

// Analytics wrapper component
const AnalyticsWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation()

  useEffect(() => {
    analytics.trackPageView(location.pathname)
  }, [location.pathname])

  return <>{children}</>
}

function App() {
  return (
    <ErrorBoundary>
      <Router>
        <AnalyticsWrapper>
          <div className="min-h-screen bg-anoma-dark relative overflow-hidden">
            <PerformanceMonitor />
            <ParticleBackground />
            <SmoothScroll />
            <Header />
            <main className="relative z-10">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/demo" element={<IntentDemo />} />
                <Route path="/about" element={<About />} />
              </Routes>
            </main>
            <Footer />
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 4000,
                style: {
                  background: 'rgba(42, 42, 42, 0.95)',
                  color: '#fff',
                  border: '1px solid rgba(255, 0, 0, 0.3)',
                  backdropFilter: 'blur(10px)',
                },
                success: {
                  iconTheme: {
                    primary: '#00FF00',
                    secondary: '#fff',
                  },
                },
                error: {
                  iconTheme: {
                    primary: '#FF0000',
                    secondary: '#fff',
                  },
                },
              }}
            />
          </div>
        </AnalyticsWrapper>
      </Router>
    </ErrorBoundary>
  )
}

export default App 