import type { Metadata } from 'next'
import './globals.css'
import { Toaster } from 'sonner'

export const metadata: Metadata = {
  title: {
    default: 'Areum Cosmoherb — Natural Herbal Personal Care',
    template: '%s | Areum Cosmoherb',
  },
  description:
    'Thoughtfully crafted herbal personal care products. Made with carefully selected natural ingredients for everyday beauty and wellness.',
  keywords: ['herbal cosmetics', 'natural personal care', 'herbal shampoo', 'herbal soap', 'areum cosmoherb'],
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: process.env.NEXT_PUBLIC_APP_URL,
    siteName: 'Areum Cosmoherb',
    title: 'Areum Cosmoherb — Natural Herbal Personal Care',
    description: 'Thoughtfully crafted herbal personal care products inspired by traditional herbal care.',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>
        {children}
        <Toaster
          position="top-center"
          toastOptions={{
            style: {
              background: '#1a3a2a',
              color: '#fff',
              border: 'none',
            },
          }}
        />
      </body>
    </html>
  )
}
