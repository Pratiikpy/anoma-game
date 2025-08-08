import { create } from 'zustand'
import { IntentProcessor, Intent } from './intentProcessor'

interface AppState {
  // Wallet state
  isConnected: boolean
  walletAddress: string | null
  balance: string | null
  
  // Intent state
  intents: Intent[]
  isProcessing: boolean
  
  // Actions
  connectWallet: (address?: string) => Promise<void>
  disconnectWallet: () => void
  createIntent: (intent: Omit<Intent, 'id' | 'timestamp' | 'status'>) => Promise<void>
  processIntent: (intentId: string) => Promise<void>
  clearIntents: () => void
  
  // Processor instance
  processor: IntentProcessor
}

export const useAppStore = create<AppState>((set, get) => ({
  // Initial state
  isConnected: false,
  walletAddress: null,
  balance: null,
  intents: [],
  isProcessing: false,
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
    set({
      isConnected: false,
      walletAddress: null,
      balance: null
    })
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