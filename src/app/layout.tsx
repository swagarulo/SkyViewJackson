import type { Metadata } from 'next'
import './globals.css'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { getSiteSettings } from '@/sanity/queries'

export const metadata: Metadata = {
  title: 'Sky View Homes | New Construction in Jackson, TN',
  description: 'Premier new home builder in Jackson, Tennessee. Quality craftsmanship for over 20 years. View active listings and contact Mari Acuna today.',
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const settings = await getSiteSettings()
  const phone = settings?.phone ?? '731-444-1665'
  const address = settings?.address ?? '180 E Main St, Jackson, TN 38301'

  return (
    <html lang="en">
      <body>
        <Header phone={phone} />
        <main>{children}</main>
        <Footer phone={phone} address={address} />
      </body>
    </html>
  )
}
