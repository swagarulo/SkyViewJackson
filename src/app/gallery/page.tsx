import { getGalleryProjects } from '@/sanity/queries'
import { urlFor } from '@/sanity/image'
import Image from 'next/image'
import type { Metadata } from 'next'

export const revalidate = 3600

export const metadata: Metadata = {
  title: 'Gallery | Sky View Homes',
  description: 'Browse our project gallery showcasing quality construction in Jackson, TN.',
}

export default async function GalleryPage() {
  const projects = await getGalleryProjects().catch(() => [])

  return (
    <div className="max-w-7xl mx-auto px-4 py-16">
      <p className="text-[#c9a84c] uppercase tracking-widest text-sm font-medium mb-2">Our Work</p>
      <h1 className="text-5xl font-bold text-[#1a2744] mb-10" style={{ fontFamily: 'var(--font-serif)' }}>Project Gallery</h1>
      {projects.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <p className="text-xl">Gallery coming soon.</p>
        </div>
      ) : (
        <div className="space-y-16">
          {projects.map((project: any) => (
            <div key={project._id}>
              <h2 className="text-2xl font-bold text-[#1a2744] mb-6" style={{ fontFamily: 'var(--font-serif)' }}>{project.title}</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {project.photos?.map((photo: any, i: number) => (
                  <div key={i} className="relative h-64 rounded-lg overflow-hidden">
                    <Image
                      src={urlFor(photo).width(600).height(400).url()}
                      alt={`${project.title} photo ${i + 1}`}
                      fill
                      className="object-cover hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
