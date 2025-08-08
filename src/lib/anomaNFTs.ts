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

// Predefined Glitch types
export const GLITCH_TYPES: Record<string, GlitchType> = {
  'swap-master': {
    id: 'swap-master',
    name: 'Swap Master',
    description: 'A glitch specialized in cross-chain token swaps',
    baseAbility: GlitchAbility.SWAP,
    rarity: GlitchRarity.RARE,
    image: '/glitches/swap-master.png',
    attributes: {
      power: 75,
      speed: 90,
      intelligence: 85,
      luck: 60
    }
  },
  'bridge-guardian': {
    id: 'bridge-guardian',
    name: 'Bridge Guardian',
    description: 'Protects and facilitates cross-chain bridges',
    baseAbility: GlitchAbility.BRIDGE,
    rarity: GlitchRarity.EPIC,
    image: '/glitches/bridge-guardian.png',
    attributes: {
      power: 90,
      speed: 70,
      intelligence: 80,
      luck: 75
    }
  },
  'stake-sentinel': {
    id: 'stake-sentinel',
    name: 'Stake Sentinel',
    description: 'Manages and optimizes staking operations',
    baseAbility: GlitchAbility.STAKE,
    rarity: GlitchRarity.COMMON,
    image: '/glitches/stake-sentinel.png',
    attributes: {
      power: 60,
      speed: 65,
      intelligence: 90,
      luck: 70
    }
  },
  'yield-harvester': {
    id: 'yield-harvester',
    name: 'Yield Harvester',
    description: 'Specializes in yield farming and optimization',
    baseAbility: GlitchAbility.YIELD,
    rarity: GlitchRarity.LEGENDARY,
    image: '/glitches/yield-harvester.png',
    attributes: {
      power: 85,
      speed: 80,
      intelligence: 95,
      luck: 90
    }
  },
  'fusion-catalyst': {
    id: 'fusion-catalyst',
    name: 'Fusion Catalyst',
    description: 'Enables fusion of multiple glitches',
    baseAbility: GlitchAbility.FUSION,
    rarity: GlitchRarity.MYTHIC,
    image: '/glitches/fusion-catalyst.png',
    attributes: {
      power: 100,
      speed: 85,
      intelligence: 100,
      luck: 95
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

  // Simulate on-chain minting
  async mintGlitchOnChain(glitchType: string, owner: string): Promise<GlitchNFT> {
    // This would interact with actual Anoma blockchain
    // For now, we simulate the minting process
    
    console.log(`Minting Glitch NFT on Anoma chain...`)
    console.log(`Type: ${glitchType}`)
    console.log(`Owner: ${owner}`)
    
    // Simulate blockchain delay
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    const glitch = await this.mintGlitch(glitchType, owner)
    
    console.log(`✅ Glitch NFT minted successfully on Anoma chain!`)
    console.log(`Token ID: ${glitch.id}`)
    console.log(`Token URI: ${glitch.tokenUri}`)
    
    return glitch
  }
}

// Export singleton instance
export const anomaNFTManager = new AnomaNFTManager() 