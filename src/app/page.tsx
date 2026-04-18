import { HeroSection } from '@/components/HeroSection'
import { ListingCard } from '@/components/ListingCard'
import { TestimonialCard } from '@/components/TestimonialCard'
import { getFeaturedListings, getTestimonials, getSiteSettings } from '@/sanity/queries'
import Link from 'next/link'

export default async function HomePage() {
  const [settings, featured, testimonials] = await Promise.all([
    getSiteSettings().catch(() => null),
    getFeaturedListings().catch(() => []),
    getTestimonials().catch(() => []),
  ])

  return (
    <>
      <HeroSection
        headline={settings?.heroHeadline ?? ''}
        subtext={settings?.heroSubtext ?? ''}
        phone={settings?.phone ?? '731-444-1665'}
      />

      {/* Featured Listings */}
      <section className="max-w-7xl mx-auto px-4 py-20">
        <div className="text-center mb-12">
          <p className="text-[#c9a84c] uppercase tracking-widest text-sm font-medium mb-2">Available Now</p>
          <h2 className="text-4xl font-bold text-[#1a2744]" style={{ fontFamily: 'var(--font-serif)' }}>Featured Homes</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featured.map((l: any) => <ListingCard key={l._id} listing={l} />)}
        </div>
        {featured.length === 0 && (
          <p className="text-center text-gray-400 py-8">Listings coming soon. <Link href="/contact" className="text-[#c9a84c] underline">Contact us</Link> for availability.</p>
        )}
        <div className="text-center mt-10">
          <Link href="/listings" className="bg-[#1a2744] text-white px-8 py-3 rounded font-semibold hover:bg-[#243358] transition-colors">
            View All Listings
          </Link>
        </div>
      </section>

      {/* About Snapshot */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <p className="text-[#c9a84c] uppercase tracking-widest text-sm font-medium mb-2">Our Story</p>
            <h2 className="text-4xl font-bold text-[#1a2744] mb-6" style={{ fontFamily: 'var(--font-serif)' }}>20+ Years of Craftsmanship</h2>
            <p className="text-gray-600 leading-relaxed mb-6">
              Sky View Homes has been building quality homes in Jackson, Tennessee for over two decades. Every home is built with care, precision, and the community in mind.
            </p>
            <Link href="/about" className="text-[#c9a84c] font-semibold hover:underline">
              Learn More About Us →
            </Link>
          </div>
          <div className="bg-[#1a2744] rounded-lg h-64 flex items-center justify-center text-[#c9a84c] text-3xl text-center px-8" style={{ fontFamily: 'var(--font-serif)' }}>
            Sky View Homes
          </div>
        </div>
      </section>

      {/* Testimonials */}
      {testimonials.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 py-20">
          <div className="text-center mb-12">
            <p className="text-[#c9a84c] uppercase tracking-widest text-sm font-medium mb-2">Happy Homeowners</p>
            <h2 className="text-4xl font-bold text-[#1a2744]" style={{ fontFamily: 'var(--font-serif)' }}>What Our Clients Say</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((t: any) => (
              <TestimonialCard key={t._id} name={t.name} quote={t.quote} rating={t.rating} />
            ))}
          </div>
        </section>
      )}

      {/* CTA Banner */}
      <section className="bg-[#1a2744] py-16 text-center text-white">
        <h2 className="text-4xl font-bold mb-4" style={{ fontFamily: 'var(--font-serif)' }}>Ready to Find Your Dream Home?</h2>
        <p className="text-gray-300 mb-8 max-w-xl mx-auto">Contact Mari Acuna today and let's find the perfect home for you.</p>
        <Link href="/contact" className="bg-[#c9a84c] text-[#1a2744] px-10 py-4 rounded font-bold text-lg hover:bg-[#d4b96a] transition-colors">
          Get in Touch
        </Link>
      </section>
    </>
  )
}
