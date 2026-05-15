import type { Metadata } from "next";
import { Space_Grotesk, Open_Sans } from "next/font/google";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
});

const openSans = Open_Sans({
  variable: "--font-open-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Ether Ship",
  description: "Ether Ship",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${spaceGrotesk.variable} ${openSans.variable} h-full antialiased bg-white`}>
      <body className="min-h-full">{children}</body>
    </html>
  );
}
