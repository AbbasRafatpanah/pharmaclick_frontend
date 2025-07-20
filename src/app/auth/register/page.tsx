"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import axios from "axios";
import { toast } from "sonner";
import { 
  GradientBlob, 
  GridPattern, 
  FloatingParticles,
  CirclePattern,
  Pills,
  MedicineBottle
} from "@/components/BackgroundElements";
import { API_ENDPOINTS } from "@/lib/api-config";

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    phone_number: "",
    password: "",
    password2: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (formData.password !== formData.password2) {
      toast.error("رمز عبور و تکرار آن مطابقت ندارند");
      setIsLoading(false);
      return;
    }

    try {
      const response = await axios.post(API_ENDPOINTS.AUTH.REGISTER, {
        phone_number: formData.phone_number,
        password: formData.password,
        password2: formData.password2,
      });

      toast.success("ثبت نام با موفقیت انجام شد");
      router.push("/auth/login");
    } catch (error: any) {
      console.error("Registration error:", error);
      
      if (error.response?.data) {
        const errors = error.response.data;
        console.log("Backend errors:", errors); // For debugging

        Object.keys(errors).forEach(key => {
            const fieldErrors = errors[key];
            if (Array.isArray(fieldErrors) && fieldErrors.length > 0) {
                let fieldName = key;
                if (key === 'phone_number') fieldName = 'شماره تلفن';
                else if (key === 'password') fieldName = 'رمز عبور';
                else if (key === 'password2') fieldName = 'تکرار رمز عبور';
                else if (key === 'non_field_errors') fieldName = 'خطا';
                
                toast.error(`${fieldName}: ${fieldErrors[0]}`);
            }
        });

      } else {
        toast.error("خطایی در ارتباط با سرور رخ داد");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Elements */}
      <GridPattern />
      <FloatingParticles count={20} />
      <GradientBlob className="top-20 left-20 w-96 h-96 opacity-10" color="blue" />
      <GradientBlob className="bottom-20 right-20 w-96 h-96 opacity-10" color="purple" />
      <CirclePattern className="opacity-30" />
      
      <MedicineBottle className="top-32 left-[20%] text-blue-500/20 animate-float" size={100} />
      <Pills className="bottom-32 right-[20%] text-blue-500/20 animate-float" size={100} />

      <div className="card-premium max-w-md w-full space-y-8 p-8 rounded-2xl relative z-10 animate-scaleUp">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-blue-800 dark:text-blue-300 text-glow">ایجاد حساب کاربری</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            اطلاعات خود را وارد کنید
          </p>
        </div>

        <form className="mt-8 space-y-6 relative" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm space-y-4">
            <div className="animate-slideDown" style={{ animationDelay: "0.1s" }}>
              <label htmlFor="phone_number" className="block text-sm font-medium mb-1">
                شماره تلفن
              </label>
              <input
                id="phone_number"
                name="phone_number"
                type="text"
                required
                value={formData.phone_number}
                onChange={handleChange}
                className="appearance-none relative block w-full px-3 py-3 border border-gray-300 dark:border-gray-600 rounded-md placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white dark:bg-gray-700/70 bg-white/70 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                placeholder="مثال: 09123456789"
              />
            </div>
            
            <div className="animate-slideDown" style={{ animationDelay: "0.2s" }}>
              <label htmlFor="password" className="block text-sm font-medium mb-1">
                رمز عبور
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={formData.password}
                onChange={handleChange}
                className="appearance-none relative block w-full px-3 py-3 border border-gray-300 dark:border-gray-600 rounded-md placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white dark:bg-gray-700/70 bg-white/70 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                placeholder="حداقل 8 کاراکتر"
              />
            </div>
            
            <div className="animate-slideDown" style={{ animationDelay: "0.3s" }}>
              <label htmlFor="password2" className="block text-sm font-medium mb-1">
                تکرار رمز عبور
              </label>
              <input
                id="password2"
                name="password2"
                type="password"
                required
                value={formData.password2}
                onChange={handleChange}
                className="appearance-none relative block w-full px-3 py-3 border border-gray-300 dark:border-gray-600 rounded-md placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white dark:bg-gray-700/70 bg-white/70 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                placeholder="رمز عبور را دوباره وارد کنید"
              />
            </div>
          </div>

          <div className="animate-slideDown" style={{ animationDelay: "0.4s" }}>
            <button
              type="submit"
              disabled={isLoading}
              className={`group relative w-full flex justify-center py-3 px-4 gradient-button ${
                isLoading ? "opacity-70 cursor-not-allowed" : ""
              }`}
            >
              {isLoading ? (
                <div className="flex items-center">
                  <svg className="animate-spin h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>در حال ثبت نام...</span>
                </div>
              ) : (
                <span>ثبت نام</span>
              )}
            </button>
          </div>

          <div className="text-center text-sm animate-slideDown" style={{ animationDelay: "0.5s" }}>
            <p>
              قبلاً ثبت نام کرده‌اید؟{" "}
              <Link
                href="/auth/login"
                className="font-medium text-blue-600 hover:text-blue-500 transition-colors"
              >
                وارد شوید
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
} 