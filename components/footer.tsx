'use client'

import { Github, Mail, ExternalLink } from 'lucide-react'
import Link from 'next/link'

const SOCIAL_LINKS = [
  {
    name: 'X / Twitter',
    url: 'https://x.com/BlockstreetXYZ',
    icon: 'X',
    description: 'Follow for updates',
  },
  {
    name: 'Discord',
    url: 'https://discord.gg/blockstreetxyz',
    icon: 'Discord',
    description: 'Join community',
  },
  {
    name: 'LinkedIn',
    url: 'https://www.linkedin.com/company/blockstreetxyz',
    icon: 'LinkedIn',
    description: 'Company news',
  },
  {
    name: 'Email',
    url: 'mailto:admin@blockstreet.xyz',
    icon: 'Mail',
    description: 'Contact us',
  },
]

export default function Footer() {
  return (
    <footer className="relative border-t border-border bg-background/50 backdrop-blur">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-2 gap-12 mb-12">
          {/* Brand Section */}
          <div className="space-y-4">
            <h3 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              BLOCK
            </h3>
            <p className="text-muted-foreground max-w-md">
              Building enterprise-grade infrastructure for Web3. Bringing public-market discipline to blockchain execution.
            </p>
            <div className="pt-4">
              <p className="text-sm text-muted-foreground mb-3 font-semibold">Headquarters</p>
              <p className="text-sm text-foreground/80">
                701 South Carson Street, Ste 200<br />
                Carson City, NV 89701
              </p>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="font-semibold">Platform</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">About</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Security</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Documentation</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Contact</a></li>
            </ul>
          </div>
        </div>

        {/* Social Links Section */}
        <div className="py-8 border-t border-border">
          <h4 className="font-semibold mb-6">Connect With Us</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {SOCIAL_LINKS.map((link) => (
              <a
                key={link.name}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative p-4 border border-border rounded-lg bg-card hover:bg-card/80 transition-all duration-300 hover:border-primary/50"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="relative">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
                      {link.icon === 'Mail' && <Mail className="w-4 h-4 text-primary" />}
                      {link.icon === 'X' && (
                        <svg className="w-4 h-4 text-primary fill-current" viewBox="0 0 24 24">
                          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24h-6.514l-5.106-6.676L2.306 21.75H-0.424v-3.308l7.227-8.26L-0.424 2.25h6.514l5.106 6.676L21.75 2.25h3.494z" />
                        </svg>
                      )}
                      {link.icon === 'Discord' && (
                        <svg className="w-4 h-4 text-primary fill-current" viewBox="0 0 24 24">
                          <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.211.375-.444.864-.607 1.25a18.27 18.27 0 0 0-5.487 0c-.163-.386-.396-.875-.607-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.056a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.975 14.975 0 0 0 1.293-2.1a.07.07 0 0 0-.038-.098a13.11 13.11 0 0 1-1.872-.892a.072.072 0 0 1-.008-.119c.126-.094.252-.192.372-.291a.075.075 0 0 1 .078-.01c3.928 1.793 8.18 1.793 12.062 0a.075.075 0 0 1 .079.009c.12.099.246.198.373.292a.072.072 0 0 1-.007.119a12.991 12.991 0 0 1-1.873.892a.07.07 0 0 0-.037.099a14.972 14.972 0 0 0 1.293 2.099a.078.078 0 0 0 .084.028a19.963 19.963 0 0 0 6.002-3.03a.079.079 0 0 0 .033-.056c.362-4.92-.591-9.454-2.506-13.762a.061.061 0 0 0-.031-.03" />
                        </svg>
                      )}
                      {link.icon === 'LinkedIn' && (
                        <svg className="w-4 h-4 text-primary fill-current" viewBox="0 0 24 24">
                          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.474-2.236-1.666-2.236-1.228 0-1.846.831-2.15 1.633-.111.271-.139.649-.139 1.029v5.143h-3.554s.048-8.349 0-9.213h3.554v1.305c-.009.014-.021.033-.033.047h.033v-.047c.418-.645 1.163-1.565 2.828-1.565 2.065 0 3.61 1.349 3.61 4.25v5.223zM5.337 8.855c-1.144 0-1.915-.759-1.915-1.71 0-.959.768-1.71 1.959-1.71 1.188 0 1.914.751 1.938 1.71 0 .951-.75 1.71-1.982 1.71zm-1.6 11.597h3.2V9.539H3.737v10.913zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                        </svg>
                      )}
                    </div>
                    <div>
                      <h5 className="font-semibold text-sm">{link.name}</h5>
                      <p className="text-xs text-muted-foreground">{link.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                      Visit
                    </span>
                    <ExternalLink className="w-3 h-3 text-primary opacity-0 group-hover:opacity-100 transition-opacity transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>

        {/* Bottom */}
        <div className="pt-8 border-t border-border flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
          <p>© 2026 Block. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-primary transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-primary transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
