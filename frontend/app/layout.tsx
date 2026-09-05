import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import './globals.css'
import { Navbar } from '@/components/navbar'
import { ToastProvider } from '@/components/ui/custom-toast'
import { FloatingAiChat } from '@/components/ai/floating-ai-chat'
export const metadata: Metadata = {
  title: 'EduGuide - AI-Powered University Admission Preparation for Bangladesh',
  description: 'AI-powered personal admission coach for Bangladeshi students preparing for BUET, DU, Medical, and Engineering admission tests.',
  generator: 'v0.app',
  icons: {
    icon: '/icon.svg',
    shortcut: '/icon.svg',
    apple: '/icon.svg',
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
    <html lang="en" className="bg-[#FAF8F5] text-slate-900 overflow-x-hidden">
      <body className="antialiased min-h-screen flex flex-col bg-[#FAF8F5] text-slate-900 overflow-x-hidden">
        <ToastProvider>
          <Navbar />
          <main className="flex-1 w-full max-w-full overflow-x-clip">{children}</main>
          <FloatingAiChat />
          {process.env.NODE_ENV === 'production' && <Analytics />}
        </ToastProvider>
      </body>
    </html>
  )
}
