export interface ChainStatus {
  status: 'connected' | 'disconnected' | 'connecting' | 'error'
  blockHeight?: number
  chainId?: string
  error?: string
}

export interface GlitchNFT {
  id: string
  name: string
  description: string
  image: string
  ability: string
  rarity: string
  level: number
  owner: string
  mintedAt: Date
  tokenUri?: string
}

export interface TransactionStatus {
  hash: string
  status: 'pending' | 'success' | 'failed'
  blockHeight?: number
  error?: string
  timestamp: number
}

export interface SignedIntent {
  intent: any
  signature: string
  publicKey: string
  address: string
}

class AnomaClient {
  private rpcEndpoint: string
  private isConnected: boolean = false
  private connectionStatus: ChainStatus = { status: 'disconnected' }
  private reconnectAttempts: number = 0
  private maxReconnectAttempts: number = 3

  constructor() {
    this.rpcEndpoint = process.env.VITE_ANOMA_RPC_ENDPOINT || 'https://testnet.anoma.network'
  }

  async connect(): Promise<ChainStatus> {
    if (this.isConnected) {
      return this.connectionStatus
    }

    this.connectionStatus = { status: 'connecting' }
    
    try {
      // Test connection to Anoma testnet
      const response = await fetch(`${this.rpcEndpoint}/status`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        signal: AbortSignal.timeout(10000) // 10 second timeout
      })

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const statusData = await response.json()
      
      this.isConnected = true
      this.connectionStatus = {
        status: 'connected',
        blockHeight: statusData.sync_info?.latest_block_height,
        chainId: statusData.node_info?.network || 'anoma-test.anoma'
      }

      this.reconnectAttempts = 0
      console.log('✅ Connected to Anoma testnet:', this.connectionStatus)
      
      return this.connectionStatus
    } catch (error) {
      this.isConnected = false
      const errorMessage = error instanceof Error ? error.message : 'Unknown connection error'
      
      this.connectionStatus = {
        status: 'error',
        error: errorMessage
      }

      console.error('❌ Failed to connect to Anoma testnet:', errorMessage)
      
      // Attempt reconnection if under max attempts
      if (this.reconnectAttempts < this.maxReconnectAttempts) {
        this.reconnectAttempts++
        console.log(`🔄 Reconnection attempt ${this.reconnectAttempts}/${this.maxReconnectAttempts}`)
        
        setTimeout(() => {
          this.connect()
        }, 5000 * this.reconnectAttempts) // Exponential backoff
      }
      
      return this.connectionStatus
    }
  }

  async disconnect(): Promise<void> {
    this.isConnected = false
    this.connectionStatus = { status: 'disconnected' }
    this.reconnectAttempts = 0
    console.log('🔌 Disconnected from Anoma testnet')
  }

  getChainStatus(): ChainStatus {
    return this.connectionStatus
  }

  async broadcastSignedIntent(signedIntent: SignedIntent): Promise<string> {
    if (!this.isConnected) {
      throw new Error('Not connected to Anoma network')
    }

    try {
      const response = await fetch(`${this.rpcEndpoint}/broadcast_tx_async`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tx: signedIntent.intent,
          signature: signedIntent.signature,
          public_key: signedIntent.publicKey,
          address: signedIntent.address
        }),
        signal: AbortSignal.timeout(30000) // 30 second timeout
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`)
      }

      const result = await response.json()
      const txHash = result.hash || result.tx_hash

      if (!txHash) {
        throw new Error('No transaction hash returned from broadcast')
      }

      console.log('✅ Intent broadcast successful:', txHash)
      return txHash
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Broadcast failed'
      console.error('❌ Failed to broadcast intent:', errorMessage)
      throw new Error(errorMessage)
    }
  }

  async queryTxStatus(txHash: string): Promise<TransactionStatus> {
    if (!this.isConnected) {
      throw new Error('Not connected to Anoma network')
    }

    try {
      const response = await fetch(`${this.rpcEndpoint}/tx?hash=0x${txHash}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        signal: AbortSignal.timeout(10000) // 10 second timeout
      })

      if (!response.ok) {
        if (response.status === 404) {
          // Transaction not found, still pending
          return {
            hash: txHash,
            status: 'pending',
            timestamp: Date.now()
          }
        }
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const txData = await response.json()
      
      // Parse transaction status based on Anoma's response format
      let status: 'pending' | 'success' | 'failed' = 'pending'
      let error: string | undefined

      if (txData.tx_result?.code === 0) {
        status = 'success'
      } else if (txData.tx_result?.code) {
        status = 'failed'
        error = txData.tx_result?.log || `Transaction failed with code ${txData.tx_result.code}`
      }

      const result: TransactionStatus = {
        hash: txHash,
        status,
        blockHeight: txData.height,
        timestamp: Date.now()
      }

      if (error) {
        result.error = error
      }

      console.log(`📊 Transaction ${txHash} status:`, status)
      return result
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Query failed'
      console.error('❌ Failed to query transaction status:', errorMessage)
      
      // Return pending status if query fails (transaction might still be processing)
      return {
        hash: txHash,
        status: 'pending',
        timestamp: Date.now()
      }
    }
  }

  async queryNftBalance(address: string): Promise<GlitchNFT[]> {
    if (!this.isConnected) {
      throw new Error('Not connected to Anoma network')
    }

    try {
      const response = await fetch(`${this.rpcEndpoint}/abci_query?path="/custom/nft/balance/${address}"`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        signal: AbortSignal.timeout(15000) // 15 second timeout
      })

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const data = await response.json()
      
      // Parse NFT data from Anoma's response format
      let nfts: GlitchNFT[] = []
      
      try {
        const nftData = JSON.parse(data.result?.response?.value || '[]')
        nfts = nftData.map((nft: any) => ({
          id: nft.id || nft.token_id,
          name: nft.name || nft.metadata?.name || 'Unknown Glitch',
          description: nft.description || nft.metadata?.description || '',
          image: nft.image || nft.metadata?.image || '/glitches/default.png',
          ability: nft.ability || nft.metadata?.ability || 'unknown',
          rarity: nft.rarity || nft.metadata?.rarity || 'common',
          level: nft.level || nft.metadata?.level || 1,
          owner: nft.owner || address,
          mintedAt: new Date(nft.minted_at || nft.created_at || Date.now()),
          tokenUri: nft.token_uri || nft.metadata?.token_uri
        }))
      } catch (parseError) {
        console.warn('Failed to parse NFT data, returning empty array:', parseError)
        nfts = []
      }

      console.log(`🎮 Found ${nfts.length} Glitch NFTs for address ${address}`)
      return nfts
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Query failed'
      console.error('❌ Failed to query NFT balance:', errorMessage)
      
      // Return empty array if query fails
      return []
    }
  }

  // Helper method to check if we're connected
  isNetworkConnected(): boolean {
    return this.isConnected && this.connectionStatus.status === 'connected'
  }

  // Helper method to get the current RPC endpoint
  getRpcEndpoint(): string {
    return this.rpcEndpoint
  }
}

// Export singleton instance
export const anomaClient = new AnomaClient() 