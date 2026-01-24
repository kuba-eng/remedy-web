import type { Metadata } from "next";
import { Sora, Manrope } from "next/font/google";
import "./globals.css";
import { FloatingLogo } from "@/components/layout/FloatingLogo";
import { StickMan } from "@/components/ui/StickMan";
import { CapacityAlert } from "@/components/ui/CapacityAlert";
import { AnimationProvider } from "@/context/AnimationContext";

const sora = Sora({
  variable: "--font-sora",
  subsets: ["latin"],
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
});

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
        <AnimationProvider>
          {children}
          <FloatingLogo />
          <CapacityAlert />
          <StickMan />
        </AnimationProvider>
      </body>
    </html>
  );
}

