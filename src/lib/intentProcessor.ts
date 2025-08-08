import { ethers } from 'ethers'
import { toast } from 'react-hot-toast'
import { analytics } from './analytics'

export interface Intent {
  id: string
  type: 'swap' | 'bridge' | 'stake' | 'yield'
  description: string
  status: 'pending' | 'processing' | 'completed' | 'failed'
  chains: string[]
  timestamp: Date
  amount?: string
  fromToken?: string
  toToken?: string
  fromChain?: string
  toChain?: string
  txHash?: string
  error?: string
}

export interface TokenInfo {
  symbol: string
  address: string
  decimals: number
  chainId: number
}

export class IntentProcessor {
  private provider: ethers.BrowserProvider | null = null
  private signer: ethers.JsonRpcSigner | null = null

  constructor() {
    this.initializeProvider()
  }

  private async initializeProvider() {
    if (typeof window !== 'undefined' && (window as any).ethereum) {
      try {
        this.provider = new ethers.BrowserProvider((window as any).ethereum)
        this.signer = await this.provider.getSigner()
      } catch (error) {
        console.error('Failed to initialize provider:', error)
        analytics.trackError('provider_initialization_failed', error instanceof Error ? error.message : 'Unknown error')
      }
    }
  }

  async connectWallet(): Promise<boolean> {
    try {
      if (!this.provider) {
        await this.initializeProvider()
      }
      
      if (this.provider && this.signer) {
        const address = await this.signer.getAddress()
        
        analytics.trackWalletConnected(address)
        toast.success(`Connected: ${address.slice(0, 6)}...${address.slice(-4)}`)
        return true
      }
      return false
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to connect wallet'
      analytics.trackError('wallet_connection_failed', errorMessage)
      toast.error(errorMessage)
      return false
    }
  }

  async getBalance(chainId: number): Promise<string> {
    if (!this.signer) throw new Error('Wallet not connected')
    
    try {
      const address = await this.signer.getAddress()
      const provider = this.getProviderForChain(chainId)
      const balance = await provider.getBalance(address)
      return ethers.formatEther(balance)
    } catch (error) {
      analytics.trackError('balance_fetch_failed', error instanceof Error ? error.message : 'Unknown error')
      throw error
    }
  }

  private getProviderForChain(chainId: number): ethers.JsonRpcProvider {
    const rpcUrls = {
      1: process.env.VITE_ETHEREUM_RPC || 'https://eth-mainnet.alchemyapi.io/v2/YOUR_ALCHEMY_KEY',
      137: process.env.VITE_POLYGON_RPC || 'https://polygon-rpc.com',
      42161: process.env.VITE_ARBITRUM_RPC || 'https://arb1.arbitrum.io/rpc',
      10: process.env.VITE_OPTIMISM_RPC || 'https://mainnet.optimism.io'
    }
    
    const rpcUrl = rpcUrls[chainId as keyof typeof rpcUrls]
    if (!rpcUrl) {
      throw new Error(`No RPC URL configured for chain ID ${chainId}`)
    }
    
    return new ethers.JsonRpcProvider(rpcUrl)
  }

  private async validateTransaction(tx: any): Promise<boolean> {
    try {
      // Check if user has enough balance
      const address = await this.signer!.getAddress()
      const balance = await this.provider!.getBalance(address)
      if (balance < tx.value) {
        throw new Error('Insufficient balance')
      }

      // Estimate gas
      const gasEstimate = await this.signer!.estimateGas(tx)
      if (gasEstimate > 500000n) {
        throw new Error('Gas estimate too high')
      }

      return true
    } catch (error) {
      analytics.trackError('transaction_validation_failed', error instanceof Error ? error.message : 'Unknown error')
      throw error
    }
  }

  async processSwapIntent(intent: Intent): Promise<Intent> {
    try {
      if (!this.signer) throw new Error('Wallet not connected')
      
      // Simulate swap transaction with validation
      const tx = {
        to: '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6', // Example contract
        value: ethers.parseEther('0.001'),
        gasLimit: 21000n
      }
      
      await this.validateTransaction(tx)
      const transaction = await this.signer.sendTransaction(tx)
      const receipt = await transaction.wait()
      
      if (receipt) {
        analytics.trackIntentProcessed('swap', true, receipt.hash)
        
        return {
          ...intent,
          status: 'completed',
          txHash: receipt.hash
        }
      }
      
      throw new Error('Transaction failed')
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      analytics.trackIntentProcessed('swap', false)
      analytics.trackError('swap_intent_failed', errorMessage)
      
      return {
        ...intent,
        status: 'failed',
        error: errorMessage
      }
    }
  }

