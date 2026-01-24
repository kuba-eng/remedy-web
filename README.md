# REMEDY Web

## Deployment

### Vercel Deployment Steps

1.  **Push to GitHub:** Ensure your project is pushed to a GitHub repository.
2.  **Import to Vercel:**
    -   Go to your [Vercel Dashboard](https://vercel.com/dashboard).
    -   Click "Add New..." -> "Project".
    -   Import your GitHub repository.
3.  **Configure Project:**
    -   **Framework Preset:** Next.js (should detect automatically).
    -   **Root Directory:** `./` (default).
    -   **Build Command:** `npm run build` (or `next build`).
    -   **Output Directory:** `.next` (default).
    -   **Install Command:** `npm install` (default).
4.  **Environment Variables:** Add any necessary `.env` variables in the Vercel project settings under "Settings" -> "Environment Variables".
5.  **Deploy:** Click "Deploy".

### Typography & Fonts
This project uses **Sora** and **Manrope** from Google Fonts, configured in `layout.tsx` via `next/font`.

Nový moderní web pro fyzioterapeutické centrum REMEDY.

## Technologie
- **Next.js 14+** (App Router)
- **Tailwind CSS v4**
- **TypeScript**
- **Lucide React** (ikony)

## Spuštění
1. Instalace závislostí: `npm install`
2. Spuštění lokálního serveru: `npm run dev`
3. Otevřete [http://localhost:3000](http://localhost:3000)

## Struktura
- `src/app`: Hlavní stránky a layout
- `src/components/ui`: Základní UI komponenty (Button, Card, Section...)
- `src/components/layout`: Globální komponenty (Navbar, Footer)
- `src/components/sections`: Jednotlivé sekce landing page (Hero, Služby, Tým...)
- `src/lib/utils.ts`: Pomocné funkce

## Design Systém
Barvy a fonty jsou definovány v `src/app/globals.css`.
- **Primary**: Deep Forest Green `#10312B`
- **Secondary**: Off-white `#FDFCF8`
- **Accent**: Muted Gold `#C5A365`
