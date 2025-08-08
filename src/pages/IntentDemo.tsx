import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight, CheckCircle, Clock, Zap, Globe, Shield, Wallet, AlertCircle, Sparkles } from 'lucide-react'
import { useAppStore } from '../lib/store'
import WalletConnect from '../components/WalletConnect'
import { toast } from 'react-hot-toast'

const IntentDemo: React.FC = () => {
  const { isConnected, intents, isProcessing, createIntent, processIntent } = useAppStore()
  const [selectedIntent, setSelectedIntent] = useState<string>('swap')
  const [amount, setAmount] = useState<string>('')
  const [fromToken, setFromToken] = useState<string>('ETH')
  const [toToken, setToToken] = useState<string>('USDC')
  const [fromChain, setFromChain] = useState<string>('Ethereum')
  const [toChain, setToChain] = useState<string>('Polygon')

  const intentTypes = [
    {
      id: 'swap',
      title: 'Cross-Chain Swap',
      description: 'Swap tokens across different blockchains seamlessly',
      icon: <Zap className="w-6 h-6" />,
      example: `I want to swap ${amount || '1'} ${fromToken} from ${fromChain} to ${toToken} on ${toChain}`
    },
    {
      id: 'bridge',
      title: 'Bridge Assets',
      description: 'Bridge assets between different blockchain networks',
      icon: <Globe className="w-6 h-6" />,
      example: `I want to bridge ${amount || '1000'} ${fromToken} from ${fromChain} to ${toChain}`
    },
    {
      id: 'stake',
      title: 'Stake & Earn',
      description: 'Stake tokens and earn rewards across multiple chains',
      icon: <Shield className="w-6 h-6" />,
      example: `I want to stake ${amount || '500'} ${fromToken} across ${fromChain}, ${toChain}, and Arbitrum for maximum yield`
    },
    {
      id: 'yield',
      title: 'Yield Farming',
      description: 'Automatically find and deploy to the best yield opportunities',
      icon: <Zap className="w-6 h-6" />,
      example: `I want to earn the highest possible yield on my ${amount || '2000'} ${fromToken} across all chains`
    }
  ]

  const handleCreateIntent = async () => {
    if (!isConnected) {
      toast.error('Please connect your wallet first')
      return
    }

    if (!amount || parseFloat(amount) <= 0) {
      toast.error('Please enter a valid amount')
      return
    }

    const selectedType = intentTypes.find(t => t.id === selectedIntent)
    if (!selectedType) return

    const intentData = {
      type: selectedIntent as any,
      description: selectedType.example,
      chains: [fromChain, toChain],
      amount,
      fromToken,
      toToken,
      fromChain,
      toChain
    }

    await createIntent(intentData)
    toast.success('Intent created successfully!')
  }

  const handleProcessIntent = async (intentId: string) => {
    await processIntent(intentId)
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-5 h-5 text-yellow-500" />
      case 'processing':
        return <div className="w-5 h-5 border-2 border-anoma-red border-t-transparent rounded-full animate-spin" />
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-500" />
      case 'failed':
        return <AlertCircle className="w-5 h-5 text-red-500" />
      default:
        return <Clock className="w-5 h-5 text-gray-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'text-yellow-500'
      case 'processing':
        return 'text-anoma-red'
      case 'completed':
        return 'text-green-500'
      case 'failed':
        return 'text-red-500'
      default:
        return 'text-gray-500'
    }
  }

  return (
    <div className="min-h-screen pt-16 bg-anoma-dark relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4"
          >
            <Sparkles className="w-12 h-12 mx-auto text-anoma-red floating" />
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-5xl font-bold text-white mb-4"
          >
            Intent-Centric <span className="text-gradient glow-text">Application</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-xl text-gray-300 max-w-2xl mx-auto"
          >
            Experience the power of intent-centric applications. Connect your wallet and create real intents 
            that will be processed across multiple blockchains.
          </motion.p>
        </div>

        {/* Wallet Connection */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="flex justify-center mb-8"
        >
          <WalletConnect />
        </motion.div>

        {!isConnected && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-8"
          >
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Wallet className="w-16 h-16 mx-auto mb-4 text-gray-400" />
            </motion.div>
            <p className="text-gray-400 text-lg">Connect your wallet to start creating intents</p>
          </motion.div>
        )}

        {isConnected && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Intent Creation */}
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              className="glass-effect p-8 rounded-2xl border border-anoma-light-gray/50 hover-lift"
            >
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                <Sparkles className="w-6 h-6 mr-2 text-anoma-red" />
                Create Your Intent
              </h2>
              
              {/* Intent Type Selection */}
              <div className="space-y-4 mb-6">
                {intentTypes.map((type) => (
                  <motion.div
                    key={type.id}
                    onClick={() => setSelectedIntent(type.id)}
                    className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-300 hover-lift ${
                      selectedIntent === type.id
                        ? 'border-anoma-red bg-anoma-red/10 neon-border'
                        : 'border-anoma-light-gray hover:border-anoma-red/50'
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="flex items-center space-x-3">
                      <motion.div 
                        className="w-10 h-10 bg-anoma-red rounded-lg flex items-center justify-center"
                        whileHover={{ rotate: 5, scale: 1.1 }}
                        transition={{ duration: 0.2 }}
                      >
                        {type.icon}
                      </motion.div>
                      <div>
                        <h3 className="text-white font-semibold">{type.title}</h3>
                        <p className="text-gray-400 text-sm">{type.description}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Intent Parameters */}
              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-white text-sm font-medium mb-2">Amount</label>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="Enter amount"
                    className="w-full px-4 py-2 bg-anoma-light-gray border border-anoma-light-gray rounded-lg text-white placeholder-gray-400 focus:border-anoma-red focus:outline-none transition-all duration-300"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-white text-sm font-medium mb-2">From Token</label>
                    <select
                      value={fromToken}
                      onChange={(e) => setFromToken(e.target.value)}
                      className="w-full px-4 py-2 bg-anoma-light-gray border border-anoma-light-gray rounded-lg text-white focus:border-anoma-red focus:outline-none transition-all duration-300"
                    >
                      <option value="ETH">ETH</option>
                      <option value="USDC">USDC</option>
                      <option value="USDT">USDT</option>
                      <option value="DAI">DAI</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-white text-sm font-medium mb-2">To Token</label>
                    <select
                      value={toToken}
                      onChange={(e) => setToToken(e.target.value)}
                      className="w-full px-4 py-2 bg-anoma-light-gray border border-anoma-light-gray rounded-lg text-white focus:border-anoma-red focus:outline-none transition-all duration-300"
                    >
                      <option value="USDC">USDC</option>
                      <option value="ETH">ETH</option>
                      <option value="USDT">USDT</option>
                      <option value="DAI">DAI</option>
                    </select>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-white text-sm font-medium mb-2">From Chain</label>
                    <select
                      value={fromChain}
                      onChange={(e) => setFromChain(e.target.value)}
                      className="w-full px-4 py-2 bg-anoma-light-gray border border-anoma-light-gray rounded-lg text-white focus:border-anoma-red focus:outline-none transition-all duration-300"
                    >
                      <option value="Ethereum">Ethereum</option>
                      <option value="Polygon">Polygon</option>
                      <option value="Arbitrum">Arbitrum</option>
                      <option value="Optimism">Optimism</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-white text-sm font-medium mb-2">To Chain</label>
                    <select
                      value={toChain}
                      onChange={(e) => setToChain(e.target.value)}
                      className="w-full px-4 py-2 bg-anoma-light-gray border border-anoma-light-gray rounded-lg text-white focus:border-anoma-red focus:outline-none transition-all duration-300"
                    >
                      <option value="Polygon">Polygon</option>
                      <option value="Ethereum">Ethereum</option>
                      <option value="Arbitrum">Arbitrum</option>
                      <option value="Optimism">Optimism</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Example Intent */}
              <div className="bg-anoma-light-gray p-4 rounded-lg mb-6 border border-anoma-light-gray/50">
                <h4 className="text-white font-semibold mb-2">Your Intent:</h4>
                <p className="text-gray-300 italic">
                  "{intentTypes.find(t => t.id === selectedIntent)?.example}"
                </p>
              </div>

              <motion.button
                onClick={handleCreateIntent}
                disabled={isProcessing || !amount}
                className="w-full py-4 bg-anoma-red text-white font-semibold rounded-lg hover:bg-anoma-red/80 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 hover-lift neon-border"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {isProcessing ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <span>Create Intent</span>
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </motion.button>
            </motion.div>

            {/* Intent History */}
            <motion.div 
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              className="glass-effect p-8 rounded-2xl border border-anoma-light-gray/50 hover-lift"
            >
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                <Sparkles className="w-6 h-6 mr-2 text-anoma-red" />
                Intent History
              </h2>
              
              <div className="space-y-4 max-h-96 overflow-y-auto">
                <AnimatePresence>
                  {intents.map((intent) => (
                    <motion.div
                      key={intent.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="bg-anoma-light-gray p-4 rounded-lg border border-anoma-light-gray/50 hover-lift"
                      whileHover={{ scale: 1.02 }}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          {getStatusIcon(intent.status)}
                          <span className={`font-semibold capitalize ${getStatusColor(intent.status)}`}>
                            {intent.type} Intent
                          </span>
                        </div>
                        <span className="text-gray-400 text-sm">
                          {intent.timestamp.toLocaleTimeString()}
                        </span>
                      </div>
                      
                      <p className="text-gray-300 text-sm mb-2">{intent.description}</p>
                      
                      {intent.amount && (
                        <p className="text-gray-400 text-sm mb-2">
                          Amount: {intent.amount} {intent.fromToken}
                        </p>
                      )}
                      
                      <div className="flex flex-wrap gap-2 mb-3">
                        {intent.chains.map((chain) => (
                          <span
                            key={chain}
                            className="px-2 py-1 bg-anoma-red/20 text-anoma-red text-xs rounded-full"
                          >
                            {chain}
                          </span>
                        ))}
                      </div>
                      
                      {intent.txHash && (
                        <div className="flex items-center space-x-2 text-xs">
                          <span className="text-gray-400">TX:</span>
                          <a
                            href={`https://etherscan.io/tx/${intent.txHash}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-anoma-red hover:underline"
                          >
                            {intent.txHash.slice(0, 10)}...{intent.txHash.slice(-8)}
                          </a>
                        </div>
                      )}
                      
                      {intent.status === 'pending' && (
                        <motion.button
                          onClick={() => handleProcessIntent(intent.id)}
                          className="mt-2 px-3 py-1 bg-anoma-red text-white text-xs rounded hover:bg-anoma-red/80 transition-all duration-300"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          Process Intent
                        </motion.button>
                      )}
                      
                      {intent.error && (
                        <p className="text-red-400 text-xs mt-2">{intent.error}</p>
                      )}
                    </motion.div>
                  ))}
                </AnimatePresence>
                
                {intents.length === 0 && (
                  <div className="text-center py-8 text-gray-400">
                    <motion.div
                      animate={{ y: [0, -10, 0] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <Zap className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    </motion.div>
                    <p>No intents created yet. Create your first intent to get started!</p>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}

        {/* How It Works */}
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mt-24 text-center"
        >
          <h2 className="text-3xl font-bold text-white mb-8">How Intent-Centric Applications Work</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: "1",
                title: "Connect Wallet",
                description: "Connect your wallet to interact with the intent machine"
              },
              {
                step: "2", 
                title: "Declare Intent",
                description: "Simply state what you want to achieve in natural language"
              },
              {
                step: "3",
                title: "Watch Execution", 
                description: "Anoma automatically handles cross-chain routing and execution"
              }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="glass-effect p-6 rounded-lg border border-anoma-light-gray/50 hover-lift"
                whileHover={{ y: -10 }}
              >
                <motion.div 
                  className="w-12 h-12 bg-anoma-red rounded-lg flex items-center justify-center mx-auto mb-4"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ duration: 0.2 }}
                >
                  <span className="text-white font-bold text-xl">{item.step}</span>
                </motion.div>
                <h3 className="text-white font-semibold mb-2">{item.title}</h3>
                <p className="text-gray-400">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default IntentDemo 