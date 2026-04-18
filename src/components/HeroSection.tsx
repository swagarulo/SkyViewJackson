import Link from 'next/link'

interface HeroProps { headline: string; subtext: string; phone: string }

export function HeroSection({ headline, subtext, phone }: HeroProps) {
  return (
    <section className="relative bg-[#1a2744] min-h-[85vh] flex items-center">
      <div className="absolute inset-0 bg-[url('/hero-bg.jpg')] bg-cover bg-center opacity-30" />
      <div className="relative max-w-7xl mx-auto px-4 py-20 text-white">
        <p className="text-[#c9a84c] uppercase tracking-widest text-sm font-medium mb-4">Jackson, Tennessee</p>
        <h1 className="text-5xl md:text-7xl font-bold leading-tight mb-6 max-w-3xl" style={{ fontFamily: 'var(--font-serif)' }}>
          {headline || 'Quality Homes Built to Last'}
        </h1>
        <p className="text-xl text-gray-200 mb-10 max-w-xl">
          {subtext || 'New construction homes in Jackson, TN with over 20 years of craftsmanship.'}
        </p>
        <div className="flex flex-wrap gap-4">
          <Link href="/listings" className="bg-[#c9a84c] text-[#1a2744] px-8 py-4 rounded font-bold text-lg hover:bg-[#d4b96a] transition-colors">
            View Listings
          </Link>
          <a href={`tel:${phone}`} className="border-2 border-white text-white px-8 py-4 rounded font-bold text-lg hover:bg-white hover:text-[#1a2744] transition-colors">
            Contact Mari
          </a>
        </div>
      </div>
    </section>
  )
}
