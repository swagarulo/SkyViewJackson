# Sky View Homes — Website Design

**Date:** 2026-04-17  
**Goal:** Premier real estate website for Sky View Homes, Jackson TN — lead generation, beautiful listings, and brand authority.

---

## Stack

- **Next.js 15** (App Router) — frontend framework
- **Sanity v3** — headless CMS for all content
- **Tailwind CSS** — styling
- **Netlify** — hosting + form handling (existing account)
- **Domain:** skyviewhomestn.com (DNS pointed from GoDaddy to Netlify)

---

## Pages

| Page | Purpose |
|------|---------|
| Home | Hero CTA, featured listings, about snapshot, testimonials |
| Active Listings | Filterable grid by beds, price, status |
| Sold Listings | Social proof / track record |
| Listing Detail | Full gallery, specs, lead capture form |
| Gallery | Project photo showcase |
| About | Mari Acuna bio, 20+ year story, trust signals |
| Affordable Homes | Dedicated initiative page |
| Contact | Form, map embed, phone |

---

## Sanity Content Schema

**Listing**
- address, price, beds, baths, sqft
- status: `active` | `sold`
- photos (array), floor plan image
- description, featured flag

**Testimonial**
- name, quote, star rating

**Gallery Project**
- title, category, photos (array)

**Site Settings** (singleton)
- phone, address, Mari bio, hero headline/subtext

---

## Visual Design

**Palette:** Dark navy/charcoal + warm gold accents + crisp white  
**Typography:** Serif headlines (trust/elegance) + sans-serif body  
**Aesthetic:** Premium, clean, Southern warmth — upscale without being cold

**Key UX patterns:**
- Full-bleed hero with dual CTA: "View Listings" + "Contact Mari"
- Listing cards with hover zoom + quick-stats overlay
- Lead capture form on every listing detail page
- Mobile-first responsive layout
- Next.js Image for optimized photo loading
- Netlify Forms for zero-config form submissions

---

## Content Strategy

- Photos: sourced from existing skyviewhomestn.com
- Copy: placeholder text for launch, updated by owner via Sanity Studio
- Listings/testimonials: managed entirely through Sanity Studio (no code required)

---

## Non-Goals

- MLS/IDX integration (not in scope)
- User accounts or saved listings
- Online payments or reservations
