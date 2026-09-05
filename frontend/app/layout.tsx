import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import './globals.css'
import { Navbar } from '@/components/navbar'
import { ToastProvider } from '@/components/ui/custom-toast'
import { AppQueryProvider } from '@/components/providers/query-provider'
import { WebSiteSchema, EducationalOrganizationSchema } from '@/components/seo/json-ld'
import { FloatingAiChatClient } from '@/components/ai/floating-ai-chat-client'

const rawSiteUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://university-admission-assistant.vercel.app';
const siteUrl = rawSiteUrl.replace(/\/+$/, '');

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'EduGuide — Bangladesh University Admission & Preparation',
    template: '%s | EduGuide',
  },
  description:
    'Official Bangladesh university admission circulars, GPA eligibility qualifier, deadlines, and smart preparation for BUET, DU, Medical, and GST 2026.',
  keywords: [
    'university admission 2026',
    'BUET admission 2026',
    'DU admission circular',
    'medical admission test Bangladesh',
    'GST admission eligibility',
    'admission GPA calculator',
    'admission circulars Bangladesh',
    'admission test preparation',
  ],
  authors: [{ name: 'EduGuide Academic Advisory Board', url: siteUrl }],
  creator: 'EduGuide Bangladesh',
  publisher: 'EduGuide',
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: siteUrl,
    siteName: 'EduGuide Bangladesh',
    title: 'EduGuide — Bangladesh University Admission & Preparation',
    description:
      'Official Bangladesh university admission circulars, GPA eligibility qualifier, deadlines, and smart preparation for BUET, DU, Medical, and GST 2026.',
    images: [
      {
        url: '/icon.svg',
        width: 512,
        height: 512,
        alt: 'EduGuide Bangladesh Brand Logo',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'EduGuide — Bangladesh University Admission & Preparation',
    description:
      'Official Bangladesh university admission circulars, GPA eligibility qualifier, deadlines, and smart preparation for BUET, DU, Medical, and GST 2026.',
    images: ['/icon.svg'],
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
  icons: {
    icon: '/icon.svg',
    shortcut: '/icon.svg',
    apple: '/icon.svg',
  },
  verification: {
    google: 'DM4k-Q6VQBItqCk_r-fWuYEspIJTaFJ8Dg_BneuaJPI',
  },
};

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
        <WebSiteSchema url={siteUrl} searchUrl={`${siteUrl}/universities?search={search_term_string}`} />
        <EducationalOrganizationSchema url={siteUrl} logo={`${siteUrl}/images/eduguide_logo.png`} />
        <AppQueryProvider>
          <ToastProvider>
            <Navbar />
            <main className="flex-1 w-full max-w-full overflow-x-clip">{children}</main>
            <FloatingAiChatClient />
            {process.env.NODE_ENV === 'production' && <Analytics />}
          </ToastProvider>
        </AppQueryProvider>
      </body>
    </html>
  )
}
