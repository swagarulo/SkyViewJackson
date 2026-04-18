# Sky View Homes Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build a premier real estate website for Sky View Homes (Jackson, TN) with Next.js 15, Sanity v3 CMS, Tailwind CSS, deployed on Netlify.

**Architecture:** Next.js App Router with server components fetching from Sanity at build time + on-demand revalidation. Sanity Studio embedded at `/studio` for content management. Netlify handles hosting and form submissions.

**Tech Stack:** Next.js 15, Sanity v3, Tailwind CSS 4, TypeScript, Jest + React Testing Library, Netlify

---

## Prerequisites

- Node.js 20+
- Sanity account (free at sanity.io)
- Netlify account (existing)
- GoDaddy domain: skyviewhomestn.com

---

### Task 1: Initialize Next.js Project

**Files:**
- Create: `package.json`, `next.config.ts`, `tailwind.config.ts`, `tsconfig.json`

**Step 1: Scaffold project**

```bash
cd /Users/kevinverzosa/claude/skyview
npx create-next-app@latest . --typescript --tailwind --app --src-dir --import-alias "@/*" --no-git
```

When prompted: Yes to all defaults.

**Step 2: Install dependencies**

```bash
npm install next-sanity @sanity/image-url @sanity/vision
npm install -D @testing-library/react @testing-library/jest-dom @testing-library/user-event jest jest-environment-jsdom
```

**Step 3: Configure Jest — create `jest.config.ts`**

```typescript
import type { Config } from 'jest'
import nextJest from 'next/jest.js'

const createJestConfig = nextJest({ dir: './' })

const config: Config = {
  coverageProvider: 'v8',
  testEnvironment: 'jsdom',
  setupFilesAfterFramework: ['<rootDir>/jest.setup.ts'],
}

export default createJestConfig(config)
```

**Step 4: Create `jest.setup.ts`**

```typescript
import '@testing-library/jest-dom'
```

**Step 5: Add test script to `package.json`**

Add to scripts: `"test": "jest"`, `"test:watch": "jest --watch"`

**Step 6: Verify Next.js runs**

```bash
npm run dev
```

Expected: Server starts at http://localhost:3000

**Step 7: Commit**

```bash
git add -A
git commit -m "feat: initialize Next.js 15 project with Tailwind and Jest"
```

---

### Task 2: Initialize Sanity Project

**Files:**
- Create: `sanity.config.ts`, `sanity.cli.ts`, `src/sanity/` directory

**Step 1: Create Sanity project**

```bash
npm create sanity@latest -- --project skyview-homes --dataset production --template clean --typescript
```

