import { ThemeProvider } from "@/components/providers/theme-provider";
import type { Metadata } from "next";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import {
  Cairo,
  Cormorant_Garamond,
  Geist,
  Geist_Mono,
  Space_Grotesk,
} from "next/font/google";
import { Toaster } from "sonner";
import "../globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const brandSerif = Cormorant_Garamond({
  variable: "--font-brand-serif",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const modernSans = Space_Grotesk({
  variable: "--font-modern-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const cairo = Cairo({
  variable: "--font-cairo",
  subsets: ["arabic"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  title: {
    default: 'Esnaad',
    template: '%s | Esnaad ',
  },
  description: 'اسناد للتطوير العقاري: خبرة أكثر من 20 عاماً في بناء مجتمعات سكنية فاخرة في دبي، حيث تلتقي الأناقة بالجودة في كل مشروع. ',
  keywords: ['اسناد', "Esnaad" ,"Esnaad Real Estate","Esnaad Development","Esnaad Real Estate Development","Esnaad Development Company","Esnaad Dubai","شركة اسناد","اسناد دبي","مطور عقاري إماراتي","Esnaad Real Estate Development Company",'اسناد للتطوير العقاري', 'اسناد العقارية', 'شركة تطوير عقاري في دبي', 'مطور عقاري في دبي', "التطوير العقاري في دبي", "مشاريع عقارية في دبي"],
  authors: [{ name: 'Esnaad Team' }],
  creator: 'Esnaad Team',
  publisher: 'Esnaad',
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/favicon.ico',
  },
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: '/',
    title: 'Esnaad',
    description: 'اسناد للتطوير العقاري: خبرة أكثر من 20 عاماً في بناء مجتمعات سكنية فاخرة في دبي، حيث تلتقي الأناقة بالجودة في كل مشروع. ',
    siteName: 'Esnaad',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Esnaad',
    description: 'Esnaad Real Estate Development Company',
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
  verification: {
    // Add these later when you have the verification codes
    // google: 'your-google-verification-code',
    // yandex: 'your-yandex-verification-code',
    // bing: 'your-bing-verification-code',
  },
};

export default async function Layout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;
  const messages = await getMessages();
  const direction = locale === 'ar' ? 'rtl' : 'ltr';

  return (
    <html lang={locale} dir={direction} className="w-full h-full" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                const themeName = localStorage.getItem('theme-name') || 'amber';
                const themeMode = localStorage.getItem('theme-mode');
                // Default to dark mode if no saved preference
                const isDark = themeMode === null ? true : themeMode === 'dark';
                document.documentElement.setAttribute('data-theme', themeName);
                if (isDark) {
                  document.documentElement.classList.add('dark');
                } else {
                  document.documentElement.classList.remove('dark');
                }
              } catch (e) {}
            `,
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${brandSerif.variable} ${modernSans.variable} ${cairo.variable} antialiased w-full h-full font-sans`}
      >
        <NextIntlClientProvider messages={messages}>
          <ThemeProvider>
            {children}
            <Toaster />
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
