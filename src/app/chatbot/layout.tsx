import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "چت‌بات هوشمند پزشکی | فارماکلیک - پاسخ به سوالات دارویی و پزشکی",
  description: "با چت‌بات هوشمند فارماکلیک گفتگو کنید و پاسخ سوالات پزشکی و دارویی خود را دریافت کنید. امکان آپلود تصویر دارو و تشخیص آن با هوش مصنوعی",
  keywords: "چت‌بات پزشکی، ربات پزشکی، مشاوره دارویی آنلاین، هوش مصنوعی دارویی، سوالات پزشکی، اطلاعات دارویی، تداخلات دارویی",
  openGraph: {
    title: "چت‌بات هوشمند پزشکی | فارماکلیک",
    description: "پاسخ به سوالات دارویی و پزشکی با هوش مصنوعی",
    type: "website",
    locale: "fa_IR",
    siteName: "فارماکلیک",
  },
  twitter: {
    card: "summary_large_image",
    title: "چت‌بات هوشمند پزشکی | فارماکلیک",
    description: "پاسخ به سوالات دارویی و پزشکی با هوش مصنوعی",
  },
};

export default function ChatbotLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
} 