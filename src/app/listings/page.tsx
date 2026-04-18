import { ListingCard } from '@/components/ListingCard'
import { getActiveListings } from '@/sanity/queries'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Active Listings | Sky View Homes',
  description: 'Browse available new construction homes in Jackson, Tennessee.',
}

export default async function ListingsPage() {
  const listings = await getActiveListings().catch(() => [])

  return (
    <div className="max-w-7xl mx-auto px-4 py-16">
      <div className="mb-10">
        <p className="text-[#c9a84c] uppercase tracking-widest text-sm font-medium mb-2">Available Now</p>
        <h1 className="text-5xl font-bold text-[#1a2744]" style={{ fontFamily: 'var(--font-serif)' }}>Active Listings</h1>
        <p className="text-gray-500 mt-2">{listings.length} homes available</p>
      </div>
      {listings.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <p className="text-xl">No active listings at this time.</p>
          <p className="mt-2">Check back soon or <a href="/contact" className="text-[#c9a84c] underline">contact us</a>.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {listings.map((l: any) => <ListingCard key={l._id} listing={l} />)}
        </div>
      )}
    </div>
  )
}
