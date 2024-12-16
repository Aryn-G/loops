import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Footer from "./_components/Footer";
import Navbar from "./_components/Navbar";
import { DESCRIPTION } from "./_lib/constants";

const grot = localFont({
  src: "./_fonts/BricolageGrotesque-VariableFont_opsz,wdth,wght.ttf",
  variable: "--font-grot",
  weight: "100 200 300 400 500 600 700 800 900",
});

export const metadata: Metadata = {
  title: "Loops",
  description: DESCRIPTION,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link
          rel="search"
          type="application/opensearchdescription+xml"
          href="/opensearch.xml"
          title="ShortName"
        />
      </head>
      <body
        className={`${grot.variable} font-grot text-base px-3 min-h-screen relative flex flex-col antialiased`}
      >
        <Navbar />
        <main className="flex-1 flex flex-col pt-20">
          <div className="w-full md:px-20 max-w-sm md:max-w-screen-2xl mx-auto">
            {children}
          </div>
        </main>
        <Footer />
      </body>
    </html>
  );
}
