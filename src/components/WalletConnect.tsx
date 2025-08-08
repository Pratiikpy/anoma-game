import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Wallet, LogOut, Copy, ExternalLink, Wifi, WifiOff, AlertCircle } from 'lucide-react'
import { useAppStore } from '../lib/store'
import { toast } from 'react-hot-toast'

interface KeplrWindow extends Window {
  keplr?: {
    enable: (chainId: string) => Promise<void>
    getOfflineSigner: (chainId: string) => any
    getKey: (chainId: string) => Promise<{
      name: string
      pubKey: string
      address: string
      bech32Address: string
    }>
  }
}

declare const window: KeplrWindow

const ANOMA_CHAIN_ID = 'anoma-test.anoma' // Anoma testnet chain ID

const WalletConnect: React.FC = () => {
  const { 
    isConnected, 
    connectWallet, 
    disconnectWallet,
    networkStatus
  } = useAppStore()
  
  const [isLoading, setIsLoading] = useState(false)
  const [anomaAddress, setAnomaAddress] = useState<string>('')

  useEffect(() => {
    // Check if Keplr is installed
    if (window.keplr) {
      checkKeplrConnection()
    }
  }, [])

  const checkKeplrConnection = async () => {
    try {
      if (window.keplr) {
        const key = await window.keplr.getKey(ANOMA_CHAIN_ID)
        if (key) {
          setAnomaAddress(key.bech32Address)
          connectWallet(key.bech32Address)
        }
      }
    } catch (error) {
      // Keplr not connected to Anoma chain
      console.log('Keplr not connected to Anoma chain')
    }
  }

  const handleConnect = async () => {
    setIsLoading(true)
    try {
      if (!window.keplr) {
        toast.error('Keplr wallet not found. Please install Keplr extension.')
        window.open('https://keplr.app/', '_blank')
        return
      }

      // Enable Keplr for Anoma chain
      await window.keplr.enable(ANOMA_CHAIN_ID)
      
      // Get the user's key
      const key = await window.keplr.getKey(ANOMA_CHAIN_ID)
      
      if (key) {
        setAnomaAddress(key.bech32Address)
        connectWallet(key.bech32Address)
        toast.success(`Connected to Anoma network: ${key.bech32Address.slice(0, 10)}...`)
      }
    } catch (error) {
      console.error('Failed to connect Keplr wallet:', error)
      toast.error('Failed to connect wallet. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDisconnect = () => {
    disconnectWallet()
    setAnomaAddress('')
    toast.success('Wallet disconnected from Anoma network')
  }

  const copyAddress = () => {
    if (anomaAddress) {
      navigator.clipboard.writeText(anomaAddress)
      toast.success('Anoma address copied to clipboard')
    }
  }

  const viewOnExplorer = () => {
    if (anomaAddress) {
      // Anoma explorer URL (replace with actual explorer when available)
      window.open(`https://explorer.anoma.network/address/${anomaAddress}`, '_blank')
    }
  }

  const getNetworkStatusIcon = () => {
    switch (networkStatus.status) {
      case 'connected':
        return <Wifi className="w-4 h-4 text-green-500" />
      case 'connecting':
        return <div className="w-4 h-4 border-2 border-anoma-red border-t-transparent rounded-full animate-spin" />
      case 'error':
        return <AlertCircle className="w-4 h-4 text-red-500" />
      default:
        return <WifiOff className="w-4 h-4 text-gray-500" />
    }
  }

  const getNetworkStatusText = () => {
    switch (networkStatus.status) {
      case 'connected':
        return 'Connected'
      case 'connecting':
        return 'Connecting...'
      case 'error':
        return 'Network Error'
      default:
        return 'Disconnected'
    }
  }

  const getNetworkStatusColor = () => {
    switch (networkStatus.status) {
      case 'connected':
        return 'text-green-500'
      case 'connecting':
        return 'text-anoma-red'
      case 'error':
        return 'text-red-500'
      default:
        return 'text-gray-500'
    }
  }

  if (isConnected && anomaAddress) {
    return (
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center space-x-4"
      >
        {/* Network Status */}
        <div className="flex items-center space-x-2 bg-anoma-gray px-3 py-2 rounded-lg border border-anoma-light-gray">
          {getNetworkStatusIcon()}
          <span className={`text-sm font-medium ${getNetworkStatusColor()}`}>
            {getNetworkStatusText()}
          </span>
        </div>

        {/* Wallet Info */}
        <div className="bg-anoma-gray px-4 py-2 rounded-lg border border-anoma-light-gray">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-white text-sm">
              {anomaAddress.slice(0, 10)}...{anomaAddress.slice(-8)}
            </span>
          </div>
          <div className="text-gray-400 text-xs">
            Anoma Network
          </div>
        </div>
        
        <div className="flex space-x-2">
          <button
            onClick={copyAddress}
            className="p-2 bg-anoma-gray rounded-lg border border-anoma-light-gray hover:border-anoma-red transition-colors"
            title="Copy Anoma address"
          >
            <Copy className="w-4 h-4 text-white" />
          </button>
          
          <button
            onClick={viewOnExplorer}
            className="p-2 bg-anoma-gray rounded-lg border border-anoma-light-gray hover:border-anoma-red transition-colors"
            title="View on Anoma Explorer"
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
      disabled={isLoading}
      className="flex items-center space-x-2 px-4 py-2 bg-anoma-red text-white font-semibold rounded-lg hover:bg-anoma-red/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <Wallet className="w-5 h-5" />
      <span>{isLoading ? 'Connecting...' : 'Connect Keplr Wallet'}</span>
    </motion.button>
  )
}

export default WalletConnect 