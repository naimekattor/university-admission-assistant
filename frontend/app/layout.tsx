import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import './globals.css'
import { Navbar } from '@/components/navbar'
import { ToastProvider } from '@/components/ui/custom-toast'

export const metadata: Metadata = {
  title: 'EduGuide - AI-Powered University Admission Preparation for Bangladesh',
  description: 'AI-powered personal admission coach for Bangladeshi students preparing for BUET, DU, Medical, and Engineering admission tests.',
  generator: 'v0.app',
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
  verification: {
    google: 'DM4k-Q6VQBItqCk_r-fWuYEspIJTaFJ8Dg_BneuaJPI',
  },
}

export const viewport: Viewport = {
  colorScheme: 'light',
  themeColor: '#FAF8F5',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="bg-[#FAF8F5] text-slate-900">
      <body className="antialiased min-h-screen flex flex-col bg-[#FAF8F5] text-slate-900">
        <ToastProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
          {process.env.NODE_ENV === 'production' && <Analytics />}
        </ToastProvider>
      </body>
    </html>
  )
}
