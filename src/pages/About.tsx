import React from 'react'
import { motion } from 'framer-motion'
import { Cpu, Globe, Shield, Zap, Users, Code } from 'lucide-react'

const About: React.FC = () => {
  const features = [
    {
      icon: <Cpu className="w-8 h-8" />,
      title: "Intent Machine",
      description: "A new paradigm that replaces virtual machines with intent machines, enabling declarative programming for blockchain applications."
    },
    {
      icon: <Globe className="w-8 h-8" />,
      title: "Cross-Chain Unification",
      description: "Unify underlying blockchains into a single development environment, ending fragmentation of state and users."
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Programmable Data Sovereignty",
      description: "Users maintain full control over their data while enabling seamless cross-chain interactions."
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: "Scale-Free & Cost Effective",
      description: "Build applications that scale automatically without worrying about gas fees or network congestion."
    }
  ]

  const team = [
    {
      name: "Anoma Core Team",
      role: "Distributed Operating System",
      description: "Building the future of intent-centric applications"
    }
  ]

  return (
    <div className="min-h-screen pt-16 bg-anoma-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl font-bold text-white mb-6">
            About <span className="text-anoma-red">Anoma</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Anoma is a distributed operating system for intent-centric applications. 
            It unifies underlying blockchains into a single development environment, 
            ending the fragmentation of state and users that limits today's decentralized applications.
          </p>
        </motion.div>

        {/* Vision Section */}
        <motion.section 
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-24"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-white mb-6">
                The Future of <span className="text-anoma-red">Decentralized Applications</span>
              </h2>
              <p className="text-gray-300 mb-6">
                Traditional blockchain applications require users to understand complex technical details 
                like gas fees, network congestion, and cross-chain bridges. Anoma changes this paradigm 
                by introducing intent-centric applications.
              </p>
              <p className="text-gray-300 mb-6">
                With Anoma, users simply declare what they want to achieve, and the system automatically 
                handles the complex orchestration across multiple blockchains. This creates a more 
                human-centric experience that focuses on outcomes rather than technical implementation.
              </p>
              <p className="text-gray-300">
                The intent machine processes these declarations and automatically routes transactions, 
                manages cross-chain state, and ensures optimal execution across the entire blockchain ecosystem.
              </p>
            </div>
            <div className="relative">
              <div className="w-full h-96 bg-gradient-to-br from-anoma-red/20 to-transparent rounded-2xl border border-anoma-light-gray flex items-center justify-center">
                <div className="text-center">
                  <div className="w-24 h-24 intent-machine rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-2xl">
                    <Cpu className="w-12 h-12 text-white" />
                  </div>
                  <h3 className="text-white font-bold text-xl">Intent Machine</h3>
                  <p className="text-gray-400 mt-2">Processing your intents</p>
                </div>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Features Grid */}
        <motion.section 
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-24"
        >
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            Core <span className="text-anoma-red">Features</span>
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 + index * 0.1 }}
                className="bg-anoma-gray p-8 rounded-2xl border border-anoma-light-gray hover:border-anoma-red transition-colors"
              >
                <div className="w-16 h-16 bg-anoma-red rounded-2xl flex items-center justify-center mb-6">
                  {feature.icon}
                </div>
                <h3 className="text-white font-bold text-xl mb-4">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Technology Stack */}
        <motion.section 
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mb-24"
        >
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            Technology <span className="text-anoma-red">Stack</span>
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-anoma-gray p-6 rounded-xl border border-anoma-light-gray text-center">
              <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Code className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-white font-semibold mb-2">Intent Language</h3>
              <p className="text-gray-400 text-sm">
                Declarative language for expressing complex cross-chain intents
              </p>
            </div>
            
            <div className="bg-anoma-gray p-6 rounded-xl border border-anoma-light-gray text-center">
              <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Globe className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-white font-semibold mb-2">Cross-Chain Protocol</h3>
              <p className="text-gray-400 text-sm">
                Seamless interoperability across all major blockchains
              </p>
            </div>
            
            <div className="bg-anoma-gray p-6 rounded-xl border border-anoma-light-gray text-center">
              <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-white font-semibold mb-2">Privacy Layer</h3>
              <p className="text-gray-400 text-sm">
                Built-in privacy and data sovereignty for users
              </p>
            </div>
          </div>
        </motion.section>

        {/* Team Section */}
        <motion.section 
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mb-24"
        >
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            Meet the <span className="text-anoma-red">Team</span>
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 + index * 0.1 }}
                className="bg-anoma-gray p-8 rounded-2xl border border-anoma-light-gray text-center"
              >
                <div className="w-20 h-20 bg-anoma-red rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-white font-bold text-xl mb-2">{member.name}</h3>
                <p className="text-anoma-red font-semibold mb-4">{member.role}</p>
                <p className="text-gray-400">{member.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* CTA Section */}
        <motion.section 
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="text-center"
        >
          <div className="bg-gradient-to-r from-anoma-red/20 to-transparent p-12 rounded-2xl border border-anoma-light-gray">
            <h2 className="text-3xl font-bold text-white mb-6">
              Ready to Build the Future?
            </h2>
            <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
              Join the Anoma ecosystem and start building intent-centric applications 
              that provide unmatched user experiences across any blockchain.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="px-8 py-4 bg-anoma-red text-white font-semibold rounded-lg hover:bg-anoma-red/80 transition-colors">
                Start Building
              </button>
              <button className="px-8 py-4 border border-white text-white font-semibold rounded-lg hover:bg-white hover:text-black transition-colors">
                Join Community
              </button>
            </div>
          </div>
        </motion.section>
      </div>
    </div>
  )
}

export default About 