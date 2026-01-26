/**
 * Root Layout
 * App-wide configuration and providers
 */

import type { Metadata, Viewport } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { GoogleAnalytics } from '@/components/analytics/google-analytics';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const viewport: Viewport = {
  themeColor: '#f59e0b',
  width: 'device-width',
  initialScale: 1,
};

export const metadata: Metadata = {
  title: {
    default: 'BatchTrack - Inventory Management for Production Businesses',
    template: '%s | BatchTrack',
  },
  description:
    'Track your COGS, manage inventory, and reduce waste with BatchTrack. Built for bakeries, breweries, and small food production businesses.',
  keywords: [
    'inventory management',
    'recipe costing',
    'COGS calculator',
    'bakery software',
    'brewery inventory',
    'food production',
    'batch tracking',
    'ingredient management',
    'cost of goods sold',
    'small business inventory',
  ],
  authors: [{ name: 'BatchTrack' }],
  creator: 'BatchTrack',
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://batchtrack.vercel.app'),
  openGraph: {
    type: 'website',
    locale: 'en_US',
    siteName: 'BatchTrack',
    title: 'BatchTrack - Know Your True Cost of Goods',
    description:
      'Inventory management for bakeries, breweries, and food producers. Track ingredients, cost recipes, and manage production.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'BatchTrack - Know Your True Cost of Goods',
    description:
      'Inventory management for bakeries, breweries, and food producers. Track ingredients, cost recipes, and manage production.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <GoogleAnalytics />
        {children}
      </body>
    </html>
  );
}
