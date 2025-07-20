"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
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
import DatePicker, { DateObject } from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import TimePicker from "react-multi-date-picker/plugins/time_picker";
import weekends from "react-multi-date-picker/plugins/highlight_weekends";

interface Medication {
  id: number;
  name: string;
  dosage: string;
}

interface ReminderTime {
  hour: string;
  minute: string;
}

export default function NewReminderPage() {
  const [medication, setMedication] = useState<Medication | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // تنظیم حالت‌های فرم
  const [startDate, setStartDate] = useState<DateObject | null>(new DateObject({ calendar: persian }));
  const [endDate, setEndDate] = useState<DateObject | null>(null);
  const [selectedDays, setSelectedDays] = useState<number[]>([0, 1, 2, 3, 4, 5, 6]); // همه روزهای هفته
  const [frequency, setFrequency] = useState("daily");
  const [status, setStatus] = useState("active");
  const [times, setTimes] = useState<ReminderTime[]>([{ hour: "08", minute: "00" }]);
  const [showTimePicker, setShowTimePicker] = useState<number | null>(null);
  
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  // دریافت اطلاعات دارو
  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      router.push("/auth/login");
      return;
    }

    fetchMedication();
  }, [id, router]);

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

  // مدیریت انتخاب روزهای هفته
  const handleDayToggle = (dayIndex: number) => {
    if (selectedDays.includes(dayIndex)) {
      // اگر روز قبلاً انتخاب شده است، آن را حذف کن
      setSelectedDays(selectedDays.filter(day => day !== dayIndex));
    } else {
      // در غیر این صورت آن را اضافه کن
      setSelectedDays([...selectedDays, dayIndex].sort());
    }
  };

  // اضافه کردن زمان جدید
  const addTime = () => {
    setTimes([...times, { hour: "08", minute: "00" }]);
  };

  // حذف زمان
  const removeTime = (index: number) => {
    if (times.length <= 1) {
      toast.error("حداقل یک زمان یادآوری باید وجود داشته باشد");
      return;
    }
    const newTimes = [...times];
    newTimes.splice(index, 1);
    setTimes(newTimes);
  };

  // تغییر زمان
  const handleTimeChange = (index: number, field: "hour" | "minute", value: string) => {
    const newTimes = [...times];
    newTimes[index][field] = value;
    setTimes(newTimes);
  };

  // ارسال فرم
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (times.length === 0) {
      toast.error("حداقل یک زمان یادآوری باید وارد کنید");
      return;
    }

    if (!startDate) {
      toast.error("لطفاً تاریخ شروع را مشخص کنید");
      return;
    }

    if (selectedDays.length === 0) {
      toast.error("حداقل یک روز از هفته باید انتخاب شود");
      return;
    }

    setIsSubmitting(true);

    try {
      const token = localStorage.getItem("access_token");
      if (!token) return;

      // تبدیل زمان‌ها به فرمت مورد نیاز API
      const formattedTimes = times.map((time) => `${time.hour}:${time.minute}`);
      
      // تبدیل تاریخ‌های شمسی به میلادی برای API
      const gregorianStartDate = new Date(startDate.toDate());
      const formattedStartDate = gregorianStartDate.toISOString().split('T')[0]; // YYYY-MM-DD
      
      let formattedEndDate = null;
      if (endDate) {
        const gregorianEndDate = new Date(endDate.toDate());
        formattedEndDate = gregorianEndDate.toISOString().split('T')[0]; // YYYY-MM-DD
      }

      const requestData = {
        frequency,
        status,
        start_date: formattedStartDate,
        end_date: formattedEndDate,
        times: formattedTimes,
        days_of_week: selectedDays
      };

      // اگر تاریخ پایان وجود ندارد، آن را حذف می‌کنیم
      if (!formattedEndDate) {
        const { end_date, ...dataWithoutEndDate } = requestData;
        await axios.post(
          `http://localhost:8000/api/reminder/medications/${id}/reminders/`,
          dataWithoutEndDate,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      } else {
        await axios.post(
          `http://localhost:8000/api/reminder/medications/${id}/reminders/`,
          requestData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      }

      toast.success("یادآور با موفقیت اضافه شد");
      router.push(`/reminder/medications/${id}`);
    } catch (error) {
      console.error("Error creating reminder:", error);
      toast.error("خطا در ایجاد یادآور");
    } finally {
      setIsSubmitting(false);
    }
  };

  // روزهای هفته به فارسی
  const daysOfWeek = ["شنبه", "یکشنبه", "دوشنبه", "سه‌شنبه", "چهارشنبه", "پنج‌شنبه", "جمعه"];

  // توضیحات مربوط به تناوب‌ها
  const frequencyDescriptions = {
    daily: "هر روز به شما یادآوری می‌شود",
    weekly: "هر هفته در روزهای انتخاب شده یادآوری می‌شود",
    monthly: "هر ماه در روزهای مشخص شده یادآوری می‌شود",
    custom: "الگوی سفارشی برای یادآوری استفاده می‌شود"
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

  if (!medication) {
    return (
      <div className="min-h-screen pharma-container flex justify-center items-center">
        <div className="text-center pharma-card p-8 rounded-lg animate-scaleUp">
          <div className="text-6xl mb-6 text-red-500">❌</div>
          <h2 className="pharma-title mb-4">دارو یافت نشد</h2>
          <Link
            href="/reminder"
            className="pharma-button-primary inline-flex items-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            <span>بازگشت به لیست داروها</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pharma-container py-8 px-4 sm:px-6 lg:px-8 relative">
      {/* Background Patterns - Subtle and Professional */}
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
        <div className="flex items-center mb-6">
          <Link href={`/reminder/medications/${id}`}>
            <button className="pharma-button py-2 px-4 ml-4 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
              </svg>
              <span>بازگشت</span>
            </button>
          </Link>
          <h1 className="pharma-title text-2xl">افزودن یادآور جدید</h1>
        </div>

        {/* Medication Info Card - Professional Pharmaceutical Design */}
        <div className="lab-card mb-8 animate-fadeIn">
          <div className="flex items-center">
            <div className="ml-4 flex-shrink-0 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300 rounded-full p-3 shadow-inner">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
              </svg>
            </div>
            <div className="flex-1">
              <div className="flex items-center">
                <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">{medication.name}</h2>
                <div className="ml-3 px-2 py-1 bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-200 text-xs rounded-md">
                  {medication.dosage}
                </div>
              </div>
              <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                  </svg>
                  <span>تنظیم یادآور برای مصرف دارو در زمان‌های مشخص</span>
                </div>
                <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M6.625 2.655A9 9 0 0119 11a1 1 0 11-2 0 7 7 0 00-9.625-6.492 1 1 0 11-.75-1.853zM4.662 4.959A1 1 0 014.75 6.37 6.97 6.97 0 003 11a1 1 0 11-2 0 8.97 8.97 0 012.25-5.953 1 1 0 011.412-.088z" clipRule="evenodd" />
                    <path d="M5 11a5 5 0 1110 0 1 1 0 11-2 0 3 3 0 10-6 0c0 1.677-.345 3.276-.968 4.729a1 1 0 11-1.838-.789A9.964 9.964 0 005 11z" />
                  </svg>
                  <span>اطلاع‌رسانی از طریق نوتیفیکیشن</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="pharma-card p-6 rounded-lg animate-scaleUp">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* بخش تنظیم تناوب و وضعیت */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-slideDown" style={{ animationDelay: "0.1s" }}>
              <div className="col-span-1 md:col-span-2 pharma-card p-6 rounded-lg">
                <h3 className="pharma-section text-lg font-semibold mb-3 text-gray-800 dark:text-gray-100 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                  </svg>
                  تنظیمات یادآوری
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="frequency" className="block text-sm font-medium mb-2 flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                      </svg>
                      تناوب مصرف دارو <span className="text-red-500">*</span>
                    </label>
                    <select
                      id="frequency"
                      value={frequency}
                      onChange={(e) => setFrequency(e.target.value)}
                      className="pharma-input w-full"
                    >
                      <option value="daily">روزانه</option>
                      <option value="weekly">هفتگی</option>
                      <option value="monthly">ماهانه</option>
                      <option value="custom">سفارشی</option>
                    </select>
                    <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                      {frequencyDescriptions[frequency as keyof typeof frequencyDescriptions]}
                    </p>
                  </div>

                  <div>
                    <label htmlFor="status" className="block text-sm font-medium mb-2 flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 2a8 8 0 100 16 8 8 0 000-16zm0 2a6 6 0 100 12 6 6 0 000-12zm-1 9a1 1 0 112 0v1a1 1 0 11-2 0v-1zm0-5a1 1 0 112 0v3a1 1 0 11-2 0V8z" clipRule="evenodd" />
                      </svg>
                      وضعیت یادآوری <span className="text-red-500">*</span>
                    </label>
                    <select
                      id="status"
                      value={status}
                      onChange={(e) => setStatus(e.target.value)}
                      className="pharma-input w-full"
                    >
                      <option value="active">فعال</option>
                      <option value="paused">متوقف شده</option>
                    </select>
                    <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                      {status === "active" ? "یادآورها به صورت فعال ارسال می‌شوند" : "یادآورها موقتاً متوقف شده‌اند"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* بخش انتخاب تاریخ شروع و پایان */}
            <div className="animate-slideDown" style={{ animationDelay: "0.2s" }}>
              <div className="pharma-card p-6 rounded-lg">
                <h3 className="pharma-section text-lg font-semibold mb-4 text-gray-800 dark:text-gray-100 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                  </svg>
                  بازه زمانی یادآوری
                </h3>
                <div className="mb-4 text-sm text-gray-600 dark:text-gray-300 bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2 flex-shrink-0 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  <span>
                    تاریخ شروع و پایان مصرف دارو را مشخص کنید. اگر تاریخ پایان مشخص نشود، دارو به صورت نامحدود یادآوری می‌شود.
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
                      <label className="block text-sm font-medium mb-2 flex items-center text-gray-700 dark:text-gray-300">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M5.5 2a1.5 1.5 0 00-1.5 1.5V4h12V3.5A1.5 1.5 0 0014.5 2h-9zM4 5.5A1.5 1.5 0 015.5 7H7v1h6V7h1.5A1.5 1.5 0 0016 5.5V5H4v.5zm5 4.5a.5.5 0 01.5-.5h1a.5.5 0 01.5.5v1a.5.5 0 01-.5.5h-1a.5.5 0 01-.5-.5v-1zm3 0a.5.5 0 01.5-.5h1a.5.5 0 01.5.5v1a.5.5 0 01-.5.5h-1a.5.5 0 01-.5-.5v-1zm-6 0a.5.5 0 01.5-.5h1a.5.5 0 01.5.5v1a.5.5 0 01-.5.5h-1a.5.5 0 01-.5-.5v-1zm0 3a.5.5 0 01.5-.5h1a.5.5 0 01.5.5v1a.5.5 0 01-.5.5h-1a.5.5 0 01-.5-.5v-1zm3 0a.5.5 0 01.5-.5h1a.5.5 0 01.5.5v1a.5.5 0 01-.5.5h-1a.5.5 0 01-.5-.5v-1zm3 0a.5.5 0 01.5-.5h1a.5.5 0 01.5.5v1a.5.5 0 01-.5.5h-1a.5.5 0 01-.5-.5v-1z" clipRule="evenodd" />
                        </svg>
                        تاریخ شروع <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <DatePicker
                          value={startDate}
                          onChange={setStartDate}
                          calendar={persian}
                          locale={persian_fa}
                          calendarPosition="bottom-right"
                          className="w-full pharma-input"
                          plugins={[weekends()]}
                          format="YYYY/MM/DD"
                        />
                        <div className="absolute left-2 top-1/2 transform -translate-y-1/2 text-blue-500">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                      </div>
                      <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                        اولین روزی که می‌خواهید مصرف دارو را شروع کنید
                      </p>
                    </div>
                  </div>
                  <div>
                    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
                      <label className="block text-sm font-medium mb-2 flex items-center text-gray-700 dark:text-gray-300">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M5.5 2a1.5 1.5 0 00-1.5 1.5V4h12V3.5A1.5 1.5 0 0014.5 2h-9zM4 5.5A1.5 1.5 0 015.5 7H7v1h6V7h1.5A1.5 1.5 0 0016 5.5V5H4v.5zm5 4.5a.5.5 0 01.5-.5h1a.5.5 0 01.5.5v1a.5.5 0 01-.5.5h-1a.5.5 0 01-.5-.5v-1zm3 0a.5.5 0 01.5-.5h1a.5.5 0 01.5.5v1a.5.5 0 01-.5.5h-1a.5.5 0 01-.5-.5v-1zm-6 0a.5.5 0 01.5-.5h1a.5.5 0 01.5.5v1a.5.5 0 01-.5.5h-1a.5.5 0 01-.5-.5v-1zm0 3a.5.5 0 01.5-.5h1a.5.5 0 01.5.5v1a.5.5 0 01-.5.5h-1a.5.5 0 01-.5-.5v-1zm3 0a.5.5 0 01.5-.5h1a.5.5 0 01.5.5v1a.5.5 0 01-.5.5h-1a.5.5 0 01-.5-.5v-1zm3 0a.5.5 0 01.5-.5h1a.5.5 0 01.5.5v1a.5.5 0 01-.5.5h-1a.5.5 0 01-.5-.5v-1z" clipRule="evenodd" />
                        </svg>
                        تاریخ پایان (اختیاری)
                      </label>
                      <div className="relative">
                        <DatePicker
                          value={endDate}
                          onChange={setEndDate}
                          calendar={persian}
                          locale={persian_fa}
                          calendarPosition="bottom-right"
                          className="w-full pharma-input"
                          plugins={[weekends()]}
                          format="YYYY/MM/DD"
                          minDate={startDate ? startDate.toDate() : undefined}
                        />
                        <div className="absolute left-2 top-1/2 transform -translate-y-1/2 text-blue-500">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                      </div>
                      <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                        آخرین روزی که می‌خواهید دارو را مصرف کنید (اختیاری)
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* بخش انتخاب روزهای هفته */}
            <div className="animate-slideDown" style={{ animationDelay: "0.3s" }}>
              <div className="pharma-card p-6 rounded-lg">
                <h3 className="pharma-section text-lg font-semibold mb-4 text-gray-800 dark:text-gray-100 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM4.332 8.027a6.012 6.012 0 011.912-2.706C6.512 5.73 6.974 6 7.5 6A1.5 1.5 0 019 7.5V8a2 2 0 004 0 2 2 0 011.523-1.943A5.977 5.977 0 0116 10c0 .34-.028.675-.083 1H15a2 2 0 00-2 2v2.197A5.973 5.973 0 0110 16v-2a2 2 0 00-2-2 2 2 0 01-2-2 2 2 0 00-1.668-1.973z" clipRule="evenodd" />
                  </svg>
                  روزهای مصرف دارو
                </h3>
                <div className="mb-3 text-sm text-gray-600 dark:text-gray-300 bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
                  روزهایی که می‌خواهید دارو را مصرف کنید، انتخاب کنید. روزهای آبی رنگ برای مصرف دارو انتخاب شده‌اند.
                </div>
                <div className="grid grid-cols-7 gap-2 mt-4">
                  {daysOfWeek.map((day, index) => (
                    <div key={index} className="flex flex-col items-center">
                      <button
                        type="button"
                        onClick={() => handleDayToggle(index)}
                        className={`w-full py-3 px-1 rounded-lg text-sm transition-all flex flex-col items-center justify-center ${
                          selectedDays.includes(index)
                            ? "bg-gradient-to-b from-blue-500 to-blue-600 text-white shadow-md transform hover:scale-105"
                            : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700"
                        }`}
                      >
                        <span className="text-lg mb-1">{day.substring(0, 1)}</span>
                        <span className="text-xs">{day}</span>
                        {selectedDays.includes(index) && (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mt-1 text-white" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        )}
                      </button>
                    </div>
                  ))}
                </div>
                <div className="flex items-center justify-between mt-4">
                  <button 
                    type="button" 
                    onClick={() => setSelectedDays([0, 1, 2, 3, 4, 5, 6])}
                    className="pharma-button text-sm py-1.5 px-3 flex items-center"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    انتخاب همه روزها
                  </button>
                  <button 
                    type="button" 
                    onClick={() => setSelectedDays([])}
                    className="pharma-button text-sm py-1.5 px-3 flex items-center"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1 text-red-600" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                    پاک کردن همه
                  </button>
                </div>
              </div>
            </div>

            {/* بخش انتخاب زمان */}
            <div className="animate-slideDown" style={{ animationDelay: "0.4s" }}>
              <div className="pharma-card p-6 rounded-lg">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="pharma-section text-lg font-semibold text-gray-800 dark:text-gray-100 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                    </svg>
                    زمان‌های یادآوری <span className="text-red-500">*</span>
                  </h3>
                  <button
                    type="button"
                    onClick={addTime}
                    className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-full transition-colors"
                    title="افزودن زمان جدید"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
                
                <div className="mb-3 text-sm text-gray-600 dark:text-gray-300 bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2 flex-shrink-0 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  <span>
                    زمان‌های یادآوری را مشخص کنید. می‌توانید چندین زمان برای یادآوری در طول روز اضافه کنید. برای انتخاب دقیق‌تر زمان، روی ساعت کلیک کنید.
                  </span>
                </div>
                
                <div className="space-y-4 mt-4">
                  {times.map((time, index) => (
                    <div key={index} className="time-card">
                      <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-700 pb-3 mb-3">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center text-blue-600 dark:text-blue-300 mr-3">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-800 dark:text-gray-200">دوز {index + 1}</h4>
                            <p className="text-xs text-gray-500 dark:text-gray-400">زمان مصرف دارو</p>
                          </div>
                        </div>
                        
                        <button
                          type="button"
                          onClick={() => removeTime(index)}
                          className="bg-red-100 hover:bg-red-200 text-red-600 p-1.5 rounded-md transition-colors"
                          title="حذف این زمان"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                        </button>
                      </div>
                      
                      <div>
                        <div 
                          className="flex items-center justify-center bg-white dark:bg-gray-800 rounded-lg p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors border border-gray-200 dark:border-gray-700"
                          onClick={() => setShowTimePicker(showTimePicker === index ? null : index)}
                        >
                          <div className="relative">
                            <div className="text-center text-3xl font-bold text-gray-800 dark:text-gray-200 font-mono tracking-wider">
                              <span className="ltr">{time.hour}</span>
                              <span className="mx-1 text-blue-500 dark:text-blue-400 animate-pulse">:</span>
                              <span className="ltr">{time.minute}</span>
                            </div>
                            <div className="absolute -right-8 top-1/2 -translate-y-1/2 text-blue-500 dark:text-blue-400">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l4.293-4.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                              </svg>
                            </div>
                          </div>
                        </div>
                        
                        {showTimePicker === index && (
                          <div className="mt-3 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 animate-scaleUp overflow-hidden">
                            <div className="p-2 bg-blue-50 dark:bg-blue-900/30 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">انتخاب زمان دقیق</span>
                              <button
                                type="button"
                                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                                onClick={() => setShowTimePicker(null)}
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
                              </button>
                            </div>
                            
                            <div className="p-4">
                              <div className="flex justify-between mb-3">
                                <div className="w-1/2 pl-2">
                                  <label className="block text-sm font-medium mb-2 text-center text-gray-700 dark:text-gray-300">ساعت</label>
                                  <div className="grid grid-cols-4 gap-1 max-h-48 overflow-y-auto scrollbar-thin">
                                    {Array.from({ length: 24 }, (_, i) => i).map((hour) => (
                                      <button
                                        key={hour}
                                        type="button"
                                        className={`p-2 rounded text-center ${
                                          time.hour === hour.toString().padStart(2, '0')
                                            ? 'bg-blue-500 text-white'
                                            : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'
                                        }`}
                                        onClick={() => handleTimeChange(index, "hour", hour.toString().padStart(2, '0'))}
                                      >
                                        {hour.toString().padStart(2, '0')}
                                      </button>
                                    ))}
                                  </div>
                                </div>
                                <div className="w-1/2 pr-2">
                                  <label className="block text-sm font-medium mb-2 text-center text-gray-700 dark:text-gray-300">دقیقه</label>
                                  <div className="grid grid-cols-4 gap-1 max-h-48 overflow-y-auto scrollbar-thin">
                                    {[0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55].map((minute) => (
                                      <button
                                        key={minute}
                                        type="button"
                                        className={`p-2 rounded text-center ${
                                          time.minute === minute.toString().padStart(2, '0')
                                            ? 'bg-blue-500 text-white'
                                            : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'
                                        }`}
                                        onClick={() => handleTimeChange(index, "minute", minute.toString().padStart(2, '0'))}
                                      >
                                        {minute.toString().padStart(2, '0')}
                                      </button>
                                    ))}
                                  </div>
                                </div>
                              </div>
                              <div className="flex justify-end mt-2">
                                <button
                                  type="button"
                                  className="pharma-button-primary text-sm py-1.5"
                                  onClick={() => setShowTimePicker(null)}
                                >
                                  تایید
                                </button>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                      
                      <div className="mt-3 flex items-center text-sm text-gray-500 dark:text-gray-400">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                        </svg>
                        <span>هر روز در ساعت {time.hour}:{time.minute} یادآوری ارسال می‌شود</span>
                      </div>
                    </div>
                  ))}
                </div>
                
                {times.length === 0 && (
                  <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto mb-3 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p>هنوز زمانی برای یادآوری اضافه نشده است.</p>
                    <button
                      type="button"
                      onClick={addTime}
                      className="mt-2 text-blue-500 hover:underline"
                    >
                      افزودن زمان جدید
                    </button>
                  </div>
                )}
                
                {times.length > 0 && times.length < 3 && (
                  <button
                    type="button"
                    onClick={addTime}
                    className="mt-4 w-full py-2 border border-dashed border-blue-300 dark:border-blue-700 bg-blue-50/50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-lg text-blue-600 dark:text-blue-400 flex items-center justify-center transition-colors"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                    </svg>
                    افزودن زمان یادآوری دیگر
                  </button>
                )}
              </div>
            </div>

            {/* دکمه‌های فرم */}
            <div className="animate-slideDown" style={{ animationDelay: "0.5s" }}>
              <div className="pharma-card p-6 rounded-lg">
                <div className="bg-blue-50 dark:bg-blue-900/20 p-5 rounded-lg mb-6">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-300 rounded-full p-2 mt-0.5 ml-3">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <h4 className="text-md font-semibold text-gray-800 dark:text-gray-100 mb-2">خلاصه تنظیمات یادآوری</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-y-2 gap-x-4">
                        <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          <span>دارو: <strong className="text-gray-800 dark:text-gray-200">{medication.name}</strong></span>
                        </div>
                        <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          <span>تناوب: <strong className="text-gray-800 dark:text-gray-200">{frequency === "daily" ? "روزانه" : frequency === "weekly" ? "هفتگی" : frequency === "monthly" ? "ماهانه" : "سفارشی"}</strong></span>
                        </div>
                        <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          <span>
                            روزهای هفته: <strong className="text-gray-800 dark:text-gray-200">{selectedDays.length}</strong> روز
                          </span>
                        </div>
                        <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          <span>
                            زمان‌های یادآوری: <strong className="text-gray-800 dark:text-gray-200">{times.length}</strong> بار در روز
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row justify-end gap-3">
                    <Link href={`/reminder/medications/${id}`}>
                      <button 
                        type="button" 
                        className="w-full sm:w-auto pharma-button py-3 px-6 flex items-center justify-center gap-2"
                        disabled={isSubmitting}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                        <span>انصراف</span>
                      </button>
                    </Link>
                    <button
                      type="submit"
                      disabled={isSubmitting || times.length === 0 || selectedDays.length === 0}
                      className={`w-full sm:w-auto pharma-button-primary py-3 px-8 flex items-center justify-center gap-2 ${
                        isSubmitting || times.length === 0 || selectedDays.length === 0 
                          ? "opacity-70 cursor-not-allowed" 
                          : ""
                      }`}
                    >
                      {isSubmitting ? (
                        <>
                          <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          <span>در حال ثبت...</span>
                        </>
                      ) : (
                        <>
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          <span>ثبت یادآوری</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
        
        <div className="mt-8 pharma-card p-6 rounded-lg animate-fadeIn" style={{ animationDelay: "0.6s" }}>
          <h3 className="pharma-section text-lg font-semibold mb-4 text-gray-800 dark:text-gray-100 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            راهنمای تنظیم یادآور
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border-l-4 border-blue-500">
              <h4 className="font-medium text-gray-800 dark:text-gray-100 mb-2 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5z" />
                </svg>
                تناوب مصرف
              </h4>
              <ul className="list-disc list-inside text-sm text-gray-600 dark:text-gray-400 space-y-1 mr-5">
                <li>روزانه: هر روز در زمان مشخص شده یادآوری می‌شود</li>
                <li>هفتگی: فقط در روزهای انتخاب شده از هفته یادآوری می‌شود</li>
                <li>ماهانه: در روزهای مشخصی از ماه یادآوری می‌شود</li>
                <li>سفارشی: با الگوی پیچیده‌تری یادآوری می‌شود</li>
              </ul>
            </div>
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border-l-4 border-blue-500">
              <h4 className="font-medium text-gray-800 dark:text-gray-100 mb-2 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                </svg>
                زمان‌های یادآوری
              </h4>
              <ul className="list-disc list-inside text-sm text-gray-600 dark:text-gray-400 space-y-1 mr-5">
                <li>برای هر دارو می‌توانید چندین زمان یادآوری تنظیم کنید</li>
                <li>برای انتخاب دقیق ساعت و دقیقه، روی زمان کلیک کنید</li>
                <li>سیستم در زمان‌های مشخص شده به شما یادآوری می‌کند</li>
              </ul>
            </div>
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border-l-4 border-blue-500">
              <h4 className="font-medium text-gray-800 dark:text-gray-100 mb-2 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                </svg>
                بازه زمانی
              </h4>
              <ul className="list-disc list-inside text-sm text-gray-600 dark:text-gray-400 space-y-1 mr-5">
                <li>تاریخ شروع: از این تاریخ یادآوری‌ها شروع می‌شوند</li>
                <li>تاریخ پایان: اگر مشخص شود، پس از این تاریخ یادآوری‌ها متوقف می‌شوند</li>
                <li>اگر تاریخ پایان مشخص نشود، یادآوری‌ها به صورت نامحدود ادامه می‌یابند</li>
              </ul>
            </div>
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border-l-4 border-blue-500">
              <h4 className="font-medium text-gray-800 dark:text-gray-100 mb-2 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 2a8 8 0 100 16 8 8 0 000-16zm0 2a6 6 0 100 12 6 6 0 000-12zm-1 9a1 1 0 112 0v1a1 1 0 11-2 0v-1zm0-5a1 1 0 112 0v3a1 1 0 11-2 0V8z" clipRule="evenodd" />
                </svg>
                نکات مهم
              </h4>
              <ul className="list-disc list-inside text-sm text-gray-600 dark:text-gray-400 space-y-1 mr-5">
                <li>برای هر دارو می‌توانید چندین یادآور با تنظیمات متفاوت ایجاد کنید</li>
                <li>یادآورها را می‌توانید بعداً ویرایش یا غیرفعال کنید</li>
                <li>برای دریافت یادآوری، لازم است نوتیفیکیشن‌های برنامه را فعال کنید</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 