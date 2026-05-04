# Sky View Homes — Setup Guide

## First-Time Setup (do this once)

### 1. Install Node.js
Download and install from: https://nodejs.org (choose the LTS version)

### 2. Install dependencies
Open Terminal, navigate to this folder, and run:
```bash
npm install
```

### 3. Install Netlify CLI
```bash
npm install -g netlify-cli
```

### 4. Log in to Netlify
```bash
netlify login
```
This opens a browser — log in with your Netlify account.

### 5. Link to your site
```bash
netlify link
```
Choose "Use current git remote origin" or select `skyview-homes-tn` from the list.

---

## Making Changes

### Content changes (listings, photos, prices, phone number)
Go to: **https://skyviewhomestn.com/studio**
Make your changes and click Publish. The site updates within an hour.

### Code/design changes
Open this folder in Claude Code and describe what you want changed.
When done, deploy with:
```bash
netlify deploy --prod
```

---

## Environment Variables
The `.env.local` file is included and pre-configured. Do not share it publicly.
