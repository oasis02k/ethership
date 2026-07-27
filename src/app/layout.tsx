import type { Metadata } from "next";
import { Space_Grotesk, Cormorant_Garamond, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import PageTransition from "./PageTransition";
import SmoothScroll from "./SmoothScroll";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
});

const cormorantGaramond = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["600", "700"],
  style: ["normal", "italic"],
});

const ibmPlexMono = IBM_Plex_Mono({
  variable: "--font-ibm-plex-mono",
  subsets: ["latin"],
  weight: ["500"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://ethership.vercel.app"),
  title: "Ether Ship",
  description: "Ether Ship is an architecture practice working across buildings, objects, and speculative art — with experience in New York, Basel, and Seoul. Now based in Seoul, Korea.",
  openGraph: {
    siteName: "Ether Ship",
    type: "website",
    images: [{ url: "/og-image.jpg", width: 800, height: 400 }],
  },
  twitter: {
    card: "summary_large_image",
    images: ["/og-image.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${spaceGrotesk.variable} ${cormorantGaramond.variable} ${ibmPlexMono.variable}`}>
      <body>
        <SmoothScroll />
        <PageTransition>{children}</PageTransition>
      </body>
    </html>
  );
}
