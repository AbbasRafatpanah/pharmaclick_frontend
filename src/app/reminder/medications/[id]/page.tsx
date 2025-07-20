"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "sonner";
import Link from "next/link";

interface Medication {
  id: number;
  name: string;
  description: string;
  dosage: string;
  created_at: string;
  updated_at: string;
  reminders: Reminder[];
}

interface Reminder {
  id: number;
  frequency: "daily" | "weekly" | "monthly" | "custom";
  status: "active" | "completed" | "paused";
  start_date: string;
  end_date: string | null;
  created_at: string;
  updated_at: string;
  days_of_week: number[];
  times: {
    id: number;
    time: string;
  }[];
  logs: any[];
}

export default function MedicationDetailPage() {
  const [medication, setMedication] = useState<Medication | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddReminderModal, setShowAddReminderModal] = useState(false);
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      router.push("/auth/login");
      return;
    }
    
    fetchMedication();
  }, [id]);

  const fetchMedication = async () => {
    try {
      const token = localStorage.getItem("access_token");
      if (!token) return;

      const response = await axios.get(`http://localhost:8000/api/reminder/medications/${id}/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setMedication(response.data);
    } catch (error) {
      console.error("Error fetching medication:", error);
      toast.error("خطا در دریافت اطلاعات دارو");
    } finally {
      setIsLoading(false);
    }
  };

  const deleteMedication = async () => {
    if (!confirm("آیا از حذف این دارو اطمینان دارید؟ این عمل غیرقابل بازگشت است.")) {
      return;
    }

    try {
      const token = localStorage.getItem("access_token");
      if (!token) return;

      await axios.delete(`http://localhost:8000/api/reminder/medications/${id}/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      toast.success("دارو با موفقیت حذف شد");
      router.push("/reminder");
    } catch (error) {
      console.error("Error deleting medication:", error);
      toast.error("خطا در حذف دارو");
    }
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

  // فرمت زمان به صورت فارسی
  const formatTime = (timeString: string) => {
    const [hours, minutes] = timeString.split(":");
    return `${hours}:${minutes}`;
  };

  // نمایش نام تناوب به صورت فارسی
  const getFrequencyName = (frequency: string) => {
    switch (frequency) {
      case "daily":
        return "روزانه";
      case "weekly":
        return "هفتگی";
      case "monthly":
        return "ماهانه";
      case "custom":
        return "سفارشی";
      default:
        return frequency;
    }
  };

  // نمایش نام وضعیت به صورت فارسی
  const getStatusName = (status: string) => {
    switch (status) {
      case "active":
        return "فعال";
      case "completed":
        return "تکمیل شده";
      case "paused":
        return "متوقف شده";
      default:
        return status;
    }
  };

  // نمایش رنگ وضعیت
  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100";
      case "completed":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100";
      case "paused":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-100";
    }
  };

  // نمایش روزهای هفته به صورت فارسی
  const getDaysOfWeek = (days: number[]) => {
    if (!days || days.length === 0) return "هیچ روزی انتخاب نشده";
    
    const daysNames = ["شنبه", "یکشنبه", "دوشنبه", "سه‌شنبه", "چهارشنبه", "پنج‌شنبه", "جمعه"];
    
    // اگر همه روزهای هفته انتخاب شده باشند
    if (days.length === 7) return "هر روز هفته";
    
    return days.map(day => daysNames[day]).join("، ");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex justify-center items-center">
        <div className="text-center text-gray-500 dark:text-gray-400">
          در حال بارگذاری...
        </div>
      </div>
    );
  }

  if (!medication) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex justify-center items-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">دارو یافت نشد</h2>
          <Link
            href="/reminder"
            className="text-blue-600 hover:underline"
          >
            بازگشت به لیست داروها
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="container mx-auto px-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 mb-8">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-3xl font-bold mb-2">{medication.name}</h1>
              <p className="text-gray-600 dark:text-gray-300">
                <span className="font-medium">دوز مصرفی: </span>
                {medication.dosage}
              </p>
            </div>
            <div className="flex space-x-2 space-x-reverse">
              <Link
                href={`/reminder/medications/${id}/edit`}
                className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm"
              >
                ویرایش
              </Link>
              <button
                onClick={deleteMedication}
                className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded-md text-sm"
              >
                حذف
              </button>
              <Link
                href="/reminder"
                className="px-3 py-1 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-md text-sm"
              >
                بازگشت
              </Link>
            </div>
          </div>

          {medication.description && (
            <div className="mb-6">
              <h2 className="text-lg font-medium mb-2">توضیحات</h2>
              <p className="text-gray-600 dark:text-gray-300 whitespace-pre-line">
                {medication.description}
              </p>
            </div>
          )}

          <div className="border-t dark:border-gray-700 pt-4 text-sm text-gray-500 dark:text-gray-400">
            <div>
              تاریخ ثبت: {formatDate(medication.created_at)}
            </div>
            <div>
              آخرین بروزرسانی: {formatDate(medication.updated_at)}
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">یادآورها</h2>
            <Link
              href={`/reminder/medications/${id}/new-reminder`}
              className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-md text-sm"
            >
              افزودن یادآور جدید
            </Link>
          </div>

          {medication.reminders.length > 0 ? (
            <div className="space-y-4">
              {medication.reminders.map((reminder) => (
                <div key={reminder.id} className="border dark:border-gray-700 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <div className="flex items-center">
                        <span className="font-medium ml-2">تناوب:</span>
                        <span>{getFrequencyName(reminder.frequency)}</span>
                      </div>
                      <div className="flex items-center mt-1">
                        <span className="font-medium ml-2">وضعیت:</span>
                        <span className={`px-2 py-0.5 rounded-full text-xs ${getStatusColor(reminder.status)}`}>
                          {getStatusName(reminder.status)}
                        </span>
                      </div>
                    </div>
                    <div className="flex space-x-2 space-x-reverse">
                      <Link
                        href={`/reminder/medications/${id}/reminders/${reminder.id}/logs`}
                        className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-xs"
                      >
                        سوابق
                      </Link>
                      <Link
                        href={`/reminder/medications/${id}/reminders/${reminder.id}/edit`}
                        className="px-3 py-1 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-md text-xs"
                      >
                        ویرایش
                      </Link>
                      <button
                        onClick={() => {
                          if (confirm("آیا از حذف این یادآور اطمینان دارید؟ این عمل غیرقابل بازگشت است.")) {
                            const token = localStorage.getItem("access_token");
                            if (!token) return;
                            
                            axios.delete(
                              `http://localhost:8000/api/reminder/medications/${id}/reminders/${reminder.id}/`,
                              {
                                headers: {
                                  Authorization: `Bearer ${token}`,
                                },
                              }
                            )
                            .then(() => {
                              toast.success("یادآور با موفقیت حذف شد");
                              fetchMedication();
                            })
                            .catch((error) => {
                              console.error("Error deleting reminder:", error);
                              toast.error("خطا در حذف یادآور");
                            });
                          }
                        }}
                        className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded-md text-xs"
                      >
                        حذف
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                    <div>
                      <span className="font-medium block mb-1">تاریخ شروع:</span>
                      <span>{formatDate(reminder.start_date)}</span>
                    </div>
                    <div>
                      <span className="font-medium block mb-1">تاریخ پایان:</span>
                      <span>{reminder.end_date ? formatDate(reminder.end_date) : "نامحدود"}</span>
                    </div>
                  </div>

                  <div className="mb-4">
                    <h3 className="font-medium mb-2">روزهای یادآوری:</h3>
                    <div className="bg-gray-50 dark:bg-gray-700 p-2 rounded-md">
                      {getDaysOfWeek(reminder.days_of_week)}
                    </div>
                  </div>

                  <div className="mb-4">
                    <h3 className="font-medium mb-2">زمان‌های یادآوری:</h3>
                    <div className="flex flex-wrap gap-2">
                      {reminder.times.map((time) => (
                        <div 
                          key={time.id} 
                          className="bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-md text-sm"
                        >
                          {formatTime(time.time)}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500 dark:text-gray-400 mb-4">
                هنوز یادآوری برای این دارو تنظیم نشده است
              </p>
              <Link
                href={`/reminder/medications/${id}/new-reminder`}
                className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-md"
              >
                افزودن اولین یادآور
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 