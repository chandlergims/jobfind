import type { Metadata } from "next";
import { Geist, Geist_Mono, DM_Mono, DM_Sans } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/Sidebar";
import { AuthProvider } from "@/contexts/AuthContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const dmMono = DM_Mono({
  variable: "--font-dm-mono",
  weight: ["400", "500"],
  subsets: ["latin"],
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  weight: ["400", "500", "700"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "TrenchedIn",
  description: "Connect your wallet and discover job opportunities in the blockchain space",
  metadataBase: new URL('http://localhost:3001'),
  icons: {
    icon: '/logo.png',
    apple: '/logo.png',
  },
  openGraph: {
    images: [
      {
        url: '/logo.png',
        width: 800,
        height: 600,
      }
    ]
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${dmMono.variable} ${dmSans.variable} antialiased`}
      >
        <AuthProvider>
          <div className="flex min-h-svh bg-[#f9f9f9]">
            <Sidebar />
            <main className="relative flex min-h-[calc(100svh-theme(spacing.4))] max-h-[calc(100svh-theme(spacing.4))] overflow-hidden flex-1 flex-col bg-white md:ml-64 md:m-2 md:rounded-l-lg">
              <div className="p-2 pt-12 sm:pt-0 md:p-4 flex-1 h-0 overflow-y-auto relative flex flex-col">
                {children}
              </div>
            </main>
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
