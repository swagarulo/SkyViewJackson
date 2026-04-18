import { getListing, getActiveListings, getSoldListings } from '@/sanity/queries'
import { urlFor } from '@/sanity/image'
import { ContactForm } from '@/components/ContactForm'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'

export async function generateStaticParams() {
  const [active, sold] = await Promise.all([
    getActiveListings().catch(() => []),
    getSoldListings().catch(() => []),
  ])
  return [...active, ...sold].map((l: any) => ({ id: l._id }))
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params
  const listing = await getListing(id).catch(() => null)
  return {
    title: listing ? `${listing.address} | Sky View Homes` : 'Listing | Sky View Homes',
    description: listing?.description ?? 'View this listing at Sky View Homes in Jackson, TN.',
  }
}

export default async function ListingDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const listing = await getListing(id).catch(() => null)
  if (!listing) notFound()

  return (
    <div className="max-w-7xl mx-auto px-4 py-16">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Main Content */}
        <div className="lg:col-span-2">
          <div className="mb-4">
            <span className="bg-[#c9a84c] text-[#1a2744] text-xs font-bold px-3 py-1 rounded uppercase tracking-wide">
              {listing.status}
            </span>
          </div>
          <h1 className="text-4xl font-bold text-[#1a2744] mb-2" style={{ fontFamily: 'var(--font-serif)' }}>{listing.address}</h1>
          <p className="text-3xl text-[#c9a84c] font-bold mb-8">${listing.price?.toLocaleString()}</p>

          <div className="flex gap-8 py-6 border-y border-gray-200 mb-8">
            {[['Beds', listing.beds], ['Baths', listing.baths], ['Sq Ft', listing.sqft?.toLocaleString()]].map(([label, val]) => (
              <div key={label as string} className="text-center">
                <p className="text-2xl font-bold text-[#1a2744]">{val}</p>
                <p className="text-sm text-gray-500">{label}</p>
              </div>
            ))}
          </div>

          {listing.photos?.length > 0 && (
            <div className="grid grid-cols-2 gap-4 mb-8">
              {listing.photos.map((photo: any, i: number) => (
                <div key={i} className={`relative ${i === 0 ? 'col-span-2 h-96' : 'h-48'} rounded-lg overflow-hidden`}>
                  <Image
                    src={urlFor(photo).url()}
                    alt={`${listing.address} photo ${i + 1}`}
                    fill
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          )}

          {listing.description && (
            <div>
              <h2 className="text-2xl font-bold text-[#1a2744] mb-4" style={{ fontFamily: 'var(--font-serif)' }}>About This Home</h2>
              <p className="text-gray-600 leading-relaxed">{listing.description}</p>
            </div>
          )}

          {listing.floorPlan && (
            <div className="mt-8">
              <h2 className="text-2xl font-bold text-[#1a2744] mb-4" style={{ fontFamily: 'var(--font-serif)' }}>Floor Plan</h2>
              <div className="relative h-96 rounded-lg overflow-hidden border border-gray-200">
                <Image src={urlFor(listing.floorPlan).url()} alt="Floor plan" fill className="object-contain" />
              </div>
              <p className="text-xs text-gray-400 mt-2 italic">Floor plan is for reference only. Not guaranteed by builder or Sky View Homes.</p>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-gray-50 rounded-lg p-6 sticky top-24">
            <h3 className="text-xl font-bold text-[#1a2744] mb-2" style={{ fontFamily: 'var(--font-serif)' }}>Interested in This Home?</h3>
            <p className="text-sm text-gray-500 mb-6">Contact Mari Acuna for more information or to schedule a showing.</p>
            <ContactForm listingAddress={listing.address} />
            <p className="text-center mt-4 text-sm text-gray-400">
              or call <a href="tel:901-500-9827" className="text-[#c9a84c]">901-500-9827</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
