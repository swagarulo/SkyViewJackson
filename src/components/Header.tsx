'use client'
import Link from 'next/link'
import { useState } from 'react'

interface HeaderProps { phone: string }

export function Header({ phone }: HeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false)
  const navLinks = [
    { href: '/listings', label: 'Listings' },
    { href: '/sold', label: 'Sold' },
    { href: '/gallery', label: 'Gallery' },
    { href: '/affordable-homes', label: 'Affordable Homes' },
    { href: '/about', label: 'About' },
    { href: '/contact', label: 'Contact' },
  ]

  return (
    <header className="bg-[#1a2744] text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="text-2xl font-bold text-[#c9a84c]" style={{ fontFamily: 'var(--font-serif)' }}>
          Sky View Homes
        </Link>
        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map(l => (
            <Link key={l.href} href={l.href} className="text-sm font-medium hover:text-[#c9a84c] transition-colors">
              {l.label}
            </Link>
          ))}
          <a href={`tel:${phone}`} className="bg-[#c9a84c] text-[#1a2744] px-4 py-2 rounded font-semibold text-sm hover:bg-[#d4b96a] transition-colors">
            {phone}
          </a>
        </nav>
        <button className="md:hidden" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu">
          <span className="block w-6 h-0.5 bg-white mb-1" />
          <span className="block w-6 h-0.5 bg-white mb-1" />
          <span className="block w-6 h-0.5 bg-white" />
        </button>
      </div>
      {menuOpen && (
        <div className="md:hidden bg-[#111c33] px-4 pb-4">
          {navLinks.map(l => (
            <Link key={l.href} href={l.href} className="block py-2 text-sm hover:text-[#c9a84c]" onClick={() => setMenuOpen(false)}>
              {l.label}
            </Link>
          ))}
          <a href={`tel:${phone}`} className="block mt-2 text-[#c9a84c] font-semibold">{phone}</a>
        </div>
      )}
    </header>
  )
}