When prompted for output directory, enter: `studio-standalone` (we'll integrate it)

**Step 2: Install Sanity in the Next.js project**

```bash
npm install sanity @sanity/ui
```

**Step 3: Create `sanity.config.ts` in project root**

```typescript
import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'
import { schema } from '@/sanity/schema'

export default defineConfig({
  name: 'skyview-homes',
  title: 'Sky View Homes',
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  plugins: [structureTool(), visionTool()],
  schema,
  basePath: '/studio',
})
```

**Step 4: Create `src/sanity/schema/index.ts`**

```typescript
import { listing } from './listing'
import { testimonial } from './testimonial'
import { galleryProject } from './galleryProject'
import { siteSettings } from './siteSettings'

export const schema = {
  types: [listing, testimonial, galleryProject, siteSettings],
}
```

**Step 5: Create `.env.local`**

```
NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_TOKEN=your_token
```

Get project ID from sanity.io/manage after creating project.

**Step 6: Commit**

```bash
git add -A
git commit -m "feat: initialize Sanity v3 CMS configuration"
```

---

### Task 3: Sanity Schema — Listing

**Files:**
- Create: `src/sanity/schema/listing.ts`

**Step 1: Write test `src/__tests__/sanity/listing.test.ts`**

```typescript
import { listing } from '@/sanity/schema/listing'

describe('listing schema', () => {
  it('has required name and title', () => {
    expect(listing.name).toBe('listing')
    expect(listing.title).toBe('Listing')
  })

  it('has address field', () => {
    const fields = listing.fields.map((f: any) => f.name)
    expect(fields).toContain('address')
  })

  it('has status field with active and sold options', () => {
    const status = listing.fields.find((f: any) => f.name === 'status')
    const options = status?.options?.list?.map((o: any) => o.value)
    expect(options).toContain('active')
    expect(options).toContain('sold')
  })
})
```

**Step 2: Run test to verify it fails**

```bash
npx jest src/__tests__/sanity/listing.test.ts -v
```

Expected: FAIL — module not found

**Step 3: Create `src/sanity/schema/listing.ts`**

```typescript
import { defineType, defineField } from 'sanity'

export const listing = defineType({
  name: 'listing',
  title: 'Listing',
  type: 'document',
  fields: [
    defineField({ name: 'address', title: 'Address', type: 'string', validation: r => r.required() }),
    defineField({ name: 'price', title: 'Price', type: 'number' }),
    defineField({ name: 'beds', title: 'Bedrooms', type: 'number' }),
    defineField({ name: 'baths', title: 'Bathrooms', type: 'number' }),
    defineField({ name: 'sqft', title: 'Square Feet', type: 'number' }),
    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
      options: { list: [{ title: 'Active', value: 'active' }, { title: 'Sold', value: 'sold' }] },
      validation: r => r.required(),
    }),
    defineField({ name: 'featured', title: 'Featured on Homepage', type: 'boolean', initialValue: false }),
    defineField({ name: 'description', title: 'Description', type: 'text' }),
    defineField({ name: 'photos', title: 'Photos', type: 'array', of: [{ type: 'image', options: { hotspot: true } }] }),
    defineField({ name: 'floorPlan', title: 'Floor Plan', type: 'image' }),
  ],
  orderings: [{ title: 'Price, High to Low', name: 'priceDesc', by: [{ field: 'price', direction: 'desc' }] }],
})
```

**Step 4: Run test to verify it passes**

```bash
npx jest src/__tests__/sanity/listing.test.ts -v
```

Expected: PASS

**Step 5: Commit**

```bash
git add src/sanity/schema/listing.ts src/__tests__/sanity/listing.test.ts
git commit -m "feat: add Sanity listing schema"
```

---

### Task 4: Sanity Schema — Testimonial, Gallery, Site Settings

**Files:**
- Create: `src/sanity/schema/testimonial.ts`, `src/sanity/schema/galleryProject.ts`, `src/sanity/schema/siteSettings.ts`

**Step 1: Create `src/sanity/schema/testimonial.ts`**

```typescript
import { defineType, defineField } from 'sanity'

export const testimonial = defineType({
  name: 'testimonial',
  title: 'Testimonial',
  type: 'document',
  fields: [
    defineField({ name: 'name', title: 'Client Name', type: 'string', validation: r => r.required() }),
    defineField({ name: 'quote', title: 'Quote', type: 'text', validation: r => r.required() }),
    defineField({ name: 'rating', title: 'Rating (1-5)', type: 'number', validation: r => r.min(1).max(5) }),
  ],
})
```

**Step 2: Create `src/sanity/schema/galleryProject.ts`**

```typescript
import { defineType, defineField } from 'sanity'

export const galleryProject = defineType({
  name: 'galleryProject',
  title: 'Gallery Project',
  type: 'document',
  fields: [
    defineField({ name: 'title', title: 'Project Title', type: 'string', validation: r => r.required() }),
    defineField({ name: 'category', title: 'Category', type: 'string' }),
    defineField({ name: 'photos', title: 'Photos', type: 'array', of: [{ type: 'image', options: { hotspot: true } }] }),
  ],
})
```

**Step 3: Create `src/sanity/schema/siteSettings.ts`**

```typescript
import { defineType, defineField } from 'sanity'

export const siteSettings = defineType({
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  fields: [
    defineField({ name: 'phone', title: 'Phone Number', type: 'string' }),
    defineField({ name: 'address', title: 'Office Address', type: 'string' }),
    defineField({ name: 'agentName', title: 'Agent Name', type: 'string' }),
    defineField({ name: 'agentBio', title: 'Agent Bio', type: 'text' }),
    defineField({ name: 'agentPhoto', title: 'Agent Photo', type: 'image', options: { hotspot: true } }),
    defineField({ name: 'heroHeadline', title: 'Hero Headline', type: 'string' }),
    defineField({ name: 'heroSubtext', title: 'Hero Subtext', type: 'string' }),
  ],
  __experimental_actions: ['update', 'publish'],
})
```

**Step 4: Commit**

```bash
git add src/sanity/schema/
git commit -m "feat: add testimonial, gallery, and site settings schemas"
```

---

### Task 5: Sanity Client + Data Fetching Helpers

**Files:**
- Create: `src/sanity/client.ts`, `src/sanity/queries.ts`, `src/sanity/image.ts`

**Step 1: Create `src/sanity/client.ts`**

```typescript
import { createClient } from 'next-sanity'

export const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: '2024-01-01',
  useCdn: false,
})
```

**Step 2: Create `src/sanity/image.ts`**

```typescript
import createImageUrlBuilder from '@sanity/image-url'
import { client } from './client'

const builder = createImageUrlBuilder(client)

export function urlFor(source: any) {
  return builder.image(source)
}
```

**Step 3: Create `src/sanity/queries.ts`**

```typescript
import { client } from './client'

export async function getFeaturedListings() {
  return client.fetch(`*[_type == "listing" && featured == true && status == "active"] | order(_createdAt desc) [0...6]`)
}

export async function getActiveListings() {
  return client.fetch(`*[_type == "listing" && status == "active"] | order(price desc)`)
}

export async function getSoldListings() {
  return client.fetch(`*[_type == "listing" && status == "sold"] | order(_createdAt desc)`)
}

export async function getListing(id: string) {
  return client.fetch(`*[_type == "listing" && _id == $id][0]`, { id })
}

export async function getTestimonials() {
  return client.fetch(`*[_type == "testimonial"] | order(_createdAt desc)`)
}

export async function getGalleryProjects() {
  return client.fetch(`*[_type == "galleryProject"] | order(_createdAt desc)`)
}

export async function getSiteSettings() {
  return client.fetch(`*[_type == "siteSettings"][0]`)
}
```

**Step 4: Commit**

```bash
git add src/sanity/
git commit -m "feat: add Sanity client and data fetching queries"
```

---

### Task 6: Global Layout — Colors, Fonts, Header, Footer

**Files:**
- Modify: `src/app/globals.css`, `tailwind.config.ts`
- Create: `src/components/Header.tsx`, `src/components/Footer.tsx`, `src/app/layout.tsx`
- Test: `src/__tests__/components/Header.test.tsx`

**Step 1: Write failing test for Header**

```typescript
// src/__tests__/components/Header.test.tsx
import { render, screen } from '@testing-library/react'
import { Header } from '@/components/Header'

describe('Header', () => {
  it('renders the Sky View Homes logo text', () => {
    render(<Header phone="731-444-1665" />)
    expect(screen.getByText(/Sky View Homes/i)).toBeInTheDocument()
  })

  it('renders navigation links', () => {
    render(<Header phone="731-444-1665" />)
    expect(screen.getByRole('link', { name: /listings/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /about/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /contact/i })).toBeInTheDocument()
  })

  it('renders phone number', () => {
    render(<Header phone="731-444-1665" />)
    expect(screen.getByText('731-444-1665')).toBeInTheDocument()
  })
})
```

**Step 2: Run test to confirm it fails**

```bash
npx jest src/__tests__/components/Header.test.tsx -v
```

**Step 3: Configure Tailwind colors in `tailwind.config.ts`**

```typescript
import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        navy: { DEFAULT: '#1a2744', light: '#243358', dark: '#111c33' },
        gold: { DEFAULT: '#c9a84c', light: '#d4b96a', dark: '#a8882e' },
      },
      fontFamily: {
        serif: ['Playfair Display', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
}
export default config
```

**Step 4: Update `src/app/globals.css`**

```css
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=Inter:wght@300;400;500;600&display=swap');
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  body { @apply font-sans text-gray-800 bg-white; }
  h1, h2, h3 { @apply font-serif; }
}
```

**Step 5: Create `src/components/Header.tsx`**

```typescript
'use client'
import Link from 'next/link'
import { useState } from 'react'

interface HeaderProps { phone: string }

export function Header({ phone }: HeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false)
  const navLinks = [
    { href: '/listings', label: 'Listings' },
    { href: '/sold', label: 'Sold' },
    { href: '/gallery', label: 'Gallery' },
    { href: '/affordable-homes', label: 'Affordable Homes' },
    { href: '/about', label: 'About' },
    { href: '/contact', label: 'Contact' },
  ]

  return (
    <header className="bg-navy text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="font-serif text-2xl font-bold text-gold">
          Sky View Homes
        </Link>
        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map(l => (
            <Link key={l.href} href={l.href} className="text-sm font-medium hover:text-gold transition-colors">
              {l.label}
            </Link>
          ))}
          <a href={`tel:${phone}`} className="bg-gold text-navy px-4 py-2 rounded font-semibold text-sm hover:bg-gold-light transition-colors">
            {phone}
          </a>
        </nav>
        <button className="md:hidden" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu">
          <span className="block w-6 h-0.5 bg-white mb-1" />
          <span className="block w-6 h-0.5 bg-white mb-1" />
          <span className="block w-6 h-0.5 bg-white" />
        </button>
      </div>
      {menuOpen && (
        <div className="md:hidden bg-navy-dark px-4 pb-4">
          {navLinks.map(l => (
            <Link key={l.href} href={l.href} className="block py-2 text-sm hover:text-gold" onClick={() => setMenuOpen(false)}>
              {l.label}
            </Link>
          ))}
          <a href={`tel:${phone}`} className="block mt-2 text-gold font-semibold">{phone}</a>
        </div>
      )}
    </header>
  )
}
```

**Step 6: Create `src/components/Footer.tsx`**

```typescript
import Link from 'next/link'

interface FooterProps { phone: string; address: string }

export function Footer({ phone, address }: FooterProps) {
  return (
    <footer className="bg-navy text-white mt-20">
      <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <h3 className="font-serif text-xl text-gold mb-3">Sky View Homes</h3>
          <p className="text-sm text-gray-300">Quality craftsmanship for over 20 years in Jackson, Tennessee.</p>
        </div>
        <div>
          <h4 className="font-semibold mb-3 text-gold">Quick Links</h4>
          <ul className="space-y-1 text-sm text-gray-300">
            {[['/', 'Home'], ['/listings', 'Active Listings'], ['/sold', 'Sold Homes'], ['/gallery', 'Gallery'], ['/about', 'About'], ['/contact', 'Contact']].map(([href, label]) => (
              <li key={href}><Link href={href} className="hover:text-gold transition-colors">{label}</Link></li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="font-semibold mb-3 text-gold">Contact</h4>
          <p className="text-sm text-gray-300">{address}</p>
          <a href={`tel:${phone}`} className="text-gold hover:text-gold-light text-sm mt-1 block">{phone}</a>
        </div>
      </div>
      <div className="border-t border-navy-light text-center py-4 text-xs text-gray-400">
        © {new Date().getFullYear()} Sky View Homes. All rights reserved. | Realtor: Mari Acuna — Home and Farms Realty
      </div>
    </footer>
  )
}
```

**Step 7: Update `src/app/layout.tsx`**

```typescript
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
```

**Step 8: Run Header test**

```bash
npx jest src/__tests__/components/Header.test.tsx -v
```

Expected: PASS

**Step 9: Commit**

```bash
git add src/
git commit -m "feat: add global layout with Header, Footer, and Tailwind theme"
```

---

### Task 7: Listing Card Component

**Files:**
- Create: `src/components/ListingCard.tsx`
- Test: `src/__tests__/components/ListingCard.test.tsx`

**Step 1: Write failing test**

```typescript
// src/__tests__/components/ListingCard.test.tsx
import { render, screen } from '@testing-library/react'
import { ListingCard } from '@/components/ListingCard'

const mockListing = {
  _id: '1',
  address: '123 Main St, Jackson, TN',
  price: 285000,
  beds: 3,
  baths: 2,
  sqft: 1800,
  status: 'active',
  photos: [],
}

describe('ListingCard', () => {
  it('displays address', () => {
    render(<ListingCard listing={mockListing} />)
    expect(screen.getByText('123 Main St, Jackson, TN')).toBeInTheDocument()
  })

  it('displays formatted price', () => {
    render(<ListingCard listing={mockListing} />)
    expect(screen.getByText(/\$285,000/)).toBeInTheDocument()
  })

  it('displays bed/bath/sqft', () => {
    render(<ListingCard listing={mockListing} />)
    expect(screen.getByText(/3 bed/i)).toBeInTheDocument()
    expect(screen.getByText(/2 bath/i)).toBeInTheDocument()
    expect(screen.getByText(/1,800/)).toBeInTheDocument()
  })
})
```

**Step 2: Run test to confirm it fails**

```bash
npx jest src/__tests__/components/ListingCard.test.tsx -v
```

**Step 3: Create `src/components/ListingCard.tsx`**

```typescript
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
        <div className="absolute top-3 left-3 bg-gold text-navy text-xs font-bold px-2 py-1 rounded uppercase tracking-wide">
          {listing.status}
        </div>
      </div>
      <div className="p-4">
        <p className="font-serif text-xl font-semibold text-navy mb-1">
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
```

**Step 4: Run test**

```bash
npx jest src/__tests__/components/ListingCard.test.tsx -v
```

Expected: PASS

**Step 5: Commit**

```bash
git add src/components/ListingCard.tsx src/__tests__/components/ListingCard.test.tsx
git commit -m "feat: add ListingCard component"
```

---

### Task 8: Home Page

**Files:**
- Modify: `src/app/page.tsx`
- Create: `src/components/HeroSection.tsx`, `src/components/TestimonialCard.tsx`

**Step 1: Create `src/components/HeroSection.tsx`**

```typescript
import Link from 'next/link'

interface HeroProps { headline: string; subtext: string; phone: string }

export function HeroSection({ headline, subtext, phone }: HeroProps) {
  return (
    <section className="relative bg-navy min-h-[85vh] flex items-center">
      <div className="absolute inset-0 bg-[url('/hero-bg.jpg')] bg-cover bg-center opacity-30" />
      <div className="relative max-w-7xl mx-auto px-4 py-20 text-white">
        <p className="text-gold uppercase tracking-widest text-sm font-medium mb-4">Jackson, Tennessee</p>
        <h1 className="font-serif text-5xl md:text-7xl font-bold leading-tight mb-6 max-w-3xl">
          {headline || 'Quality Homes Built to Last'}
        </h1>
        <p className="text-xl text-gray-200 mb-10 max-w-xl">
          {subtext || 'New construction homes in Jackson, TN with over 20 years of craftsmanship.'}
        </p>
        <div className="flex flex-wrap gap-4">
          <Link href="/listings" className="bg-gold text-navy px-8 py-4 rounded font-bold text-lg hover:bg-gold-light transition-colors">
            View Listings
          </Link>
          <a href={`tel:${phone}`} className="border-2 border-white text-white px-8 py-4 rounded font-bold text-lg hover:bg-white hover:text-navy transition-colors">
            Contact Mari
          </a>
        </div>
      </div>
    </section>
  )
}
```

**Step 2: Create `src/components/TestimonialCard.tsx`**

```typescript
interface TestimonialProps { name: string; quote: string; rating: number }

export function TestimonialCard({ name, quote, rating }: TestimonialProps) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-gold">
      <div className="flex mb-3">
        {Array.from({ length: rating }).map((_, i) => (
          <span key={i} className="text-gold text-xl">★</span>
        ))}
      </div>
      <p className="text-gray-700 italic mb-4">"{quote}"</p>
      <p className="font-semibold text-navy">— {name}</p>
    </div>
  )
}
```

**Step 3: Update `src/app/page.tsx`**

```typescript
import { HeroSection } from '@/components/HeroSection'
import { ListingCard } from '@/components/ListingCard'
import { TestimonialCard } from '@/components/TestimonialCard'
import { getFeaturedListings, getTestimonials, getSiteSettings } from '@/sanity/queries'
import Link from 'next/link'

export default async function HomePage() {
  const [settings, featured, testimonials] = await Promise.all([
    getSiteSettings(),
    getFeaturedListings(),
    getTestimonials(),
  ])

  return (
    <>
      <HeroSection
        headline={settings?.heroHeadline}
        subtext={settings?.heroSubtext}
        phone={settings?.phone ?? '731-444-1665'}
      />

      {/* Featured Listings */}
      <section className="max-w-7xl mx-auto px-4 py-20">
        <div className="text-center mb-12">
          <p className="text-gold uppercase tracking-widest text-sm font-medium mb-2">Available Now</p>
          <h2 className="font-serif text-4xl font-bold text-navy">Featured Homes</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featured.map((l: any) => <ListingCard key={l._id} listing={l} />)}
        </div>
        <div className="text-center mt-10">
          <Link href="/listings" className="bg-navy text-white px-8 py-3 rounded font-semibold hover:bg-navy-light transition-colors">
            View All Listings
          </Link>
        </div>
      </section>

      {/* About Snapshot */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <p className="text-gold uppercase tracking-widest text-sm font-medium mb-2">Our Story</p>
            <h2 className="font-serif text-4xl font-bold text-navy mb-6">20+ Years of Craftsmanship</h2>
            <p className="text-gray-600 leading-relaxed mb-6">
              Sky View Homes has been building quality homes in Jackson, Tennessee for over two decades. Every home is built with care, precision, and the community in mind.
            </p>
            <Link href="/about" className="text-gold font-semibold hover:underline">
              Learn More About Us →
            </Link>
          </div>
          <div className="bg-navy rounded-lg h-64 flex items-center justify-center text-gold font-serif text-3xl">
            Sky View Homes
          </div>
        </div>
      </section>

      {/* Testimonials */}
      {testimonials.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 py-20">
          <div className="text-center mb-12">
            <p className="text-gold uppercase tracking-widest text-sm font-medium mb-2">Happy Homeowners</p>
            <h2 className="font-serif text-4xl font-bold text-navy">What Our Clients Say</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((t: any) => (
              <TestimonialCard key={t._id} name={t.name} quote={t.quote} rating={t.rating} />
            ))}
          </div>
        </section>
      )}

      {/* CTA Banner */}
      <section className="bg-navy py-16 text-center text-white">
        <h2 className="font-serif text-4xl font-bold mb-4">Ready to Find Your Dream Home?</h2>
        <p className="text-gray-300 mb-8 max-w-xl mx-auto">Contact Mari Acuna today and let's find the perfect home for you.</p>
        <Link href="/contact" className="bg-gold text-navy px-10 py-4 rounded font-bold text-lg hover:bg-gold-light transition-colors">
          Get in Touch
        </Link>
      </section>
    </>
  )
}
```

**Step 4: Commit**

```bash
git add src/
git commit -m "feat: add Home page with hero, featured listings, and testimonials"
```

---

### Task 9: Active Listings Page

**Files:**
- Create: `src/app/listings/page.tsx`

**Step 1: Create `src/app/listings/page.tsx`**

```typescript
import { ListingCard } from '@/components/ListingCard'
import { getActiveListings } from '@/sanity/queries'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Active Listings | Sky View Homes',
  description: 'Browse available new construction homes in Jackson, Tennessee.',
}

export default async function ListingsPage() {
  const listings = await getActiveListings()

  return (
    <div className="max-w-7xl mx-auto px-4 py-16">
      <div className="mb-10">
        <p className="text-gold uppercase tracking-widest text-sm font-medium mb-2">Available Now</p>
        <h1 className="font-serif text-5xl font-bold text-navy">Active Listings</h1>
        <p className="text-gray-500 mt-2">{listings.length} homes available</p>
      </div>

      {listings.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <p className="text-xl">No active listings at this time.</p>
          <p className="mt-2">Check back soon or <a href="/contact" className="text-gold underline">contact us</a>.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {listings.map((l: any) => <ListingCard key={l._id} listing={l} />)}
        </div>
      )}
    </div>
  )
}
```

**Step 2: Commit**

```bash
git add src/app/listings/
git commit -m "feat: add active listings page"
```

---

### Task 10: Listing Detail Page

**Files:**
- Create: `src/app/listings/[id]/page.tsx`, `src/components/ContactForm.tsx`

**Step 1: Create `src/components/ContactForm.tsx`**

```typescript
'use client'
import { useState } from 'react'

interface ContactFormProps { listingAddress?: string }

export function ContactForm({ listingAddress }: ContactFormProps) {
  const [submitted, setSubmitted] = useState(false)

  return submitted ? (
    <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
      <p className="text-green-700 font-semibold">Thank you! Mari will be in touch shortly.</p>
    </div>
  ) : (
    <form
      name="listing-inquiry"
      method="POST"
      data-netlify="true"
      onSubmit={() => setSubmitted(true)}
      className="space-y-4"
    >
      <input type="hidden" name="form-name" value="listing-inquiry" />
      {listingAddress && <input type="hidden" name="listing" value={listingAddress} />}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
        <input required name="name" type="text" className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-gold" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
        <input required name="email" type="email" className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-gold" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
        <input name="phone" type="tel" className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-gold" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
        <textarea name="message" rows={4} className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-gold" defaultValue={listingAddress ? `I'm interested in ${listingAddress}.` : ''} />
      </div>
      <button type="submit" className="w-full bg-gold text-navy font-bold py-3 rounded hover:bg-gold-light transition-colors">
        Send Inquiry
      </button>
    </form>
  )
}
```

**Step 2: Create `src/app/listings/[id]/page.tsx`**

```typescript
import { getListing, getActiveListings } from '@/sanity/queries'
import { urlFor } from '@/sanity/image'
import { ContactForm } from '@/components/ContactForm'
import Image from 'next/image'
import { notFound } from 'next/navigation'

