import { create } from 'zustand'
import { IntentProcessor, Intent } from './intentProcessor'
import { anomaClient, ChainStatus, GlitchNFT, TransactionStatus } from './anomaClient'
import { toast } from 'react-hot-toast'

interface AppState {
  // Wallet state
  isConnected: boolean
  walletAddress: string | null
  balance: string | null
  
  // Network state
  networkStatus: ChainStatus
  
  // Intent state
  intents: Intent[]
  isProcessing: boolean
  
  // NFT state (real on-chain data)
  glitches: GlitchNFT[]
  isLoadingGlitches: boolean
  
  // Transaction history
  transactionHistory: TransactionStatus[]
  
  // Actions
  connectWallet: (address?: string) => Promise<void>
  disconnectWallet: () => void
  createIntent: (intent: Omit<Intent, 'id' | 'timestamp' | 'status'>) => Promise<void>
  processIntent: (intentId: string) => Promise<void>
  clearIntents: () => void
  
  // Network actions
  connectToNetwork: () => Promise<void>
  disconnectFromNetwork: () => Promise<void>
  refreshNetworkStatus: () => Promise<void>
  
  // NFT actions
  loadUserGlitches: (address: string) => Promise<void>
  refreshGlitches: () => Promise<void>
  
  // Transaction actions
  addTransaction: (txHash: string) => void
  updateTransactionStatus: (txHash: string, status: TransactionStatus) => void
  clearTransactionHistory: () => void
  
  // Processor instance
  processor: IntentProcessor
}

export const useAppStore = create<AppState>((set, get) => ({
  // Initial state
  isConnected: false,
  walletAddress: null,
  balance: null,
  networkStatus: { status: 'disconnected' },
  intents: [],
  isProcessing: false,
  glitches: [],
  isLoadingGlitches: false,
  transactionHistory: [],
  processor: new IntentProcessor(),

  // Actions
  connectWallet: async (address?: string) => {
    if (address) {
      // Direct connection with Anoma address
      set({
        isConnected: true,
        walletAddress: address,
        balance: '0.0' // Placeholder for Anoma balance
      })
      
      // Connect to network and load glitches
      const { connectToNetwork, loadUserGlitches } = get()
      await connectToNetwork()
      await loadUserGlitches(address)
    } else {
      // Fallback to processor connection
      const { processor } = get()
      const success = await processor.connectWallet()
      
      if (success) {
        try {
          const signer = processor['signer']
          if (signer) {
            const signerAddress = await signer.getAddress()
            const balance = await processor.getBalance(1) // Ethereum mainnet
            
            set({
              isConnected: true,
              walletAddress: signerAddress,
              balance
            })
          }
        } catch (error) {
          console.error('Failed to get wallet info:', error)
        }
      }
    }
  },

  disconnectWallet: () => {
    const { disconnectFromNetwork } = get()
    disconnectFromNetwork()
    
    set({
      isConnected: false,
      walletAddress: null,
      balance: null,
      glitches: [],
      transactionHistory: []
    })
  },

  connectToNetwork: async () => {
    try {
      set({ networkStatus: { status: 'connecting' } })
      
      const chainStatus = await anomaClient.connect()
      set({ networkStatus: chainStatus })
      
      if (chainStatus.status === 'connected') {
        toast.success('Connected to Anoma testnet')
      } else if (chainStatus.status === 'error') {
        toast.error(`Network Error: ${chainStatus.error}`)
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Connection failed'
      set({ networkStatus: { status: 'error', error: errorMessage } })
      toast.error(`Network Error: ${errorMessage}`)
    }
  },

  disconnectFromNetwork: async () => {
    try {
      await anomaClient.disconnect()
      set({ networkStatus: { status: 'disconnected' } })
    } catch (error) {
      console.error('Failed to disconnect from network:', error)
    }
  },

  refreshNetworkStatus: async () => {
    const chainStatus = anomaClient.getChainStatus()
    set({ networkStatus: chainStatus })
  },

  loadUserGlitches: async (address: string) => {
    try {
      set({ isLoadingGlitches: true })
      
      const glitches = await anomaClient.queryNftBalance(address)
      set({ glitches, isLoadingGlitches: false })
      
      console.log(`Loaded ${glitches.length} glitches for address ${address}`)
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to load glitches'
      console.error('Failed to load user glitches:', errorMessage)
      set({ isLoadingGlitches: false, glitches: [] })
      toast.error(`Failed to load Glitches: ${errorMessage}`)
    }
  },

  refreshGlitches: async () => {
    const { walletAddress, loadUserGlitches } = get()
    if (walletAddress) {
      await loadUserGlitches(walletAddress)
    }
  },

  addTransaction: (txHash: string) => {
    const newTransaction: TransactionStatus = {
      hash: txHash,
      status: 'pending',
      timestamp: Date.now()
    }
    
    set(state => ({
      transactionHistory: [newTransaction, ...state.transactionHistory]
    }))
    
    console.log(`Added transaction to history: ${txHash}`)
  },

  updateTransactionStatus: (txHash: string, status: TransactionStatus) => {
    set(state => ({
      transactionHistory: state.transactionHistory.map(tx => 
        tx.hash === txHash ? status : tx
      )
    }))
    
    // Show appropriate toast based on status
    if (status.status === 'success') {
      toast.success(`Transaction ${txHash.slice(0, 8)}... successful!`)
      
      // Refresh glitches after successful transaction
      const { refreshGlitches } = get()
      refreshGlitches()
    } else if (status.status === 'failed') {
      toast.error(`Transaction ${txHash.slice(0, 8)}... failed: ${status.error || 'Unknown error'}`)
    }
  },

  clearTransactionHistory: () => {
    set({ transactionHistory: [] })
  },

  createIntent: async (intentData) => {
    const newIntent: Intent = {
      ...intentData,
      id: `intent-${Date.now()}`,
      timestamp: new Date(),
      status: 'pending'
    }

    set(state => ({
      intents: [newIntent, ...state.intents]
    }))
  },

  processIntent: async (intentId) => {
    const { processor, intents } = get()
    
    set({ isProcessing: true })
    
    const intent = intents.find(i => i.id === intentId)
    if (!intent) return

    try {
      const result = await processor.processIntent(intent)
      
      set(state => ({
        intents: state.intents.map(i => 
          i.id === intentId ? result : i
        ),
        isProcessing: false
      }))
    } catch (error) {
      console.error('Failed to process intent:', error)
      set({ isProcessing: false })
    }
  },

  clearIntents: () => {
    set({ intents: [] })
  }
})) 