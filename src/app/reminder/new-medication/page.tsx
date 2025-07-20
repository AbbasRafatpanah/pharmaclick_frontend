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
  MedicineBottle
} from "@/components/BackgroundElements";
import { API_ENDPOINTS, authHeaders } from "@/lib/api-config";

export default function NewMedicationPage() {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    dosage: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  // بررسی اعتبار توکن
  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      router.push("/auth/login");
    }
  }, [router]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const token = localStorage.getItem("access_token");
      if (!token) return;

      const response = await axios.post(
        API_ENDPOINTS.REMINDER.MEDICATIONS,
        formData,
        {
          headers: authHeaders()
        }
      );

      toast.success("دارو با موفقیت اضافه شد");
      router.push("/reminder");
    } catch (error: any) {
      console.error("Error adding medication:", error);
      
      if (error.response?.data) {
        const errors = error.response.data;
        
        Object.keys(errors).forEach((key) => {
          const fieldErrors = errors[key];
          if (Array.isArray(fieldErrors) && fieldErrors.length > 0) {
            toast.error(`${key}: ${fieldErrors[0]}`);
          }
        });
      } else {
        toast.error("خطا در افزودن دارو");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Elements */}
      <GridPattern className="opacity-30" />
      <GradientBlob className="top-20 left-20 w-96 h-96 opacity-10" color="blue" />
      <GradientBlob className="bottom-20 right-20 w-96 h-96 opacity-10" color="purple" />
      <FloatingParticles count={12} />
      
      <MedicineBottle className="top-40 right-[10%] text-blue-500/20 animate-float" size={80} />
      <Pills className="bottom-40 left-[10%] text-blue-500/20 animate-float" size={80} />

      <div className="max-w-2xl mx-auto relative z-10">
        <div className="flex items-center mb-8 animate-fadeIn">
          <Link href="/reminder">
            <button className="button-secondary py-2 px-4 ml-4 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
              </svg>
              <span>بازگشت</span>
            </button>
          </Link>
          <h1 className="text-3xl font-bold text-blue-800 dark:text-blue-300 text-glow">افزودن داروی جدید</h1>
        </div>

        <div className="card-premium p-8 rounded-2xl animate-scaleUp">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="animate-slideDown" style={{ animationDelay: "0.1s" }}>
              <label htmlFor="name" className="block text-sm font-medium mb-1">
                نام دارو <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="name"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                placeholder="نام دارو را وارد کنید"
                className="appearance-none relative block w-full px-3 py-3 border border-gray-300 dark:border-gray-600 rounded-md placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white dark:bg-gray-700/70 bg-white/70 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
              />
            </div>

            <div className="animate-slideDown" style={{ animationDelay: "0.2s" }}>
              <label htmlFor="dosage" className="block text-sm font-medium mb-1">
                دوز مصرفی
              </label>
              <input
                type="text"
                id="dosage"
                name="dosage"
                value={formData.dosage}
                onChange={handleChange}
                placeholder="مثال: یک قرص روزانه"
                className="appearance-none relative block w-full px-3 py-3 border border-gray-300 dark:border-gray-600 rounded-md placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white dark:bg-gray-700/70 bg-white/70 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
              />
            </div>

            <div className="animate-slideDown" style={{ animationDelay: "0.3s" }}>
              <label htmlFor="description" className="block text-sm font-medium mb-1">
                توضیحات
              </label>
              <textarea
                id="description"
                name="description"
                rows={4}
                value={formData.description}
                onChange={handleChange}
                placeholder="توضیحات اضافی در مورد دارو"
                className="appearance-none relative block w-full px-3 py-3 border border-gray-300 dark:border-gray-600 rounded-md placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white dark:bg-gray-700/70 bg-white/70 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
              />
            </div>

            <div className="flex justify-end space-x-2 space-x-reverse animate-slideDown" style={{ animationDelay: "0.4s" }}>
              <Link href="/reminder">
                <button 
                  type="button" 
                  className="button-secondary py-2.5 px-6"
                  disabled={isLoading}
                >
                  انصراف
                </button>
              </Link>
              <button
                type="submit"
                disabled={isLoading}
                className={`gradient-button py-2.5 px-6 ${isLoading ? "opacity-70 cursor-not-allowed" : ""}`}
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <svg className="animate-spin h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>در حال ذخیره...</span>
                  </div>
                ) : (
                  "ذخیره"
                )}
              </button>
            </div>
          </form>
        </div>
        
        <div className="mt-8 glassmorphism p-6 rounded-xl animate-fadeIn" style={{ animationDelay: "0.5s" }}>
          <h3 className="text-lg font-semibold text-blue-800 dark:text-blue-300 mb-3 text-glow">راهنمای افزودن دارو</h3>
          <ul className="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-400">
            <li>نام دارو را به صورت دقیق وارد کنید تا در یادآوری‌ها قابل تشخیص باشد</li>
            <li>دوز مصرفی را برای اطلاع از میزان مصرف هر بار وارد کنید</li>
            <li>در قسمت توضیحات می‌توانید اطلاعات تکمیلی مانند دلیل مصرف یا هشدارهای دارو را وارد کنید</li>
            <li>پس از افزودن دارو، می‌توانید یادآوری‌های متعددی برای آن تنظیم کنید</li>
          </ul>
        </div>
      </div>
    </div>
  );
} 