import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: 'Airdrop Hub - Web3 Airdrop Platform | Claim Tokens',
  description: 'Access exclusive token airdrops on Airdrop Hub. Claim your tokens and participate in the future of decentralized finance with enterprise-grade infrastructure.',
  generator: 'Airdrop Hub',
  metadataBase: new URL('https://blockstreet.xyz'),
  openGraph: {
    title: 'Airdrop Hub - Web3 Airdrop Platform',
    description: 'Exclusive early access to token and curated airdrops',
    url: 'https://blockstreet.xyz',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark bg-background">
      <body className="font-sans antialiased">
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