export async function generateStaticParams() {
  const listings = await getActiveListings()
  return listings.map((l: any) => ({ id: l._id }))
}

export default async function ListingDetailPage({ params }: { params: { id: string } }) {
  const listing = await getListing(params.id)
  if (!listing) notFound()

  return (
    <div className="max-w-7xl mx-auto px-4 py-16">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Main Content */}
        <div className="lg:col-span-2">
          <div className="mb-4">
            <span className="bg-gold text-navy text-xs font-bold px-3 py-1 rounded uppercase tracking-wide">
              {listing.status}
            </span>
          </div>
          <h1 className="font-serif text-4xl font-bold text-navy mb-2">{listing.address}</h1>
          <p className="text-3xl text-gold font-bold mb-8">${listing.price?.toLocaleString()}</p>

          {/* Stats */}
          <div className="flex gap-8 py-6 border-y border-gray-200 mb-8">
            {[['Beds', listing.beds], ['Baths', listing.baths], ['Sq Ft', listing.sqft?.toLocaleString()]].map(([label, val]) => (
              <div key={label as string} className="text-center">
                <p className="text-2xl font-bold text-navy">{val}</p>
                <p className="text-sm text-gray-500">{label}</p>
              </div>
            ))}
          </div>

          {/* Photo Gallery */}
          {listing.photos?.length > 0 && (
            <div className="grid grid-cols-2 gap-4 mb-8">
              {listing.photos.map((photo: any, i: number) => (
                <div key={i} className={`relative ${i === 0 ? 'col-span-2 h-96' : 'h-48'} rounded-lg overflow-hidden`}>
                  <Image src={urlFor(photo).url()} alt={`${listing.address} photo ${i + 1}`} fill className="object-cover" />
                </div>
              ))}
            </div>
          )}

          {listing.description && (
            <div>
              <h2 className="font-serif text-2xl font-bold text-navy mb-4">About This Home</h2>
              <p className="text-gray-600 leading-relaxed">{listing.description}</p>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-gray-50 rounded-lg p-6 sticky top-24">
            <h3 className="font-serif text-xl font-bold text-navy mb-2">Interested in This Home?</h3>
            <p className="text-sm text-gray-500 mb-6">Contact Mari Acuna for more information or to schedule a showing.</p>
            <ContactForm listingAddress={listing.address} />
            <p className="text-center mt-4 text-sm text-gray-400">or call <a href="tel:901-500-9827" className="text-gold">901-500-9827</a></p>
          </div>
        </div>
      </div>
    </div>
  )
}
```

**Step 3: Commit**

```bash
git add src/
git commit -m "feat: add listing detail page with photo gallery and contact form"
```

---

### Task 11: Sold, Gallery, About, Affordable Homes, Contact Pages

**Files:**
- Create: `src/app/sold/page.tsx`, `src/app/gallery/page.tsx`, `src/app/about/page.tsx`, `src/app/affordable-homes/page.tsx`, `src/app/contact/page.tsx`

**Step 1: Create `src/app/sold/page.tsx`**

```typescript
import { ListingCard } from '@/components/ListingCard'
import { getSoldListings } from '@/sanity/queries'

export default async function SoldPage() {
  const listings = await getSoldListings()
  return (
    <div className="max-w-7xl mx-auto px-4 py-16">
      <p className="text-gold uppercase tracking-widest text-sm font-medium mb-2">Our Track Record</p>
      <h1 className="font-serif text-5xl font-bold text-navy mb-10">Sold Homes</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {listings.map((l: any) => <ListingCard key={l._id} listing={l} />)}
      </div>
    </div>
  )
}
```

**Step 2: Create `src/app/gallery/page.tsx`**

```typescript
import { getGalleryProjects } from '@/sanity/queries'
import { urlFor } from '@/sanity/image'
import Image from 'next/image'

export default async function GalleryPage() {
  const projects = await getGalleryProjects()
  return (
    <div className="max-w-7xl mx-auto px-4 py-16">
      <p className="text-gold uppercase tracking-widest text-sm font-medium mb-2">Our Work</p>
      <h1 className="font-serif text-5xl font-bold text-navy mb-10">Project Gallery</h1>
      <div className="space-y-16">
        {projects.map((project: any) => (
          <div key={project._id}>
            <h2 className="font-serif text-2xl font-bold text-navy mb-6">{project.title}</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {project.photos?.map((photo: any, i: number) => (
                <div key={i} className="relative h-64 rounded-lg overflow-hidden">
                  <Image src={urlFor(photo).width(600).height(400).url()} alt={`${project.title} ${i + 1}`} fill className="object-cover hover:scale-105 transition-transform duration-500" />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
```

**Step 3: Create `src/app/about/page.tsx`**

```typescript
import { getSiteSettings } from '@/sanity/queries'
import { urlFor } from '@/sanity/image'
import Image from 'next/image'
import Link from 'next/link'

export default async function AboutPage() {
  const settings = await getSiteSettings()
  return (
    <div className="max-w-7xl mx-auto px-4 py-16">
      <p className="text-gold uppercase tracking-widest text-sm font-medium mb-2">Our Story</p>
      <h1 className="font-serif text-5xl font-bold text-navy mb-12">About Sky View Homes</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-20">
        <div>
          <h2 className="font-serif text-3xl font-bold text-navy mb-4">20+ Years of Craftsmanship</h2>
          <p className="text-gray-600 leading-relaxed mb-6">
            Sky View Homes has been a trusted name in Jackson, Tennessee real estate for over two decades. We specialize in quality new construction homes built with care, precision, and community in mind.
          </p>
          <p className="text-gray-600 leading-relaxed">
            Every home we build reflects our commitment to craftsmanship and our dedication to helping families find the perfect place to call home.
          </p>
        </div>
        <div className="bg-navy rounded-lg h-80 flex items-center justify-center text-gold font-serif text-2xl text-center px-8">
          Building Quality Homes Since 2004
        </div>
      </div>

      {/* Agent */}
      <div className="bg-gray-50 rounded-xl p-10 grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
        {settings?.agentPhoto && (
          <div className="relative h-64 rounded-lg overflow-hidden">
            <Image src={urlFor(settings.agentPhoto).url()} alt={settings.agentName} fill className="object-cover" />
          </div>
        )}
        <div className="md:col-span-2">
          <h2 className="font-serif text-3xl font-bold text-navy mb-1">{settings?.agentName ?? 'Mari Acuna'}</h2>
          <p className="text-gold font-semibold mb-4">Realtor & Listing Agent — Home and Farms Realty</p>
          <p className="text-gray-600 leading-relaxed mb-6">{settings?.agentBio ?? 'Mari Acuna brings years of local expertise to every transaction, helping buyers and sellers navigate the Jackson, TN market with confidence.'}</p>
          <a href="tel:901-500-9827" className="bg-gold text-navy px-6 py-3 rounded font-bold hover:bg-gold-light transition-colors">
            Call Mari: 901-500-9827
          </a>
        </div>
      </div>
    </div>
  )
}
```

**Step 4: Create `src/app/affordable-homes/page.tsx`**

```typescript
import Link from 'next/link'

export default function AffordableHomesPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <p className="text-gold uppercase tracking-widest text-sm font-medium mb-2">For Every Family</p>
      <h1 className="font-serif text-5xl font-bold text-navy mb-6">Affordable Homes Initiative</h1>
      <p className="text-xl text-gray-600 mb-10">
        At Sky View Homes, we believe everyone deserves a quality home. Our Affordable Homes Initiative offers new construction homes at accessible price points without sacrificing craftsmanship.
      </p>
      <div className="bg-navy rounded-xl p-10 text-white text-center mb-10">
        <h2 className="font-serif text-3xl font-bold mb-4">Interested in Our Affordable Homes?</h2>
        <p className="text-gray-300 mb-8">Contact us to learn about current availability and financing options.</p>
        <Link href="/contact" className="bg-gold text-navy px-8 py-4 rounded font-bold hover:bg-gold-light transition-colors">
          Contact Us Today
        </Link>
      </div>
    </div>
  )
}
```

**Step 5: Create `src/app/contact/page.tsx`**

```typescript
import { ContactForm } from '@/components/ContactForm'
import { getSiteSettings } from '@/sanity/queries'

export default async function ContactPage() {
  const settings = await getSiteSettings()
  return (
    <div className="max-w-7xl mx-auto px-4 py-16">
      <p className="text-gold uppercase tracking-widest text-sm font-medium mb-2">Get In Touch</p>
      <h1 className="font-serif text-5xl font-bold text-navy mb-12">Contact Us</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
        <div>
          <h2 className="font-serif text-2xl font-bold text-navy mb-6">Send Us a Message</h2>
          <ContactForm />
        </div>
        <div>
          <h2 className="font-serif text-2xl font-bold text-navy mb-6">Contact Information</h2>
          <div className="space-y-4 text-gray-600">
            <div>
              <p className="font-semibold text-navy">Sky View Homes</p>
              <p>{settings?.address ?? '180 E Main St, Jackson, TN 38301'}</p>
            </div>
            <div>
              <p className="font-semibold text-navy">Office</p>
              <a href={`tel:${settings?.phone ?? '731-444-1665'}`} className="text-gold hover:underline">{settings?.phone ?? '731-444-1665'}</a>
            </div>
            <div>
              <p className="font-semibold text-navy">Realtor — Mari Acuna</p>
              <a href="tel:901-500-9827" className="text-gold hover:underline">901-500-9827</a>
            </div>
          </div>
          <div className="mt-8 rounded-lg overflow-hidden h-64 bg-gray-200">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3255.0!2d-88.81!3d35.61!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2s180+E+Main+St+Jackson+TN!5e0!3m2!1sen!2sus!4v1"
              width="100%" height="100%" style={{ border: 0 }} allowFullScreen loading="lazy"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
```

**Step 6: Commit**

```bash
git add src/app/
git commit -m "feat: add sold, gallery, about, affordable-homes, and contact pages"
```

---

### Task 12: Sanity Studio Route

**Files:**
- Create: `src/app/studio/[[...tool]]/page.tsx`

**Step 1: Create Studio page**

```typescript
'use client'
import { NextStudio } from 'next-sanity/studio'
import config from '../../../../sanity.config'

export default function StudioPage() {
  return <NextStudio config={config} />
}
```

**Step 2: Update `next.config.ts` to allow Sanity Studio in production**

```typescript
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'cdn.sanity.io' },
    ],
  },
}

export default nextConfig
```

**Step 3: Commit**

```bash
git add src/app/studio/ next.config.ts
git commit -m "feat: add embedded Sanity Studio at /studio"
```

---

### Task 13: Netlify Configuration + Deployment

**Files:**
- Create: `netlify.toml`, `public/_redirects`

**Step 1: Create `netlify.toml`**

```toml
[build]
  command = "npm run build"
  publish = ".next"

[[plugins]]
  package = "@netlify/plugin-nextjs"

[build.environment]
  NODE_VERSION = "20"
```

**Step 2: Install Netlify Next.js plugin**

```bash
npm install -D @netlify/plugin-nextjs
```

**Step 3: Create `public/_redirects`**

```
/studio/* /studio/:splat 200
```

**Step 4: Add environment variables to Netlify dashboard**

Go to Netlify → Site → Environment Variables → Add:
- `NEXT_PUBLIC_SANITY_PROJECT_ID` — from sanity.io/manage
- `NEXT_PUBLIC_SANITY_DATASET` — `production`
- `SANITY_API_TOKEN` — from sanity.io/manage → API → Tokens

**Step 5: Connect Netlify to repo**

- Push repo to GitHub: `git remote add origin <your-repo-url> && git push -u origin main`
- In Netlify: Add new site → Import from Git → select repo → deploy

**Step 6: Update GoDaddy DNS**

In GoDaddy DNS settings:
- Delete existing A record for `@`
- Add CNAME: `www` → your-netlify-site.netlify.app
- Add A record: `@` → Netlify's load balancer IP (shown in Netlify domain settings)

**Step 7: Run full test suite**

```bash
npm test
npm run build
```

Expected: All tests pass, build succeeds.

**Step 8: Final commit**

```bash
git add netlify.toml public/
git commit -m "feat: add Netlify deployment configuration"
git push
```

---

## Post-Launch Checklist

- [ ] Add first listing in Sanity Studio at `yoursite.netlify.app/studio`
- [ ] Upload hero photo to `/public/hero-bg.jpg`
- [ ] Add site settings (phone, address, agent bio) in Sanity
- [ ] Add testimonials in Sanity
- [ ] Verify contact form submissions arrive in Netlify Forms dashboard
- [ ] Point GoDaddy DNS to Netlify
- [ ] Enable Netlify's free SSL certificate
