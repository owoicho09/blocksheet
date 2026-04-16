'use client'

import { useState } from 'react'
import AirdropCard from './airdrop-card'

const AIRDROPS = [
  {
    id: 'block',
    name: 'BLOCK',
    symbol: 'BLOCK',
    description: 'The foundational token powering the Blockstreet ecosystem',
    allocation: '100,000,000',
    network: 'Ethereum, BNB Chain, TRON, Avalanche, Polygon',
    status: 'LIVE',
    featured: true,
    about: 'BLOCK is the centerpiece of Blockstreet infrastructure. It powers governance, rewards, and ecosystem participation across our multichain platform. Early access is limited to verified community members.',
    eligibility: [
      'Verified wallet and KYC completion',
      'Minimum 0.5 ETH in wallet',
      'Active participation in community',
    ],
    deadline: '2026-05-15',
  },
  {
    id: 'usd1',
    name: 'USD1 Stablecoin',
    symbol: 'USD1',
    description: 'Enterprise-grade stablecoin backed by real-world assets',
    allocation: '50,000,000',
    network: 'Ethereum, Polygon, Avalanche',
    status: 'COMING_SOON',
    featured: false,
    about: 'USD1 brings institutional-grade stability to decentralized finance. Fully reserved and audited for enterprise adoption.',
    eligibility: [
      'Active Blockstreet user',
      'Wallet age over 30 days',
      'Token holding requirement',
    ],
    deadline: '2025-06-30',
  },
  {
    id: 'govern',
    name: 'Governance Token',
    symbol: 'GOVERN',
    description: 'Community governance rights for Blockstreet ecosystem decisions',
    allocation: '25,000,000',
    network: 'Ethereum, Polygon',
    status: 'ENDED',
    featured: false,
    about: 'GOVERN tokens give holders voting rights on protocol upgrades and treasury allocation decisions.',
    eligibility: [
      'BLOCK token holder',
      'Governance participation history',
    ],
    deadline: '2025-04-01',
  },
]

export default function AirdropFeed({ onSelectAirdrop, onOpenClaim }: { 
  onSelectAirdrop: (id: string) => void
  onOpenClaim: () => void 
}) {
  const [selectedId, setSelectedId] = useState<string | null>(null)

  const handleSelectAirdrop = (id: string) => {
    setSelectedId(id)
  }

  return (
    <section id="airdrop-feed" className="relative py-20 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="mb-12 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">Active Airdrops</h2>
          <p className="text-muted-foreground">Select an airdrop to learn more and claim your tokens</p>
        </div>

        <div className="space-y-6">
          {AIRDROPS.map((airdrop) => (
            <AirdropCard
              key={airdrop.id}
              airdrop={airdrop}
              isSelected={selectedId === airdrop.id}
              onSelect={handleSelectAirdrop}
              onClaim={() => {
                onSelectAirdrop(airdrop.id)
                onOpenClaim()
              }}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
