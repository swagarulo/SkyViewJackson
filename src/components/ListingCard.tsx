import Link from 'next/link'
import Image from 'next/image'
import { urlFor } from '@/sanity/image'

interface Listing {
  _id: string
  address: string
  price: number
  beds: number
  baths: number
  sqft: number
  status: string
  photos: any[]
}

interface ListingCardProps { listing: Listing }

export function ListingCard({ listing }: ListingCardProps) {
  const photo = listing.photos?.[0]
  const imgUrl = photo ? urlFor(photo).width(600).height(400).url() : null

  return (
    <Link href={`/listings/${listing._id}`} className="group block bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow">
      <div className="relative h-56 bg-gray-100 overflow-hidden">
        {imgUrl ? (
          <Image src={imgUrl} alt={listing.address} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-400 text-sm">No photo available</div>
        )}
        <div className="absolute top-3 left-3 bg-[#c9a84c] text-[#1a2744] text-xs font-bold px-2 py-1 rounded uppercase tracking-wide">
          {listing.status}
        </div>
      </div>
      <div className="p-4">
        <p className="text-xl font-bold text-[#1a2744] mb-1" style={{ fontFamily: 'var(--font-serif)' }}>
          ${listing.price?.toLocaleString()}
        </p>
        <p className="text-gray-600 text-sm mb-3">{listing.address}</p>
        <div className="flex gap-4 text-sm text-gray-500">
          <span>{listing.beds} bed</span>
          <span>{listing.baths} bath</span>
          <span>{listing.sqft?.toLocaleString()} sqft</span>
        </div>
      </div>
    </Link>
  )
}
