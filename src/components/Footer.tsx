import Link from 'next/link'

interface FooterProps { phone: string; address: string }

export function Footer({ phone, address }: FooterProps) {
  return (
    <footer className="bg-[#1a2744] text-white mt-20">
      <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <h3 className="text-xl text-[#c9a84c] mb-3" style={{ fontFamily: 'var(--font-serif)' }}>Sky View Homes</h3>
          <p className="text-sm text-gray-300">Quality craftsmanship for over 20 years in Jackson, Tennessee.</p>
        </div>
        <div>
          <h4 className="font-semibold mb-3 text-[#c9a84c]">Quick Links</h4>
          <ul className="space-y-1 text-sm text-gray-300">
            {[['/', 'Home'], ['/listings', 'Active Listings'], ['/sold', 'Sold Homes'], ['/gallery', 'Gallery'], ['/about', 'About'], ['/contact', 'Contact']].map(([href, label]) => (
              <li key={href}><Link href={href} className="hover:text-[#c9a84c] transition-colors">{label}</Link></li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="font-semibold mb-3 text-[#c9a84c]">Contact</h4>
          <p className="text-sm text-gray-300">{address}</p>
          <a href={`tel:${phone}`} className="text-[#c9a84c] hover:text-[#d4b96a] text-sm mt-1 block">{phone}</a>
        </div>
      </div>
      <div className="border-t border-[#243358] text-center py-4 text-xs text-gray-400">
        © {new Date().getFullYear()} Sky View Homes. All rights reserved. | Realtor: Mari Acuna — Home and Farms Realty
      </div>
    </footer>
  )
}
