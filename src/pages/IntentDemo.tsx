import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { CheckCircle, Clock, Zap, Globe, Shield, AlertCircle, Gamepad2 } from 'lucide-react'
import { toast } from 'react-hot-toast'
import { useAppStore } from '../lib/store'
import { GLITCH_TYPES } from '../lib/anomaNFTs'
import GlitchMinter from '../components/GlitchMinter'

const IntentDemo: React.FC = () => {
  const { isConnected, intents, isProcessing, createIntent, processIntent, walletAddress } = useAppStore()
  const [selectedIntent, setSelectedIntent] = useState<string>('swap')
  const [amount, setAmount] = useState<string>('')
  const [fromToken, setFromToken] = useState<string>('ETH')
  const [toToken, setToToken] = useState<string>('USDC')
  const [fromChain, setFromChain] = useState<string>('Ethereum')
  
  // Glitch trading state
  const [userGlitches, setUserGlitches] = useState<any[]>([])
  const [selectedGlitchToGive, setSelectedGlitchToGive] = useState<string>('')
  const [selectedGlitchToReceive, setSelectedGlitchToReceive] = useState<string>('')

  // Load user's glitches when wallet connects
  useEffect(() => {
    if (isConnected && walletAddress) {
      // For now, we'll use an empty array since we're using real blockchain data
      setUserGlitches([])
    } else {
      setUserGlitches([])
    }
  }, [isConnected, walletAddress])

  const intentTypes = [
    {
      id: 'swap',
      title: 'Cross-Chain Swap',
      description: 'Swap tokens across different blockchains seamlessly',
      icon: <Zap className="w-6 h-6" />,
      example: `I want to swap ${amount || '1'} ${fromToken} from ${fromChain} to ${toToken} on Polygon`
    },
    {
      id: 'bridge',
      title: 'Bridge Assets',
      description: 'Bridge assets between different blockchain networks',
      icon: <Globe className="w-6 h-6" />,
      example: `I want to bridge ${amount || '1000'} ${fromToken} from ${fromChain} to Polygon`
    },
    {
      id: 'stake',
      title: 'Stake & Earn',
      description: 'Stake tokens and earn rewards across multiple chains',
      icon: <Shield className="w-6 h-6" />,
      example: `I want to stake ${amount || '500'} ${fromToken} across ${fromChain}, Polygon, and Arbitrum for maximum yield`
    },
    {
      id: 'yield',
      title: 'Yield Farming',
      description: 'Automatically find and deploy to the best yield opportunities',
      icon: <Zap className="w-6 h-6" />,
      example: `I want to earn the highest possible yield on my ${amount || '2000'} ${fromToken} across all chains`
    },
    {
      id: 'trade',
      title: 'Trade Glitches',
      description: 'Trade Glitch NFTs with other users on Anoma network',
      icon: <Gamepad2 className="w-6 h-6" />,
      example: selectedGlitchToGive && selectedGlitchToReceive 
        ? `I want to trade my Glitch for a ${GLITCH_TYPES[selectedGlitchToReceive]?.name || 'Glitch'}`
        : 'Select Glitches to trade'
    }
  ]

  const handleCreateIntent = async () => {
    if (!isConnected) {
      toast.error('Please connect your wallet first')
      return
    }

    if (selectedIntent === 'trade') {
      // Handle Glitch trading
      if (!selectedGlitchToGive || !selectedGlitchToReceive) {
        toast.error('Please select both Glitches to trade')
        return
      }

      const intentData = {
        type: 'trade' as any,
        description: `Trade ${userGlitches.find(g => g.id === selectedGlitchToGive)?.name} for ${GLITCH_TYPES[selectedGlitchToReceive]?.name}`,
        chains: ['Anoma'],
        itemToGive: selectedGlitchToGive,
        itemToReceive: selectedGlitchToReceive,
        userAddress: walletAddress || ''
      }

      await createIntent(intentData)
      toast.success('Trade intent created successfully!')
    } else {
      // Handle other intent types
      if (!amount || parseFloat(amount) <= 0) {
        toast.error('Please enter a valid amount')
        return
      }

      const selectedType = intentTypes.find(t => t.id === selectedIntent)
      if (!selectedType) return

      const intentData = {
        type: selectedIntent as any,
        description: intentTypes.find(t => t.id === selectedIntent)?.example || '',
        chains: [fromChain, 'Polygon'],
        amount: amount || '1',
        fromToken,
        toToken,
        fromChain
      }

      await createIntent(intentData)
      toast.success('Intent created successfully!')
    }
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
    <div className="min-h-screen bg-anoma-dark pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
            Intent Demo
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Experience the future of blockchain interactions with Anoma's intent-centric architecture
          </p>
        </motion.div>

        {/* Wallet Connection */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-center mb-8"
        >
          {/* WalletConnect component was removed as per the new_code */}
        </motion.div>

        {/* Glitch Minter */}
        {isConnected && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <GlitchMinter />
          </motion.div>
        )}

        {/* Intent Creation */}
        {isConnected && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-anoma-gray rounded-2xl p-8 mb-8 border border-anoma-light-gray"
          >
            <h2 className="text-2xl font-bold text-white mb-6">Create Intent</h2>
            
            {/* Intent Type Selection */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
              {intentTypes.map((type) => (
                <button
                  key={type.id}
                  onClick={() => setSelectedIntent(type.id)}
                  className={`p-4 rounded-lg border transition-all duration-300 ${
                    selectedIntent === type.id
                      ? 'border-anoma-red bg-anoma-red/20'
                      : 'border-anoma-light-gray hover:border-anoma-red'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className="text-anoma-red">{type.icon}</div>
                    <div className="text-left">
                      <h3 className="font-semibold text-white">{type.title}</h3>
                      <p className="text-sm text-gray-400">{type.description}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>

            {/* Intent Configuration */}
            <div className="space-y-6">
              {selectedIntent === 'trade' ? (
                // Glitch Trading Interface
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-white font-medium mb-2">
                      Glitch to Give
                    </label>
                    <select
                      value={selectedGlitchToGive}
                      onChange={(e) => setSelectedGlitchToGive(e.target.value)}
                      className="w-full bg-anoma-dark border border-anoma-light-gray rounded-lg px-4 py-3 text-white focus:border-anoma-red focus:outline-none"
                    >
                      <option value="">Select a Glitch to trade</option>
                      {userGlitches.map((glitch) => (
                        <option key={glitch.id} value={glitch.id}>
                          {glitch.name} (Level {glitch.level}) - {glitch.rarity}
                        </option>
                      ))}
                    </select>
                    {userGlitches.length === 0 && (
                      <p className="text-gray-400 text-sm mt-2">
                        You don't have any Glitches yet. Mint some first!
                      </p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-white font-medium mb-2">
                      Glitch to Receive
                    </label>
                    <select
                      value={selectedGlitchToReceive}
                      onChange={(e) => setSelectedGlitchToReceive(e.target.value)}
                      className="w-full bg-anoma-dark border border-anoma-light-gray rounded-lg px-4 py-3 text-white focus:border-anoma-red focus:outline-none"
                    >
                      <option value="">Select a Glitch type to receive</option>
                      {Object.entries(GLITCH_TYPES).map(([id, type]) => (
                        <option key={id} value={id}>
                          {type.name} - {type.rarity}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              ) : (
                // Traditional Intent Interface
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-white font-medium mb-2">Amount</label>
                    <input
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="0.0"
                      className="w-full bg-anoma-dark border border-anoma-light-gray rounded-lg px-4 py-3 text-white focus:border-anoma-red focus:outline-none"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-white font-medium mb-2">From Token</label>
                    <select
                      value={fromToken}
                      onChange={(e) => setFromToken(e.target.value)}
                      className="w-full bg-anoma-dark border border-anoma-light-gray rounded-lg px-4 py-3 text-white focus:border-anoma-red focus:outline-none"
                    >
                      <option value="ETH">ETH</option>
                      <option value="USDC">USDC</option>
                      <option value="USDT">USDT</option>
                      <option value="DAI">DAI</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-white font-medium mb-2">To Token</label>
                    <select
                      value={toToken}
                      onChange={(e) => setToToken(e.target.value)}
                      className="w-full bg-anoma-dark border border-anoma-light-gray rounded-lg px-4 py-3 text-white focus:border-anoma-red focus:outline-none"
                    >
                      <option value="USDC">USDC</option>
                      <option value="ETH">ETH</option>
                      <option value="USDT">USDT</option>
                      <option value="DAI">DAI</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-white font-medium mb-2">Chain</label>
                    <select
                      value={fromChain}
                      onChange={(e) => setFromChain(e.target.value)}
                      className="w-full bg-anoma-dark border border-anoma-light-gray rounded-lg px-4 py-3 text-white focus:border-anoma-red focus:outline-none"
                    >
                      <option value="Ethereum">Ethereum</option>
                      <option value="Polygon">Polygon</option>
                      <option value="Arbitrum">Arbitrum</option>
                      <option value="Optimism">Optimism</option>
                    </select>
                  </div>
                </div>
              )}

              {/* Create Intent Button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleCreateIntent}
                disabled={isProcessing}
                className="w-full bg-anoma-red text-white font-semibold py-4 rounded-lg hover:bg-anoma-red/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isProcessing ? 'Creating Intent...' : 'Create Intent'}
              </motion.button>
            </div>
          </motion.div>
        )}

        {/* Intent List */}
        {intents.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-anoma-gray rounded-2xl p-8 border border-anoma-light-gray"
          >
            <h2 className="text-2xl font-bold text-white mb-6">Your Intents</h2>
            <div className="space-y-4">
              {intents.map((intent) => (
                <motion.div
                  key={intent.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="bg-anoma-dark rounded-lg p-6 border border-anoma-light-gray"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        {getStatusIcon(intent.status)}
                        <h3 className="font-semibold text-white">{intent.description}</h3>
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-gray-400">
                        <span>Type: {intent.type}</span>
                        <span>Status: <span className={getStatusColor(intent.status)}>{intent.status}</span></span>
                        <span>Created: {intent.timestamp.toLocaleString()}</span>
                        {intent.txHash && (
                          <span>TX: {intent.txHash.slice(0, 10)}...</span>
                        )}
                      </div>
                    </div>
                    
                    {intent.status === 'pending' && (
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleProcessIntent(intent.id)}
                        disabled={isProcessing}
                        className="px-4 py-2 bg-anoma-red text-white rounded-lg hover:bg-anoma-red/80 transition-colors disabled:opacity-50"
                      >
                        {isProcessing ? 'Processing...' : 'Process'}
                      </motion.button>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}

export default IntentDemo 