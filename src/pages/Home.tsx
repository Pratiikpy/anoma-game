import React from 'react'
import { Link } from 'react-router-dom'
import { motion, useScroll, useTransform } from 'framer-motion'
import { ArrowRight, Zap, Globe, Shield, Cpu, Sparkles } from 'lucide-react'

const Home: React.FC = () => {
  const { scrollYProgress } = useScroll()
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '50%'])
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])

  const features = [
    {
      icon: <Zap className="w-6 h-6" />,
      title: "User-centric & infra-abstracted",
      description: "Focus on user experience while Anoma handles the complexity"
    },
    {
      icon: <Globe className="w-6 h-6" />,
      title: "Compatible with any chain",
      description: "Unified development environment across all blockchains"
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Composable with everything",
      description: "Build modular applications that work seamlessly together"
    },
    {
      icon: <Cpu className="w-6 h-6" />,
      title: "Uniquely expressive",
      description: "Express complex intents with simple, declarative syntax"
    }
  ]

  return (
    <div className="min-h-screen pt-16 relative">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <motion.div 
          className="absolute inset-0 bg-gradient-to-br from-anoma-red/10 to-transparent"
          style={{ y, opacity }}
        />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 relative z-10">
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="mb-6"
            >
              <Sparkles className="w-12 h-12 mx-auto text-anoma-red mb-4 floating" />
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-6xl md:text-8xl font-bold mb-6"
            >
              <span className="text-white">Apps that work like</span>
              <br />
              <span className="text-gradient glow-text">magic</span>
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto"
            >
              Anoma introduces a new era of decentralized applications where you define the outcomes you want. 
              Declare your intent and let Anoma handle the rest.
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Link 
                to="/demo" 
                className="group inline-flex items-center px-8 py-4 bg-anoma-red text-white font-semibold rounded-lg hover:bg-anoma-red/80 transition-all duration-300 hover-lift neon-border"
              >
                <span>Try Intent Demo</span>
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <button className="group inline-flex items-center px-8 py-4 border border-white text-white font-semibold rounded-lg hover:bg-white hover:text-black transition-all duration-300 hover-lift glass-effect">
                <span>Learn More</span>
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Intent Machine Visualization */}
      <section className="py-24 bg-anoma-gray relative">
        <div className="absolute inset-0 bg-gradient-to-br from-anoma-red/5 to-transparent" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-4xl font-bold text-white mb-4"
            >
              FROM VM TO <span className="text-gradient">IM</span>
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-xl text-gray-300 max-w-2xl mx-auto"
            >
              Build on the intent machine and forget the complexities of smart contracts and cross-chain integrations.
            </motion.p>
          </div>

          <div className="relative">
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1 }}
              className="flex justify-center items-center"
            >
              {/* Intent Machine */}
              <div className="relative">
                <motion.div 
                  className="w-64 h-64 intent-machine rounded-2xl flex items-center justify-center shadow-2xl pulse-glow"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="text-center">
                    <motion.div 
                      className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    >
                      <Cpu className="w-8 h-8 text-anoma-red" />
                    </motion.div>
                    <h3 className="text-white font-bold text-lg glow-text">INTENT MACHINE</h3>
                  </div>
                </motion.div>
                
                {/* Connected chains */}
                <motion.div 
                  className="absolute -top-8 -left-8 w-16 h-16 bg-blue-500 rounded-lg flex items-center justify-center floating"
                  initial={{ opacity: 0, scale: 0 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                >
                  <span className="text-white font-bold">ETH</span>
                </motion.div>
                <motion.div 
                  className="absolute -top-8 -right-8 w-16 h-16 bg-green-500 rounded-lg flex items-center justify-center floating"
                  initial={{ opacity: 0, scale: 0 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.7 }}
                  style={{ animationDelay: '1s' }}
                >
                  <span className="text-white font-bold">SOL</span>
                </motion.div>
                <motion.div 
                  className="absolute -bottom-8 -left-8 w-16 h-16 bg-purple-500 rounded-lg flex items-center justify-center floating"
                  initial={{ opacity: 0, scale: 0 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.9 }}
                  style={{ animationDelay: '2s' }}
                >
                  <span className="text-white font-bold">COS</span>
                </motion.div>
                <motion.div 
                  className="absolute -bottom-8 -right-8 w-16 h-16 bg-yellow-500 rounded-lg flex items-center justify-center floating"
                  initial={{ opacity: 0, scale: 0 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 1.1 }}
                  style={{ animationDelay: '3s' }}
                >
                  <span className="text-white font-bold">NEAR</span>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-4xl font-bold text-white mb-4"
            >
              Why Choose <span className="text-gradient">Anoma</span>?
            </motion.h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -10 }}
                className="bg-anoma-gray p-6 rounded-lg border border-anoma-light-gray hover:border-anoma-red transition-all duration-300 hover-lift glass-effect"
              >
                <motion.div 
                  className="w-12 h-12 bg-anoma-red rounded-lg flex items-center justify-center mb-4"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ duration: 0.2 }}
                >
                  {feature.icon}
                </motion.div>
                <h3 className="text-white font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home 