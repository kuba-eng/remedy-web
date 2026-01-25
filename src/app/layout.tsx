import type { Metadata } from "next";
import { Sora, Manrope } from "next/font/google";
import "./globals.css";
import { FloatingLogo } from "@/components/layout/FloatingLogo";
import { StickMan } from "@/components/ui/StickMan";
import { RemedySnack } from "@/components/ui/RemedySnack";
import { CookieConsent } from "@/components/ui/CookieConsent";
import { AnimationProvider } from "@/context/AnimationContext";

const sora = Sora({
  variable: "--font-sora",
  subsets: ["latin"],
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
});

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": "REMEDY | Fyzioterapie a manuální terapie",
  "image": "https://remedy-web.vercel.app/images/og-image.jpg", // Placeholder
  "description": "Prémiová péče o vaše tělo. Fyzioterapie, masáže, cvičení a prevence. Individuální přístup a moderní metody.",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "Náměstí Republiky 148", // Placeholder
    "addressLocality": "Žďár nad Sázavou",
    "postalCode": "591 01",
    "addressCountry": "CZ"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": 49.562, // Placeholder
    "longitude": 15.939 // Placeholder
  },
  "url": "https://remedy-web.vercel.app",
  "telephone": "+420 123 456 789", // Placeholder
  "openingHoursSpecification": [
    {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday"
      ],
      "opens": "08:00",
      "closes": "20:00"
    }
  ],
  "priceRange": "$$"
}

export const metadata: Metadata = {
  title: "REMEDY | Fyzioterapie a manuální terapie",
  description: "Prémiová péče o vaše tělo. Fyzioterapie, masáže, cvičení a prevence. Individuální přístup a moderní metody pro vaše zdraví.",
  keywords: ["fyzioterapie", "masáže", "manuální terapie", "rehabilitace", "kinesiotaping", "zdravotní cvičení", "Žďár nad Sázavou", "Remedy"],
  authors: [{ name: "Remedy Medical Fitness" }],
  openGraph: {
    title: "REMEDY | Fyzioterapie a manuální terapie",
    description: "Prémiová péče o vaše tělo. Fyzioterapie, masáže, cvičení a prevence.",
    url: "https://remedy-web.vercel.app",
    siteName: "Remedy Medical Fitness",
    locale: "cs_CZ",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "REMEDY | Fyzioterapie a manuální terapie",
    description: "Prémiová péče o vaše tělo. Fyzioterapie, masáže, cvičení a prevence.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="cs" className="scroll-smooth">
      <body
        className={`${sora.variable} ${manrope.variable} antialiased font-sans`}
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <AnimationProvider>
          {children}
          <FloatingLogo />
          <StickMan />
          <RemedySnack />
          <CookieConsent />
        </AnimationProvider>
      </body>
    </html>
  );
}

