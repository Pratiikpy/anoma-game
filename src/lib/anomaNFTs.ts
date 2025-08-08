import { anomaClient } from './anomaClient'

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

export interface GlitchNFT {
  id: string
  name: string
  description: string
  image: string
  ability: GlitchAbility
  rarity: GlitchRarity
  level: number
  owner: string
  mintedAt: Date
  tokenUri?: string
}

export enum GlitchAbility {
  SWAP = 'swap',
  BRIDGE = 'bridge',
  STAKE = 'stake',
  YIELD = 'yield',
  FUSION = 'fusion',
  EVOLUTION = 'evolution'
}

export enum GlitchRarity {
  COMMON = 'common',
  RARE = 'rare',
  EPIC = 'epic',
  LEGENDARY = 'legendary',
  MYTHIC = 'mythic'
}

export interface GlitchType {
  id: string
  name: string
  description: string
  baseAbility: GlitchAbility
  rarity: GlitchRarity
  image: string
  attributes: {
    power: number
    speed: number
    intelligence: number
    luck: number
  }
}

export const GLITCH_TYPES: Record<string, GlitchType> = {
  'swap-glitch': {
    id: 'swap-glitch',
    name: 'Swap Glitch',
    description: 'A glitch that can swap tokens across different chains',
    baseAbility: GlitchAbility.SWAP,
    rarity: GlitchRarity.COMMON,
    image: '/glitches/swap-glitch.png',
    attributes: {
      power: 50,
      speed: 80,
      intelligence: 60,
      luck: 40
    }
  },
  'bridge-glitch': {
    id: 'bridge-glitch',
    name: 'Bridge Glitch',
    description: 'A glitch that can bridge assets between networks',
    baseAbility: GlitchAbility.BRIDGE,
    rarity: GlitchRarity.RARE,
    image: '/glitches/bridge-glitch.png',
    attributes: {
      power: 70,
      speed: 40,
      intelligence: 90,
      luck: 30
    }
  },
  'stake-glitch': {
    id: 'stake-glitch',
    name: 'Stake Glitch',
    description: 'A glitch that can stake tokens for rewards',
    baseAbility: GlitchAbility.STAKE,
    rarity: GlitchRarity.EPIC,
    image: '/glitches/stake-glitch.png',
    attributes: {
      power: 60,
      speed: 30,
      intelligence: 80,
      luck: 70
    }
  },
  'yield-glitch': {
    id: 'yield-glitch',
    name: 'Yield Glitch',
    description: 'A glitch that can generate yield from DeFi protocols',
    baseAbility: GlitchAbility.YIELD,
    rarity: GlitchRarity.LEGENDARY,
    image: '/glitches/yield-glitch.png',
    attributes: {
      power: 40,
      speed: 60,
      intelligence: 95,
      luck: 85
    }
  },
  'fusion-glitch': {
    id: 'fusion-glitch',
    name: 'Fusion Glitch',
    description: 'A glitch that can fuse with other glitches',
    baseAbility: GlitchAbility.FUSION,
    rarity: GlitchRarity.MYTHIC,
    image: '/glitches/fusion-glitch.png',
    attributes: {
      power: 90,
      speed: 70,
      intelligence: 85,
      luck: 95
    }
  },
  'evolution-glitch': {
    id: 'evolution-glitch',
    name: 'Evolution Glitch',
    description: 'A glitch that can evolve into more powerful forms',
    baseAbility: GlitchAbility.EVOLUTION,
    rarity: GlitchRarity.MYTHIC,
    image: '/glitches/evolution-glitch.png',
    attributes: {
      power: 85,
      speed: 90,
      intelligence: 75,
      luck: 80
    }
  }
}

export class AnomaNFTManager {
  private glitches: Map<string, GlitchNFT> = new Map()

  constructor() {
    this.loadGlitches()
  }

  private loadGlitches() {
    // Load from localStorage or initialize with sample data
    const stored = localStorage.getItem('anoma-glitches')
    if (stored) {
      const parsed = JSON.parse(stored)
      this.glitches = new Map(Object.entries(parsed))
    }
  }

