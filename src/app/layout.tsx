import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Provider from "@/components/Provider";
import Nav from "@/components/Nav";
import FooterYear from "@/components/FooterYear";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Trade Track",
  description: "trade inventory app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Provider>
          <div className="flex flex-col min-h-screen">
            <main className="flex-grow">
              <Nav />

              {children}
            </main>
            <footer className="bg-gray-800 text-white py-4 text-center">
              &copy; <FooterYear /> Trade Track. All rights
              reserved.
            </footer>
          </div>
        </Provider>
      </body>
    </html>
  );
}
