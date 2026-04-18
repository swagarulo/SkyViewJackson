import { ContactForm } from '@/components/ContactForm'
import { getSiteSettings } from '@/sanity/queries'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Contact | Sky View Homes',
  description: 'Contact Sky View Homes or Mari Acuna to inquire about listings in Jackson, TN.',
}

export default async function ContactPage() {
  const settings = await getSiteSettings().catch(() => null)
  const phone = settings?.phone ?? '731-444-1665'
  const address = settings?.address ?? '180 E Main St, Jackson, TN 38301'

  return (
    <div className="max-w-7xl mx-auto px-4 py-16">
      <p className="text-[#c9a84c] uppercase tracking-widest text-sm font-medium mb-2">Get In Touch</p>
      <h1 className="text-5xl font-bold text-[#1a2744] mb-12" style={{ fontFamily: 'var(--font-serif)' }}>Contact Us</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
        <div>
          <h2 className="text-2xl font-bold text-[#1a2744] mb-6" style={{ fontFamily: 'var(--font-serif)' }}>Send Us a Message</h2>
          <ContactForm />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-[#1a2744] mb-6" style={{ fontFamily: 'var(--font-serif)' }}>Contact Information</h2>
          <div className="space-y-6 text-gray-600">
            <div>
              <p className="font-semibold text-[#1a2744]">Sky View Homes</p>
              <p>{address}</p>
            </div>
            <div>
              <p className="font-semibold text-[#1a2744]">Office</p>
              <a href={`tel:${phone}`} className="text-[#c9a84c] hover:underline">{phone}</a>
            </div>
            <div>
              <p className="font-semibold text-[#1a2744]">Realtor — Mari Acuna</p>
              <a href="tel:901-500-9827" className="text-[#c9a84c] hover:underline">901-500-9827</a>
            </div>
          </div>
          <div className="mt-8 rounded-lg overflow-hidden h-64 bg-gray-200">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3255.0!2d-88.8143!3d35.6145!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x88905a5a0b21b7d3%3A0x4e4c7c8a3b0e8a1!2s180+E+Main+St%2C+Jackson%2C+TN+38301!5e0!3m2!1sen!2sus!4v1"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
