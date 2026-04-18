import { getSiteSettings } from '@/sanity/queries'
import { urlFor } from '@/sanity/image'
import Image from 'next/image'
import Link from 'next/link'
import type { Metadata } from 'next'

export const revalidate = 3600

export const metadata: Metadata = {
  title: 'About | Sky View Homes',
  description: 'Learn about Sky View Homes — 20+ years of quality construction in Jackson, Tennessee.',
}

export default async function AboutPage() {
  const settings = await getSiteSettings().catch(() => null)

  return (
    <div className="max-w-7xl mx-auto px-4 py-16">
      <p className="text-[#c9a84c] uppercase tracking-widest text-sm font-medium mb-2">Our Story</p>
      <h1 className="text-5xl font-bold text-[#1a2744] mb-12" style={{ fontFamily: 'var(--font-serif)' }}>About Sky View Homes</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-20">
        <div>
          <h2 className="text-3xl font-bold text-[#1a2744] mb-4" style={{ fontFamily: 'var(--font-serif)' }}>20+ Years of Craftsmanship</h2>
          <p className="text-gray-600 leading-relaxed mb-6">
            Sky View Homes has been a trusted name in Jackson, Tennessee real estate for over two decades. We specialize in quality new construction homes built with care, precision, and community in mind.
          </p>
          <p className="text-gray-600 leading-relaxed">
            Every home we build reflects our commitment to craftsmanship and our dedication to helping families find the perfect place to call home.
          </p>
        </div>
        <div className="bg-[#1a2744] rounded-lg h-80 flex items-center justify-center text-[#c9a84c] text-2xl text-center px-8" style={{ fontFamily: 'var(--font-serif)' }}>
          Building Quality Homes Since 2004
        </div>
      </div>

      <div className="bg-gray-50 rounded-xl p-10 grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
        {settings?.agentPhoto && (
          <div className="relative h-64 rounded-lg overflow-hidden">
            <Image src={urlFor(settings.agentPhoto).url()} alt={settings.agentName ?? 'Mari Acuna'} fill className="object-cover" />
          </div>
        )}
        <div className="md:col-span-2">
          <h2 className="text-3xl font-bold text-[#1a2744] mb-1" style={{ fontFamily: 'var(--font-serif)' }}>{settings?.agentName ?? 'Mari Acuna'}</h2>
          <p className="text-[#c9a84c] font-semibold mb-4">Realtor &amp; Listing Agent — Home and Farms Realty</p>
          <p className="text-gray-600 leading-relaxed mb-6">
            {settings?.agentBio ?? 'Mari Acuna brings years of local expertise to every transaction, helping buyers and sellers navigate the Jackson, TN market with confidence.'}
          </p>
          <a href="tel:901-500-9827" className="inline-block bg-[#c9a84c] text-[#1a2744] px-6 py-3 rounded font-bold hover:bg-[#d4b96a] transition-colors">
            Call Mari: 901-500-9827
          </a>
        </div>
      </div>

      <div className="mt-20 text-center">
        <p className="text-gray-500 mb-2 text-sm italic">Pictures &amp; Floor Plans are for reference only. Not guaranteed by builder or Sky View Homes.</p>
      </div>
    </div>
  )
}
