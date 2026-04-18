import { ListingCard } from '@/components/ListingCard'
import { getSoldListings } from '@/sanity/queries'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Sold Homes | Sky View Homes',
  description: 'View our track record of sold homes in Jackson, Tennessee.',
}

export default async function SoldPage() {
  const listings = await getSoldListings().catch(() => [])

  return (
    <div className="max-w-7xl mx-auto px-4 py-16">
      <p className="text-[#c9a84c] uppercase tracking-widest text-sm font-medium mb-2">Our Track Record</p>
      <h1 className="text-5xl font-bold text-[#1a2744] mb-10" style={{ fontFamily: 'var(--font-serif)' }}>Sold Homes</h1>
      {listings.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <p className="text-xl">No sold listings to display yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {listings.map((l: any) => <ListingCard key={l._id} listing={l} />)}
        </div>
      )}
    </div>
  )
}
