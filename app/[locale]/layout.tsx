import { GoogleAnalytics } from "@/components/analytics";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { StructuredData } from "@/components/seo/structured-data";
import { getSiteUrl, buildHreflangAlternates } from "@/lib/site-config";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
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

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const isArabic = locale === 'ar';
  const siteUrl = getSiteUrl();

  // Locale-specific content
  const ogImage = isArabic ? '/og-image-ar.png' : '/og-image.png';
  const ogLocale = isArabic ? 'ar_AE' : 'en_US';
  const ogAltLocale = isArabic ? 'en_US' : 'ar_AE';
  const description = isArabic
    ? 'اسناد للتطوير العقاري: خبرة أكثر من 20 عاماً في بناء مجتمعات سكنية فاخرة في دبي، حيث تلتقي الأناقة بالجودة في كل مشروع.'
    : 'Esnaad Real Estate Development: Over 20 years of experience building luxury residential communities in Dubai, where elegance meets quality in every project.';
  const ogAlt = isArabic ? 'اسناد للتطوير العقاري' : 'Esnaad - Real Estate Development';

  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: 'Esnaad',
      template: '%s | Esnaad',
    },
    description,
    keywords: ['اسناد', "Esnaad", "Esnaad Real Estate", "Esnaad Development", "Esnaad Real Estate Development", "Esnaad Development Company", "Esnaad Dubai", "شركة اسناد", "اسناد دبي", "مطور عقاري إماراتي", "Esnaad Real Estate Development Company", 'اسناد للتطوير العقاري', 'اسناد العقارية', 'شركة تطوير عقاري في دبي', 'مطور عقاري في دبي', "التطوير العقاري في دبي", "مشاريع عقارية في دبي"],
    authors: [{ name: 'Esnaad Team' }],
    creator: 'Esnaad Team',
    publisher: 'Esnaad',
    icons: {
      icon: [
        { url: '/favicon.ico', sizes: 'any' },
        { url: '/icon-192.png', sizes: '192x192', type: 'image/png' },
        { url: '/icon-512.png', sizes: '512x512', type: 'image/png' },
      ],
      shortcut: '/favicon.ico',
      apple: { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    },
    manifest: '/manifest.webmanifest',
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    openGraph: {
      type: 'website',
      locale: ogLocale,
      alternateLocale: ogAltLocale,
      url: '/',
      title: 'Esnaad',
      description,
      siteName: 'Esnaad',
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: ogAlt,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Esnaad',
      description,
      images: [ogImage],
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
    alternates: {
      canonical: `${siteUrl}/${locale}`,
      languages: buildHreflangAlternates(),
    },
    verification: {
      // Add these later when you have the verification codes
      // google: 'your-google-verification-code',
      // yandex: 'your-yandex-verification-code',
      // bing: 'your-bing-verification-code',
    },
  };
}

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
  const siteUrl = getSiteUrl();

  return (
    <html lang={locale} dir={direction} className="w-full h-full" suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <StructuredData locale={locale} siteUrl={siteUrl} />
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
        <GoogleAnalytics />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
