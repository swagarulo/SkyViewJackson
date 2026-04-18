import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Affordable Homes | Sky View Homes',
  description: 'Quality new construction homes at accessible prices in Jackson, Tennessee.',
}

export default function AffordableHomesPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <p className="text-[#c9a84c] uppercase tracking-widest text-sm font-medium mb-2">For Every Family</p>
      <h1 className="text-5xl font-bold text-[#1a2744] mb-6" style={{ fontFamily: 'var(--font-serif)' }}>Affordable Homes Initiative</h1>
      <p className="text-xl text-gray-600 mb-10 leading-relaxed">
        At Sky View Homes, we believe everyone deserves a quality home. Our Affordable Homes Initiative offers new construction homes at accessible price points without sacrificing craftsmanship.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {[
          { title: 'Quality Build', desc: 'Same craftsmanship as our full-price homes — no corners cut.' },
          { title: 'Accessible Pricing', desc: 'Designed with working families in mind.' },
          { title: 'Jackson TN', desc: 'Located in the community we\'ve served for 20+ years.' },
        ].map(({ title, desc }) => (
          <div key={title} className="bg-gray-50 rounded-lg p-6 border-l-4 border-[#c9a84c]">
            <h3 className="font-bold text-[#1a2744] mb-2">{title}</h3>
            <p className="text-gray-600 text-sm">{desc}</p>
          </div>
        ))}
      </div>
      <div className="bg-[#1a2744] rounded-xl p-10 text-white text-center">
        <h2 className="text-3xl font-bold mb-4" style={{ fontFamily: 'var(--font-serif)' }}>Interested in Our Affordable Homes?</h2>
        <p className="text-gray-300 mb-8">Contact us to learn about current availability and financing options.</p>
        <Link href="/contact" className="inline-block bg-[#c9a84c] text-[#1a2744] px-8 py-4 rounded font-bold hover:bg-[#d4b96a] transition-colors">
          Contact Us Today
        </Link>
      </div>
    </div>
  )
}