  async processBridgeIntent(intent: Intent): Promise<Intent> {
    try {
      if (!this.signer) throw new Error('Wallet not connected')
      
      // Simulate bridge transaction with validation
      const tx = {
        to: '0x3d9819210A31b4961b30EF54bE2aeD79B9c9Cd3B', // Example bridge contract
        value: ethers.parseEther('0.001'),
        gasLimit: 100000n
      }
      
      await this.validateTransaction(tx)
      const transaction = await this.signer.sendTransaction(tx)
      const receipt = await transaction.wait()
      
      if (receipt) {
        analytics.trackIntentProcessed('bridge', true, receipt.hash)
        
        return {
          ...intent,
          status: 'completed',
          txHash: receipt.hash
        }
      }
      
      throw new Error('Transaction failed')
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      analytics.trackIntentProcessed('bridge', false)
      analytics.trackError('bridge_intent_failed', errorMessage)
      
      return {
        ...intent,
        status: 'failed',
        error: errorMessage
      }
    }
  }

  async processStakeIntent(intent: Intent): Promise<Intent> {
    try {
      if (!this.signer) throw new Error('Wallet not connected')
      
      // Simulate staking transaction with validation
      const tx = {
        to: '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D', // Example staking contract
        value: ethers.parseEther('0.001'),
        gasLimit: 150000n
      }
      
      await this.validateTransaction(tx)
      const transaction = await this.signer.sendTransaction(tx)
      const receipt = await transaction.wait()
      
      if (receipt) {
        analytics.trackIntentProcessed('stake', true, receipt.hash)
        
        return {
          ...intent,
          status: 'completed',
          txHash: receipt.hash
        }
      }
      
      throw new Error('Transaction failed')
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      analytics.trackIntentProcessed('stake', false)
      analytics.trackError('stake_intent_failed', errorMessage)
      
      return {
        ...intent,
        status: 'failed',
        error: errorMessage
      }
    }
  }

  async processYieldIntent(intent: Intent): Promise<Intent> {
    try {
      if (!this.signer) throw new Error('Wallet not connected')
      
      // Simulate yield farming transaction with validation
      const tx = {
        to: '0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f', // Example yield contract
        value: ethers.parseEther('0.001'),
        gasLimit: 200000n
      }
      
      await this.validateTransaction(tx)
      const transaction = await this.signer.sendTransaction(tx)
      const receipt = await transaction.wait()
      
      if (receipt) {
        analytics.trackIntentProcessed('yield', true, receipt.hash)
        
        return {
          ...intent,
          status: 'completed',
          txHash: receipt.hash
        }
      }
      
      throw new Error('Transaction failed')
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      analytics.trackIntentProcessed('yield', false)
      analytics.trackError('yield_intent_failed', errorMessage)
      
      return {
        ...intent,
        status: 'failed',
        error: errorMessage
      }
    }
  }

  async processIntent(intent: Intent): Promise<Intent> {
    // Update to processing
    const processingIntent = { ...intent, status: 'processing' as const }
    
    try {
      let result: Intent
      
      switch (intent.type) {
        case 'swap':
          result = await this.processSwapIntent(processingIntent)
          break
        case 'bridge':
          result = await this.processBridgeIntent(processingIntent)
          break
        case 'stake':
          result = await this.processStakeIntent(processingIntent)
          break
        case 'yield':
          result = await this.processYieldIntent(processingIntent)
          break
        default:
          throw new Error('Unknown intent type')
      }
      
      if (result.status === 'completed') {
        toast.success(`Intent completed! TX: ${result.txHash?.slice(0, 10)}...`)
      } else {
        toast.error(`Intent failed: ${result.error}`)
      }
      
      return result
    } catch (error) {
      const failedIntent = {
        ...processingIntent,
        status: 'failed' as const,
        error: error instanceof Error ? error.message : 'Unknown error'
      }
      
      analytics.trackError('intent_processing_failed', failedIntent.error)
      toast.error(`Intent failed: ${failedIntent.error}`)
      return failedIntent
    }
  }
} 