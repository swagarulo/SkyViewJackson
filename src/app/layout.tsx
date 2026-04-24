import type { Metadata } from 'next'
import './globals.css'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { getSiteSettings } from '@/sanity/queries'

export const metadata: Metadata = {
  metadataBase: new URL('https://skyviewhomestn.com'),
  title: 'Sky View Homes | New Construction in Jackson, TN',
  description: 'Premier new home builder in Jackson, Tennessee. Quality craftsmanship for over 20 years. View active listings and contact Mari Acuna today.',
  openGraph: {
    title: 'Sky View Homes | New Construction in Jackson, TN',
    description: 'Premier new home builder in Jackson, Tennessee. Quality craftsmanship for over 20 years.',
    url: 'https://skyviewhomestn.com',
    siteName: 'Sky View Homes',
    locale: 'en_US',
    type: 'website',
  },
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const settings = await getSiteSettings().catch(() => null)
  const phone = settings?.phone ?? '901-500-9827'
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
