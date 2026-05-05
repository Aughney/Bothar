import type { Metadata } from "next";
import { Cinzel } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import Footer from "./components/Footer";

const cinzel = Cinzel({
  variable: "--font-display",
  subsets: ["latin", "latin-ext"],
  weight: ["400", "600", "700"],
});

export const metadata: Metadata = {
  title: "Bóthar — rural lifts on Solana",
  description:
    "A Solana-powered lift-share network for rural communities where taxis and public transport don't exist.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${cinzel.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <Providers>
          {children}
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
