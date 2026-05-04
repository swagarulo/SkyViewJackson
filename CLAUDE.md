@AGENTS.md

# Sky View Homes Website

Built with Next.js 16, Sanity CMS, Tailwind CSS v4, deployed on Netlify.

## Live Site
https://skyviewhomestn.com

## Content Management
All listings, photos, prices, and contact info are managed at:
https://skyviewhomestn.com/studio

For content changes (no code needed) — use the studio.
For design/code changes — edit files here and deploy.

## Deploy
```bash
netlify deploy --prod
```

## Key Files
- `src/app/` — pages
- `src/components/` — reusable UI components
- `src/sanity/` — CMS queries and schema
- `src/app/globals.css` — colors and fonts (Tailwind v4 CSS-based config)
- `public/` — static assets

## Colors & Fonts
- Navy: `#1a2744`
- Gold: `#c9a84c`
- Serif font: Playfair Display (headings)

## Sanity Project
- Project ID: `wcgh2vzx`
- Dataset: `production`

## Important Notes
- Listing detail pages use `revalidate = 0` (always fresh from Sanity)
- Other pages use `revalidate = 3600` (cached 1 hour, updated on next deploy)
- Netlify Forms does not work with Next.js — contact form needs a separate fix
