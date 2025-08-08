import React from 'react'
import { motion } from 'framer-motion'
import { Wallet, LogOut, Copy, ExternalLink } from 'lucide-react'
import { useAppStore } from '../lib/store'
import { toast } from 'react-hot-toast'

const WalletConnect: React.FC = () => {
  const { isConnected, walletAddress, balance, connectWallet, disconnectWallet } = useAppStore()

  const handleConnect = async () => {
    await connectWallet()
  }

  const handleDisconnect = () => {
    disconnectWallet()
    toast.success('Wallet disconnected')
  }

  const copyAddress = () => {
    if (walletAddress) {
      navigator.clipboard.writeText(walletAddress)
      toast.success('Address copied to clipboard')
    }
  }

  const viewOnExplorer = () => {
    if (walletAddress) {
      window.open(`https://etherscan.io/address/${walletAddress}`, '_blank')
    }
  }

  if (isConnected) {
    return (
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center space-x-4"
      >
        <div className="bg-anoma-gray px-4 py-2 rounded-lg border border-anoma-light-gray">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-white text-sm">
              {walletAddress?.slice(0, 6)}...{walletAddress?.slice(-4)}
            </span>
          </div>
          {balance && (
            <div className="text-gray-400 text-xs">
              {parseFloat(balance).toFixed(4)} ETH
            </div>
          )}
        </div>
        
        <div className="flex space-x-2">
          <button
            onClick={copyAddress}
            className="p-2 bg-anoma-gray rounded-lg border border-anoma-light-gray hover:border-anoma-red transition-colors"
            title="Copy address"
          >
            <Copy className="w-4 h-4 text-white" />
          </button>
          
          <button
            onClick={viewOnExplorer}
            className="p-2 bg-anoma-gray rounded-lg border border-anoma-light-gray hover:border-anoma-red transition-colors"
            title="View on Etherscan"
          >
            <ExternalLink className="w-4 h-4 text-white" />
          </button>
          
          <button
            onClick={handleDisconnect}
            className="p-2 bg-anoma-gray rounded-lg border border-anoma-light-gray hover:border-red-500 transition-colors"
            title="Disconnect wallet"
          >
            <LogOut className="w-4 h-4 text-white" />
          </button>
        </div>
      </motion.div>
    )
  }

  return (
    <motion.button
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      onClick={handleConnect}
      className="flex items-center space-x-2 px-4 py-2 bg-anoma-red text-white font-semibold rounded-lg hover:bg-anoma-red/80 transition-colors"
    >
      <Wallet className="w-5 h-5" />
      <span>Connect Wallet</span>
    </motion.button>
  )
}

export default WalletConnect 