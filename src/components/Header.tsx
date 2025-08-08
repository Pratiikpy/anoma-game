import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { AlertCircle, X } from 'lucide-react'
import { useAppStore } from '../lib/store'

const Header: React.FC = () => {
  const location = useLocation()
  const { networkStatus } = useAppStore()

  const navItems = [
    { path: '/', label: 'HOME' },
    { path: '/demo', label: 'INTENT DEMO' },
    { path: '/about', label: 'ABOUT' },
  ]

  return (
    <>
      {/* Network Error Banner */}
      {networkStatus.status === 'error' && (
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed top-0 left-0 right-0 z-50 bg-red-600 text-white px-4 py-3 flex items-center justify-between"
        >
          <div className="flex items-center space-x-2">
            <AlertCircle className="w-5 h-5" />
            <span className="font-medium">
              Network Error: {networkStatus.error || 'Failed to connect to Anoma testnet'}
            </span>
          </div>
          <button
            onClick={() => {
              // Attempt to reconnect
              const { connectToNetwork } = useAppStore.getState()
              connectToNetwork()
            }}
            className="text-white hover:text-gray-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </motion.div>
      )}

      <header className={`fixed top-0 left-0 right-0 z-40 glass-effect border-b border-anoma-light-gray/50 ${networkStatus.status === 'error' ? 'mt-12' : ''}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2 group">
              <motion.div 
                className="w-8 h-8 bg-anoma-red rounded-full flex items-center justify-center relative overflow-hidden"
                whileHover={{ scale: 1.1 }}
                transition={{ duration: 0.2 }}
              >
                <span className="text-white font-bold text-sm relative z-10">A</span>
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-anoma-red to-pink-500"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                />
              </motion.div>
              <span className="text-white font-bold text-xl group-hover:text-anoma-red transition-colors">
                anoma
              </span>
            </Link>

            {/* Navigation */}
            <nav className="hidden md:flex space-x-8">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`relative px-3 py-2 text-sm font-medium transition-all duration-300 group ${
                    location.pathname === item.path
                      ? 'text-anoma-green'
                      : 'text-gray-300 hover:text-white'
                  }`}
                >
                  <span className="relative z-10">{item.label}</span>
                  {location.pathname === item.path && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute inset-0 bg-anoma-green/20 rounded-md"
                      initial={false}
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    />
                  )}
                  <motion.div
                    className="absolute -bottom-1 left-0 right-0 h-0.5 bg-anoma-red scale-x-0 group-hover:scale-x-100 transition-transform duration-300"
                    initial={false}
                  />
                </Link>
              ))}
            </nav>

            {/* CTA Buttons */}
            <div className="flex items-center space-x-4">
              <motion.button 
                className="px-4 py-2 bg-anoma-green text-black font-medium rounded-md hover:bg-anoma-green/80 transition-all duration-300 hover-lift"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                BUILDERS PROGRAM
              </motion.button>
              <motion.button 
                className="px-4 py-2 bg-white text-black font-medium rounded-md hover:bg-gray-100 transition-all duration-300 hover-lift neon-border"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                START BUILDING
              </motion.button>
            </div>
          </div>
        </div>
      </header>
    </>
  )
}

export default Header 