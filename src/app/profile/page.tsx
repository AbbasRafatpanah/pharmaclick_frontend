"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "sonner";
import { 
  PrescriptionPad, 
  MolecularStructure, 
  Syringe, 
  HeartPulse, 
  MedicineBottle, 
  Pills 
} from "@/components/BackgroundElements";
import { API_ENDPOINTS, authHeaders } from "@/lib/api-config";

// تعریف رابط کاربر
interface User {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  date_joined: string;
  phone_number?: string; // Added phone_number to the interface
}

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState<'profile' | 'security'>('profile');
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      router.push("/auth/login");
      return;
    }
    
    fetchUserData();
  }, [router]);

  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem("access_token");
      if (!token) return;

      const response = await axios.get(API_ENDPOINTS.AUTH.ME, {
        headers: authHeaders()
      });
      
      const userData = response.data;
      setUser(userData);
      setFirstName(userData.first_name || "");
      setLastName(userData.last_name || "");
      
    } catch (error) {
      console.error("Error fetching user data:", error);
      toast.error("خطا در دریافت اطلاعات کاربری");
    } finally {
      setIsLoading(false);
    }
  };

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const token = localStorage.getItem("access_token");
      if (!token) return;
      
      await axios.patch(
        API_ENDPOINTS.AUTH.ME,
        {
          first_name: firstName,
          last_name: lastName,
        },
        {
          headers: authHeaders()
        }
      );
      
      toast.success("پروفایل با موفقیت بروزرسانی شد");
      fetchUserData(); // بارگذاری مجدد اطلاعات کاربر
      
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("خطا در بروزرسانی پروفایل");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      toast.error("رمز عبور جدید و تکرار آن مطابقت ندارند");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const token = localStorage.getItem("access_token");
      if (!token) return;
      
      await axios.post(
        API_ENDPOINTS.AUTH.CHANGE_PASSWORD,
        {
          old_password: currentPassword,
          new_password: newPassword,
        },
        {
          headers: authHeaders()
        }
      );
      
      toast.success("رمز عبور با موفقیت تغییر کرد");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      
    } catch (error) {
      console.error("Error changing password:", error);
      toast.error("خطا در تغییر رمز عبور");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    router.push("/auth/login");
    toast.success("با موفقیت خارج شدید");
  };

  // فرمت تاریخ به صورت فارسی
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      
      // بررسی اعتبار تاریخ
      if (isNaN(date.getTime())) {
        return "تاریخ نامعتبر";
      }
      
      // تبدیل به تاریخ شمسی با استفاده از API مرورگر
      return new Intl.DateTimeFormat("fa-IR", {
        year: "numeric",
        month: "long",
        day: "numeric",
        calendar: "persian"
      }).format(date);
    } catch (error) {
      console.error("Error formatting date:", error);
      return "خطا در نمایش تاریخ";
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen pharma-container flex justify-center items-center">
        <div className="text-center text-gray-600 dark:text-gray-300">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          در حال بارگذاری...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pharma-container py-8 px-4 sm:px-6 lg:px-8 relative">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-blue-50/30 dark:bg-blue-900/10 opacity-60 pointer-events-none"></div>
      <div className="absolute inset-0 bg-grid-pattern opacity-5 pointer-events-none" 
        style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"%3E%3Cpath d="M1 0h2v20H1V0zm0 0v2h20V0H1z" fill="%230366D6" fill-opacity=".05"/%3E%3C/svg%3E")' }}>
      </div>

      {/* Pharmaceutical Background Elements */}
      <PrescriptionPad className="top-20 left-10 text-blue-500/10 hidden lg:block" size={160} />
      <MolecularStructure className="bottom-20 right-10 text-blue-500/10 hidden lg:block" size={180} />
      <Syringe className="top-1/3 right-[15%] text-blue-600/10 hidden lg:block" size={100} />
      <HeartPulse className="bottom-1/3 left-[15%] text-blue-600/10 hidden lg:block" size={90} />
      <MedicineBottle className="top-2/3 left-[5%] text-blue-500/10 hidden lg:block" size={80} />
      <Pills className="top-20 right-[20%] text-blue-500/10 hidden lg:block" size={70} />

      <div className="max-w-4xl mx-auto relative z-10">
        <h1 className="pharma-title text-3xl mb-8">پروفایل کاربری</h1>
        
        {/* اطلاعات کاربر */}
        <div className="pharma-card p-6 rounded-lg mb-8 animate-scaleUp">
          <div className="flex items-center mb-6">
            <div className="ml-4 flex-shrink-0 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300 rounded-full p-3 shadow-inner">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <div>
              <h2 className="text-xl font-bold">{user?.username}</h2>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                عضویت از: {user?.date_joined ? formatDate(user.date_joined) : "نامشخص"}
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
              <div className="text-sm text-gray-500 dark:text-gray-400">نام کاربری</div>
              <div className="font-medium">{user?.username}</div>
            </div>
            <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
              <div className="text-sm text-gray-500 dark:text-gray-400">شماره تلفن</div>
              <div className="font-medium">{user?.phone_number}</div>
            </div>
            <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
              <div className="text-sm text-gray-500 dark:text-gray-400">نام</div>
              <div className="font-medium">{user?.first_name || "تنظیم نشده"}</div>
            </div>
            <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
              <div className="text-sm text-gray-500 dark:text-gray-400">نام خانوادگی</div>
              <div className="font-medium">{user?.last_name || "تنظیم نشده"}</div>
            </div>
          </div>
        </div>
        
        {/* ویرایش پروفایل */}
        <div className="pharma-card p-6 rounded-lg mb-8 animate-scaleUp">
          <h2 className="text-xl font-bold mb-4">ویرایش اطلاعات شخصی</h2>
          <form onSubmit={handleProfileUpdate} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium mb-2">
                  نام
                </label>
                <input
                  type="text"
                  id="firstName"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="pharma-input w-full"
                />
              </div>
              <div>
                <label htmlFor="lastName" className="block text-sm font-medium mb-2">
                  نام خانوادگی
                </label>
                <input
                  type="text"
                  id="lastName"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="pharma-input w-full"
                />
              </div>
            </div>
            {/* <div>
              <label htmlFor="email" className="block text-sm font-medium mb-2">
                ایمیل
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pharma-input w-full"
              />
            </div> */}
            <div className="flex justify-end">
              <button
                type="submit"
                className="pharma-button-primary"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin ml-2"></span>
                    در حال ذخیره...
                  </>
                ) : (
                  "ذخیره تغییرات"
                )}
              </button>
            </div>
          </form>
        </div>
        
        {/* تغییر رمز عبور */}
        <div className="pharma-card p-6 rounded-lg mb-8 animate-scaleUp">
          <h2 className="text-xl font-bold mb-4">تغییر رمز عبور</h2>
          <form onSubmit={handlePasswordChange} className="space-y-4">
            <div>
              <label htmlFor="currentPassword" className="block text-sm font-medium mb-2">
                رمز عبور فعلی
              </label>
              <input
                type="password"
                id="currentPassword"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="pharma-input w-full"
                required
              />
            </div>
            <div>
              <label htmlFor="newPassword" className="block text-sm font-medium mb-2">
                رمز عبور جدید
              </label>
              <input
                type="password"
                id="newPassword"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="pharma-input w-full"
                required
              />
            </div>
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium mb-2">
                تکرار رمز عبور جدید
              </label>
              <input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="pharma-input w-full"
                required
              />
            </div>
            <div className="flex justify-end">
              <button
                type="submit"
                className="pharma-button-primary"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin ml-2"></span>
                    در حال ذخیره...
                  </>
                ) : (
                  "تغییر رمز عبور"
                )}
              </button>
            </div>
          </form>
        </div>
        
        {/* خروج از حساب کاربری */}
        <div className="pharma-card p-6 rounded-lg animate-scaleUp">
          <h2 className="text-xl font-bold mb-4">خروج از حساب کاربری</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            با کلیک بر روی دکمه زیر، از حساب کاربری خود خارج خواهید شد.
          </p>
          <button
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-md"
          >
            خروج از حساب کاربری
          </button>
        </div>
      </div>
    </div>
  );
} 