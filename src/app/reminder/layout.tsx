import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "یادآور دارو | فارماکلیک - مدیریت هوشمند داروها و یادآوری مصرف",
  description: "با سیستم یادآور دارویی هوشمند فارماکلیک، مصرف به موقع داروها را فراموش نکنید. امکان تنظیم زمان دقیق، تکرار یادآور و دریافت نوتیفیکیشن",
  keywords: "یادآور دارو، مدیریت دارو، مصرف به موقع دارو، برنامه دارویی، نوتیفیکیشن دارو، پیام‌رسان دارویی، تنظیم یادآور دارو، برنامه مصرف دارو",
  openGraph: {
    title: "یادآور دارو | فارماکلیک",
    description: "مدیریت هوشمند داروها و تنظیم یادآور برای مصرف به موقع",
    type: "website",
    locale: "fa_IR",
    siteName: "فارماکلیک",
  },
  twitter: {
    card: "summary_large_image",
    title: "یادآور دارو | فارماکلیک",
    description: "مدیریت هوشمند داروها و تنظیم یادآور برای مصرف به موقع",
  },
};

export default function ReminderLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
} 