import type { Metadata } from "next";
import "@/styles/globals.css";
import { Providers } from "./providers";
import { Vazirmatn } from "next/font/google";
import { cn } from "@/lib/utils";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

// Load Vazirmatn font for Persian text
const vazirmatn = Vazirmatn({
  subsets: ["arabic", "latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-vazirmatn",
  display: "swap",
});

export const metadata: Metadata = {
  title: "فارماکلیک | سیستم مشاور دارویی و پزشکی هوشمند با هوش مصنوعی",
  description: "فارماکلیک - مشاور دارویی هوشمند و یادآور مصرف دارو با پشتیبانی هوش مصنوعی | پاسخ به سوالات پزشکی، اطلاعات دارویی، تداخلات دارویی و برنامه‌ریزی مصرف دارو",
  keywords: "سوالات پزشکی، ربات پزشکی، هوش مصنوعی دارویی، مشاور دارویی، یادآور دارو، اطلاعات دارویی، تداخل دارویی، چت‌بات پزشکی، پاسخ به سوالات دارویی، مدیریت دارو",
  authors: [{ name: "فارماکلیک" }],
  creator: "فارماکلیک",
  publisher: "فارماکلیک",
  category: "سلامت و پزشکی",
  applicationName: "فارماکلیک",
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "فارماکلیک | سیستم مشاور دارویی و پزشکی هوشمند با هوش مصنوعی",
    description: "پاسخ به سوالات پزشکی، اطلاعات دارویی و یادآور مصرف دارو با پشتیبانی هوش مصنوعی",
    type: "website",
    locale: "fa_IR",
    siteName: "فارماکلیک",
  },
  twitter: {
    card: "summary_large_image",
    title: "فارماکلیک | مشاور دارویی هوشمند",
    description: "پاسخ به سوالات پزشکی، اطلاعات دارویی و یادآور مصرف دارو با پشتیبانی هوش مصنوعی",
  },
  icons: {
    icon: "/favicon.ico",
  },
  alternates: {
    canonical: "/",
  },
  verification: {
    google: "verification_token",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fa" dir="rtl" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0" />
      </head>
      <body className={cn(
        "min-h-screen font-sans antialiased bg-gradient-to-b from-gray-50 to-white dark:from-gray-950 dark:to-gray-900",
        vazirmatn.variable
      )}>
        <Providers>
          <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-1">
              {children}
            </main>
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  );
} 