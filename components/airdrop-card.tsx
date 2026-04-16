'use client'

import { ChevronRight } from 'lucide-react'
import { useState } from 'react'

interface Airdrop {
  id: string
  name: string
  symbol: string
  description: string
  allocation: string
  network: string
  status: string
  featured?: boolean
  about?: string
  eligibility?: string[]
  deadline?: string
}

interface AirdropCardProps {
  airdrop: Airdrop
  isSelected: boolean
  onSelect: (id: string) => void
  onClaim: () => void
}

export default function AirdropCard({ airdrop, isSelected, onSelect, onClaim }: AirdropCardProps) {
  const [isHovered, setIsHovered] = useState(false)

  const statusConfig = {
    LIVE: { color: 'text-green-400', bg: 'bg-green-400/10', label: 'LIVE', glow: 'text-green-400' },
    COMING_SOON: { color: 'text-yellow-400', bg: 'bg-yellow-400/10', label: 'COMING SOON', glow: 'text-yellow-400' },
    ENDED: { color: 'text-red-400', bg: 'bg-red-400/10', label: 'ENDED', glow: 'text-red-400' },
  }

  const config = statusConfig[airdrop.status as keyof typeof statusConfig]

  return (
    <>
      <div
        onMouseEnter={() => {
          setIsHovered(true)
          onSelect(airdrop.id)
        }}
        onMouseLeave={() => setIsHovered(false)}
        onClick={() => onSelect(airdrop.id)}
        className={`relative group cursor-pointer transition-all duration-300 ${
          airdrop.featured 
            ? 'transform hover:scale-102' 
            : 'hover:translate-x-1'
        }`}
      >
        {/* Featured card border glow effect */}
        {airdrop.featured && (
          <div className={`absolute inset-0 rounded-xl ${isHovered ? 'animate-glow' : ''} pointer-events-none`} />
        )}

        <div
          className={`relative p-6 rounded-xl border transition-all duration-300 ${
            airdrop.featured
              ? `border-primary/50 bg-gradient-to-r from-card to-card hover:border-primary ${isHovered ? 'shadow-2xl shadow-primary/30' : ''}`
              : 'border-border bg-card hover:border-primary/50'
          } ${isSelected ? 'ring-2 ring-primary/50' : ''}`}
        >
          {/* Featured label */}
          {airdrop.featured && (
            <div className="absolute -top-3 left-6 px-3 py-1 bg-gradient-to-r from-primary to-secondary text-primary-foreground text-xs font-bold rounded-full">
              🌟 FEATURED
            </div>
          )}

          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h3 className="text-2xl font-bold mb-1">{airdrop.name}</h3>
              <p className="text-muted-foreground">{airdrop.description}</p>
            </div>
            <div className={`px-3 py-1 rounded-full text-xs font-semibold ${config.bg} ${config.color} ${airdrop.status === 'LIVE' ? 'animate-pulse-glow' : ''}`}>
              {config.label}
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 py-4 border-y border-border">
            <div>
              <p className="text-xs text-muted-foreground mb-1">Total Allocation</p>
              <p className="font-mono font-semibold">{airdrop.allocation}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">Networks</p>
              <p className="text-sm font-semibold">{airdrop.network.split(',')[0].trim()}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">Symbol</p>
              <p className="text-sm font-semibold">{airdrop.symbol}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">Deadline</p>
              <p className="text-sm font-semibold">{new Date(airdrop.deadline || '').toLocaleDateString()}</p>
            </div>
          </div>

          {/* Expanded content */}
          {isSelected && (
            <div className="space-y-4 pt-4 animate-fade-in">
              <div>
                <p className="text-sm text-muted-foreground mb-2">About</p>
                <p className="text-foreground/80">{airdrop.about}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-2">Eligibility Requirements</p>
                <ul className="space-y-2">
                  {airdrop.eligibility?.map((item, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-sm text-foreground/80">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* Action button */}
          <div className="mt-6 flex items-center justify-between">
            <span className="text-xs text-muted-foreground">
              {isSelected ? 'Selected' : 'Click to view details'}
            </span>
            <button
              onClick={(e) => {
                e.stopPropagation()
                onClaim()
              }}
              disabled={airdrop.status !== 'LIVE'}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all duration-300 ${
                airdrop.status === 'LIVE'
                  ? 'bg-gradient-to-r from-primary to-secondary text-primary-foreground hover:shadow-lg hover:shadow-primary/50 hover:-translate-y-0.5'
                  : 'bg-muted text-muted-foreground cursor-not-allowed opacity-50'
              }`}
            >
              {airdrop.status === 'LIVE' ? 'Claim Now' : airdrop.status === 'COMING_SOON' ? 'Coming Soon' : 'Ended'}
              {airdrop.status === 'LIVE' && <ChevronRight className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
