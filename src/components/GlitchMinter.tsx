import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Plus, Sparkles, Loader2 } from 'lucide-react'
import { toast } from 'react-hot-toast'
import { GLITCH_TYPES } from '../lib/anomaNFTs'
import { useAppStore } from '../lib/store'
import { IntentProcessor } from '../lib/intentProcessor'

const GlitchMinter: React.FC = () => {
  const { isConnected, walletAddress } = useAppStore()
  const [selectedGlitchType, setSelectedGlitchType] = useState<string>('')
  const [isMinting, setIsMinting] = useState(false)

  const handleMintGlitch = async () => {
    if (!isConnected || !walletAddress) {
      toast.error('Please connect your wallet first')
      return
    }

    if (!selectedGlitchType) {
      toast.error('Please select a Glitch type to mint')
      return
    }

    setIsMinting(true)
    try {
      // Use the real minting function from IntentProcessor
      const processor = new IntentProcessor()
      const txHash = await processor.mintGlitchOnChain(selectedGlitchType, walletAddress)
      
      toast.success(`Successfully minted ${GLITCH_TYPES[selectedGlitchType]?.name}! Transaction: ${txHash.slice(0, 8)}...`)
      setSelectedGlitchType('')
      
      // Refresh glitches after successful minting
      const { refreshGlitches } = useAppStore.getState()
      setTimeout(() => {
        refreshGlitches()
      }, 2000) // Wait 2 seconds for transaction to be processed
      
    } catch (error) {
      console.error('Failed to mint glitch:', error)
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      
      if (errorMessage.includes('user rejected')) {
        toast.error('Minting cancelled by user')
      } else if (errorMessage.includes('network')) {
        toast.error('Network error. Please check your connection and try again.')
      } else {
        toast.error(`Failed to mint Glitch: ${errorMessage}`)
      }
    } finally {
      setIsMinting(false)
    }
  }

  if (!isConnected) {
    return null
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-anoma-gray rounded-2xl p-6 border border-anoma-light-gray"
    >
      <div className="flex items-center space-x-2 mb-4">
        <Sparkles className="w-5 h-5 text-anoma-red" />
        <h3 className="text-lg font-semibold text-white">Mint Glitches</h3>
      </div>
      
      <p className="text-gray-400 text-sm mb-4">
        Mint new Glitch NFTs on the Anoma blockchain. Each mint requires a transaction signature.
      </p>

      <div className="space-y-4">
        <div>
          <label className="block text-white font-medium mb-2">
            Select Glitch Type
          </label>
          <select
            value={selectedGlitchType}
            onChange={(e) => setSelectedGlitchType(e.target.value)}
            className="w-full bg-anoma-dark border border-anoma-light-gray rounded-lg px-4 py-3 text-white focus:border-anoma-red focus:outline-none"
          >
            <option value="">Choose a Glitch type to mint</option>
            {Object.entries(GLITCH_TYPES).map(([id, type]) => (
              <option key={id} value={id}>
                {type.name} - {type.rarity} (Power: {type.attributes.power})
              </option>
            ))}
          </select>
        </div>

        {selectedGlitchType && (
          <div className="bg-anoma-dark p-4 rounded-lg border border-anoma-light-gray">
            <h4 className="text-white font-medium mb-2">
              {GLITCH_TYPES[selectedGlitchType]?.name}
            </h4>
            <p className="text-gray-400 text-sm mb-3">
              {GLITCH_TYPES[selectedGlitchType]?.description}
            </p>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">Power:</span>
                <span className="text-white">{GLITCH_TYPES[selectedGlitchType]?.attributes.power}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Speed:</span>
                <span className="text-white">{GLITCH_TYPES[selectedGlitchType]?.attributes.speed}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Intelligence:</span>
                <span className="text-white">{GLITCH_TYPES[selectedGlitchType]?.attributes.intelligence}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Luck:</span>
                <span className="text-white">{GLITCH_TYPES[selectedGlitchType]?.attributes.luck}</span>
              </div>
            </div>
          </div>
        )}

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleMintGlitch}
          disabled={isMinting || !selectedGlitchType}
          className="w-full bg-anoma-red text-white font-semibold py-3 rounded-lg hover:bg-anoma-red/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
        >
          {isMinting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Minting on Anoma...</span>
            </>
          ) : (
            <>
              <Plus className="w-4 h-4" />
              <span>Mint Glitch</span>
            </>
          )}
        </motion.button>
      </div>
    </motion.div>
  )
}

export default GlitchMinter 