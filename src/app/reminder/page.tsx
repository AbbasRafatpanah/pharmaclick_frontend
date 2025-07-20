"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import axios from "axios";
import { toast } from "sonner";
import { 
  GradientBlob, 
  GridPattern, 
  FloatingParticles,
  Pills,
  MedicineBottle,
  Syringe
} from "@/components/BackgroundElements";
import { NotificationGuide } from "@/components/ui/notification-guide";
import Script from "next/script";
import { generateBreadcrumbSchema } from "@/lib/seo-helper";
import { API_ENDPOINTS, authHeaders } from "@/lib/api-config";

// Removed metadata export - cannot export metadata from a client component

// تایپ داده‌های دارو
interface Medication {
  id: number;
  name: string;
  description?: string;
  dosage?: string;
  created_at: string;
  reminders_count: number;
}

export default function RemindersPage() {
  const [medications, setMedications] = useState<Medication[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Generate breadcrumb schema
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "صفحه اصلی", url: "https://clickpharma.ir/" },
    { name: "یادآور دارو", url: "https://clickpharma.ir/reminder" }
  ]);

  // دریافت داروها
  useEffect(() => {
    const fetchMedications = async () => {
      try {
        const token = localStorage.getItem("access_token");
        if (!token) {
          router.push("/auth/login");
          return;
        }

        const response = await axios.get(API_ENDPOINTS.REMINDER.MEDICATIONS, {
          headers: authHeaders()
        });
        setMedications(response.data);
      } catch (error) {
        console.error("Error fetching medications:", error);
        toast.error("خطا در دریافت لیست داروها");
      } finally {
        setIsLoading(false);
      }
    };

    fetchMedications();
  }, [router]);

  // حذف دارو
  const handleDeleteMedication = async (id: number) => {
    if (!confirm("آیا از حذف این دارو اطمینان دارید؟")) {
      return;
    }

    try {
      const token = localStorage.getItem("access_token");
      if (!token) return;

      await axios.delete(API_ENDPOINTS.REMINDER.MEDICATION(id), {
        headers: authHeaders()
      });

      setMedications((prevMedications) =>
        prevMedications.filter((med) => med.id !== id)
      );
      toast.success("دارو با موفقیت حذف شد");
    } catch (error) {
      console.error("Error deleting medication:", error);
      toast.error("خطا در حذف دارو");
    }
  };

  // فرمت تاریخ
  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    
    try {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat("fa-IR", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }).format(date);
    } catch (error) {
      console.error("Error formatting date:", error);
      return "تاریخ نامعتبر";
    }
  };

  return (
    <>
      {/* Structured data for breadcrumb */}
      <Script
        id="jsonld-breadcrumb"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbSchema)
        }}
      />

      {/* Structured data for MedicationSchedule */}
      <Script
        id="jsonld-medication"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "MedicalWebPage",
            "headline": "سیستم یادآور دارویی هوشمند فارماکلیک",
            "description": "با سیستم یادآور دارویی هوشمند فارماکلیک، مصرف به موقع داروها را فراموش نکنید.",
            "about": {
              "@type": "Thing",
              "name": "مدیریت دارویی و یادآور مصرف",
              "description": "سامانه یادآور دارویی برای کمک به مصرف به موقع داروها با ارسال نوتیفیکیشن و تنظیم برنامه مصرف دارو"
            },
            "specialty": ["Medication Management", "Pharmacy"]
          })
        }}
      />

      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800 py-8 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Background Elements */}
        <GridPattern className="opacity-30" />
        <GradientBlob className="top-20 left-20 w-96 h-96 opacity-10" color="blue" />
        <GradientBlob className="bottom-20 right-20 w-96 h-96 opacity-10" color="purple" />
        <FloatingParticles count={12} />
        
        <MedicineBottle className="top-40 right-[10%] text-blue-500/20 animate-float" size={80} />
        <Pills className="bottom-40 left-[10%] text-blue-500/20 animate-float" size={80} />
        <Syringe className="top-[60%] right-[30%] text-blue-500/20 animate-float" size={60} />
  
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
            <div className="mb-4 sm:mb-0 animate-fadeIn">
              <h1 className="text-3xl font-bold text-blue-800 dark:text-blue-300 text-glow">یادآور داروها</h1>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                مدیریت هوشمند داروها و تنظیم یادآور برای مصرف به موقع
              </p>
            </div>
            <div className="flex flex-wrap gap-3 animate-slideDown">
              <Link href="/reminder/new-medication">
                <button className="gradient-button py-2 px-4 flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                  </svg>
                  <span>افزودن داروی جدید</span>
                </button>
              </Link>
              <Link href="/">
                <button className="button-secondary py-2 px-4 flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                  </svg>
                  <span>بازگشت به خانه</span>
                </button>
              </Link>
            </div>
          </div>
  
          {/* راهنمای نوتیفیکیشن */}
          <NotificationGuide />

          {isLoading ? (
            <div className="flex justify-center items-center h-64 animate-fadeIn">
              <div className="loader"></div>
            </div>
          ) : medications.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {medications.map((medication, index) => (
                <div 
                  key={medication.id} 
                  className="card-hover glassmorphism shadow-lg rounded-xl overflow-hidden animate-slideRight"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="p-6">
                    <div className="flex justify-between items-start">
                      <h2 className="text-xl font-bold text-blue-800 dark:text-blue-300 mb-2">{medication.name}</h2>
                      <div className="flex flex-row items-center justify-center bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-300 rounded-full px-3 py-1 text-sm font-medium">
                        <span>{medication.reminders_count}</span>
                        <span className="mr-1">یادآوری</span>
                      </div>
                    </div>
                    
                    {medication.description && (
                      <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">{medication.description}</p>
                    )}
                    
                    {medication.dosage && (
                      <div className="flex items-center text-gray-600 dark:text-gray-400 mb-4">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 1 0 010-2h1V3a1 1 0 011-1zm0 10a1 1 0 011 1v1h1a1 1 0 110 2H6v1a1 1 0 11-2 0v-1H3a1 1 0 110-2h1v-1a1 1 0 011-1zM12 2a1 1 0 01.967.744L14.146 7.2 17.5 9.134a1 1 0 010 1.732l-3.354 1.935-1.18 4.455a1 1 0 01-1.933 0L9.854 12.8 6.5 10.866a1 1 0 010-1.732l3.354-1.935 1.18-4.455A1 1 0 0112 2z" clipRule="evenodd" />
                        </svg>
                        <span>دوز: {medication.dosage}</span>
                      </div>
                    )}
                    
                    <div className="flex items-center text-gray-500 dark:text-gray-400 text-sm mb-4">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                      </svg>
                      <span>تاریخ ثبت: {formatDate(medication.created_at)}</span>
                    </div>
                    
                    <div className="flex justify-between mt-4">
                      <Link href={`/reminder/medications/${medication.id}`}>
                        <button className="button-secondary py-1.5 px-3 text-sm flex items-center gap-1">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                            <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                          </svg>
                          <span>مشاهده</span>
                        </button>
                      </Link>
                      
                      <div className="flex space-x-2 space-x-reverse">
                        <Link href={`/reminder/medications/${medication.id}/new-reminder`}>
                          <button className="button-primary py-1.5 px-3 text-sm flex items-center gap-1">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                            </svg>
                            <span>یادآوری جدید</span>
                          </button>
                        </Link>
                        
                        <button
                          onClick={() => handleDeleteMedication(medication.id)}
                          className="button-danger py-1.5 px-3 text-sm flex items-center gap-1"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                          <span>حذف</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-64 bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-xl shadow-lg p-8 glassmorphism animate-scaleUp">
              <div className="text-6xl mb-6 text-blue-500 animate-bounce-slow">💊</div>
              <h2 className="text-xl font-bold text-blue-800 dark:text-blue-300 mb-4 text-glow">هنوز دارویی ثبت نکرده‌اید</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-4 text-center">
                برای شروع استفاده از سیستم یادآوری دارو، ابتدا باید داروهای خود را اضافه کنید.
              </p>
              <Link href="/reminder/new-medication">
                <button className="gradient-button py-2 px-4 flex items-center gap-2 mt-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                  </svg>
                  <span>افزودن داروی جدید</span>
                </button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </>
  );
} 