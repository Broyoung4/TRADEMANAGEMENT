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
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gradient-to-b`}
      >
        <Provider>
          <div className="flex flex-col min-h-screen">
            <main className="flex-grow">
              <Nav />

              {children}
            </main>
            <footer className="mt-auto border-t border-slate-700/50 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 text-slate-300 py-8 px-4">
              <div className="max-w-7xl mx-auto">
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">🏢</span>
                    <span>&copy; <FooterYear /> <span className="font-semibold text-slate-100">Trade Track</span></span>
                  </div>
                  <span className="text-slate-500">Inventory Management Made Simple</span>
                </div>
              </div>
            </footer>
          </div>
        </Provider>
      </body>
    </html>
  );
}
