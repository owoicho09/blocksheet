'use client'

import { useState } from 'react'
import Navigation from '@/components/navigation'
import HeroSection from '@/components/hero-section'
import AirdropFeed from '@/components/airdrop-feed'
import ClaimSheet from '@/components/claim-sheet'
import Footer from '@/components/footer'

export default function Home() {
  const [selectedAirdrop, setSelectedAirdrop] = useState<string | null>(null)
  const [showClaimSheet, setShowClaimSheet] = useState(false)

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navigation />
      <HeroSection />
      <AirdropFeed onSelectAirdrop={setSelectedAirdrop} onOpenClaim={() => setShowClaimSheet(true)} />
      <Footer />
      {showClaimSheet && <ClaimSheet onClose={() => setShowClaimSheet(false)} airdropId={selectedAirdrop} />}
    </div>
  )
}