  private saveGlitches() {
    const obj = Object.fromEntries(this.glitches)
    localStorage.setItem('anoma-glitches', JSON.stringify(obj))
  }

  async mintGlitch(glitchType: string, owner: string): Promise<GlitchNFT> {
    const type = GLITCH_TYPES[glitchType]
    if (!type) {
      throw new Error(`Unknown glitch type: ${glitchType}`)
    }

    const glitch: GlitchNFT = {
      id: `glitch-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name: type.name,
      description: type.description,
      image: type.image,
      ability: type.baseAbility,
      rarity: type.rarity,
      level: 1,
      owner,
      mintedAt: new Date(),
      tokenUri: `ipfs://glitch-${glitchType}-${Date.now()}`
    }

    this.glitches.set(glitch.id, glitch)
    this.saveGlitches()

    console.log(`Minted new Glitch NFT:`, glitch)
    return glitch
  }

  getGlitchesByOwner(owner: string): GlitchNFT[] {
    return Array.from(this.glitches.values()).filter(glitch => glitch.owner === owner)
  }

  getGlitchById(id: string): GlitchNFT | undefined {
    return this.glitches.get(id)
  }

  getAllGlitches(): GlitchNFT[] {
    return Array.from(this.glitches.values())
  }

  transferGlitch(glitchId: string, fromOwner: string, toOwner: string): boolean {
    const glitch = this.glitches.get(glitchId)
    if (!glitch || glitch.owner !== fromOwner) {
      return false
    }

    glitch.owner = toOwner
    this.glitches.set(glitchId, glitch)
    this.saveGlitches()
    return true
  }

  upgradeGlitch(glitchId: string, owner: string): boolean {
    const glitch = this.glitches.get(glitchId)
    if (!glitch || glitch.owner !== owner) {
      return false
    }

    glitch.level += 1
    this.glitches.set(glitchId, glitch)
    this.saveGlitches()
    return true
  }

  // Real on-chain minting using Anoma blockchain
  async mintGlitchOnChain(glitchType: string, owner: string): Promise<GlitchNFT> {
    try {
      // Check if we're connected to Anoma network
      if (!anomaClient.isNetworkConnected()) {
        throw new Error('Not connected to Anoma network')
      }

      // Create the mint transaction payload
      const mintPayload = {
        type: 'anoma/MintGlitch',
        value: {
          glitch_type: glitchType,
          owner: owner,
          timestamp: Date.now().toString()
        }
      }

      // Get the offline signer from Keplr
      if (!window.keplr) {
        throw new Error('Keplr wallet not found')
      }

      await window.keplr.enable('anoma-test.anoma')
      const offlineSigner = window.keplr.getOfflineSigner('anoma-test.anoma')

      // Sign the mint transaction
      const signature = await offlineSigner.signAmino(
        owner,
        {
          chain_id: 'anoma-test.anoma',
          account_number: '0',
          sequence: '0',
          fee: {
            amount: [],
            gas: '150000'
          },
          msgs: [mintPayload],
          memo: `Mint Glitch: ${glitchType}`
        }
      )

      // Create signed intent object
      const signedIntent = {
        intent: mintPayload,
        signature: signature.signature,
        publicKey: signature.pub_key.value,
        address: owner
      }

      // Broadcast to Anoma network
      const txHash = await anomaClient.broadcastSignedIntent(signedIntent)
      
      console.log(`✅ Glitch NFT minted successfully on Anoma chain!`)
      console.log(`Transaction Hash: ${txHash}`)
      console.log(`Type: ${glitchType}`)
      console.log(`Owner: ${owner}`)

      // Create the local glitch object
      const glitch = await this.mintGlitch(glitchType, owner)
      
      // Update the glitch with the transaction hash
      glitch.tokenUri = `anoma://glitch-${glitchType}-${txHash}`
      this.glitches.set(glitch.id, glitch)
      this.saveGlitches()

      return glitch
    } catch (error) {
      console.error('Failed to mint Glitch NFT on-chain:', error)
      throw error
    }
  }
}

// Export singleton instance
export const anomaNFTManager = new AnomaNFTManager() 