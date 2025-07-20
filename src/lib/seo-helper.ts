/**
 * SEO utilities for the application
 * Helps generate structured data and meta tags for better search engine visibility
 */

/**
 * Generate organization structured data JSON-LD
 */
export function generateOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "فارماکلیک",
    "url": "https://clickpharma.ir",
    "logo": "https://clickpharma.ir/static/images/logo.png",
    "sameAs": [
      "https://twitter.com/yourcompany",
      "https://facebook.com/yourcompany",
      "https://instagram.com/yourcompany"
    ],
    "description": "سیستم مشاور دارویی و پزشکی هوشمند با پشتیبانی هوش مصنوعی",
    "founder": {
      "@type": "Person",
      "name": "بنیانگذار فارماکلیک"
    }
  };
}

/**
 * Generate FAQ structured data for common medical questions
 */
export function generateFAQSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "چطور می‌توانم یادآور دارویی تنظیم کنم؟",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "برای تنظیم یادآور، وارد بخش یادآور دارو شوید، روی دکمه «داروی جدید» کلیک کنید، مشخصات دارو و برنامه مصرف را وارد کنید و در نهایت یادآور را ذخیره کنید."
        }
      },
      {
        "@type": "Question",
        "name": "آیا می‌توانم از چت‌بات برای سوالات پزشکی استفاده کنم؟",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "بله، چت‌بات هوشمند فارماکلیک می‌تواند به سوالات پزشکی و دارویی شما پاسخ دهد. همچنین می‌توانید تصویر داروها را آپلود کنید تا اطلاعات آنها را دریافت کنید."
        }
      },
      {
        "@type": "Question",
        "name": "آیا استفاده از فارماکلیک رایگان است؟",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "بله، استفاده از امکانات اصلی فارماکلیک شامل چت‌بات پزشکی و یادآور دارو رایگان است."
        }
      },
      {
        "@type": "Question",
        "name": "آیا اطلاعات دارویی من محرمانه می‌ماند؟",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "بله، حفظ حریم خصوصی کاربران اولویت ماست. اطلاعات شما به صورت رمزگذاری شده ذخیره می‌شود و با هیچ شخص ثالثی به اشتراک گذاشته نمی‌شود."
        }
      },
      {
        "@type": "Question",
        "name": "چه نوع سوالات پزشکی می‌توانم از چت‌بات بپرسم؟",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "می‌توانید درباره اطلاعات داروها، عوارض جانبی، تداخلات دارویی، دوز مصرف، و سایر اطلاعات دارویی و پزشکی سوال کنید. توجه داشته باشید که چت‌بات جایگزین مشاوره پزشک نیست."
        }
      }
    ]
  };
}

/**
 * Generate MedicalWebPage structured data
 */
export function generateMedicalWebPageSchema(title: string, description: string) {
  return {
    "@context": "https://schema.org",
    "@type": "MedicalWebPage",
    "headline": title,
    "description": description,
    "mainContentOfPage": {
      "@type": "WebPageElement",
      "isPartOf": {
        "@id": "https://clickpharma.ir/#website"
      }
    },
    "specialty": ["Pharmacy", "Medical"],
    "audience": "General public"
  };
}

/**
 * Generate BreadcrumbList structured data
 */
export function generateBreadcrumbSchema(items: {name: string, url: string}[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": item.url
    }))
  };
}

/**
 * Generate WebApplication structured data
 */
export function generateWebAppSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "فارماکلیک - سیستم مشاور دارویی و پزشکی هوشمند",
    "applicationCategory": "HealthApplication",
    "operatingSystem": "Web",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "IRR"
    },
    "featureList": "چت‌بات پزشکی، یادآور دارو، اطلاعات دارویی، تشخیص دارو از روی تصویر"
  };
}

/**
 * Generate rich meta tags for a page
 */
export function generateMetaTags(title: string, description: string, keywords: string[] = [], imagePath: string = "/static/images/og-image.jpg") {
  return {
    title,
    description,
    keywords: keywords.join(", "),
    openGraph: {
      title,
      description,
      type: "website",
      locale: "fa_IR",
      url: "https://clickpharma.ir",
      siteName: "فارماکلیک",
      images: [
        {
          url: `https://clickpharma.ir${imagePath}`,
          width: 1200,
          height: 630,
          alt: title,
        }
      ]
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [`https://clickpharma.ir${imagePath}`],
    }
  };
} 