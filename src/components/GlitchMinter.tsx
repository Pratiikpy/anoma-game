import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Plus, Sparkles, Loader2 } from 'lucide-react'
import { toast } from 'react-hot-toast'
import { anomaNFTManager, GLITCH_TYPES, GlitchNFT } from '../lib/anomaNFTs'
import { useAppStore } from '../lib/store'

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
      const glitch = await anomaNFTManager.mintGlitchOnChain(selectedGlitchType, walletAddress)
      toast.success(`Successfully minted ${glitch.name}!`)
      setSelectedGlitchType('')
      
      // Refresh the page to show the new glitch
      setTimeout(() => {
        window.location.reload()
      }, 1000)
    } catch (error) {
      console.error('Failed to mint glitch:', error)
      toast.error('Failed to mint Glitch. Please try again.')
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
        Mint new Glitch NFTs to trade with other users on the Anoma network.
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
              <span>Minting...</span>
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