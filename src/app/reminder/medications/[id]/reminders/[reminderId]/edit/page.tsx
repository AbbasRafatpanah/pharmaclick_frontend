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

interface Medication {
  id: number;
  name: string;
  dosage: string;
}

interface Reminder {
  id: number;
  frequency: "daily" | "weekly" | "monthly" | "custom";
  status: "active" | "completed" | "paused";
  start_date: string;
  end_date: string | null;
  days_of_week: number[];
  times: {
    id: number;
    time: string;
  }[];
}

interface ReminderTime {
  hour: string;
  minute: string;
} 

interface ReminderTimeResponse {
  id: number;
  time: string;
}

export default function EditReminderPage() {
  const [medication, setMedication] = useState<Medication | null>(null);
  const [reminder, setReminder] = useState<Reminder | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  
  // تنظیم حالت‌های فرم
  const [startDate, setStartDate] = useState<DateObject | null>(null);
  const [endDate, setEndDate] = useState<DateObject | null>(null);
  const [selectedDays, setSelectedDays] = useState<number[]>([]);
  const [frequency, setFrequency] = useState("daily");
  const [status, setStatus] = useState("active");
  const [times, setTimes] = useState<ReminderTime[]>([]);
  const [showTimePicker, setShowTimePicker] = useState<number | null>(null);
  
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const reminderId = params.reminderId as string;

  // دریافت اطلاعات دارو و یادآور
  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      router.push("/auth/login");
      return;
    }

    fetchData();
  }, [id, reminderId, router]);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem("access_token");
      if (!token) return;

      // دریافت اطلاعات دارو
      const medicationResponse = await axios.get(`http://localhost:8000/api/reminder/medications/${id}/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setMedication(medicationResponse.data);
      
      // دریافت اطلاعات یادآور
      const reminderResponse = await axios.get(`http://localhost:8000/api/reminder/medications/${id}/reminders/${reminderId}/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      const reminderData = reminderResponse.data;
      setReminder(reminderData);
      
      // تنظیم مقادیر فرم
      setFrequency(reminderData.frequency);
      setStatus(reminderData.status);
      
      // تبدیل تاریخ‌های میلادی به شمسی
      setStartDate(new DateObject({ 
        date: new Date(reminderData.start_date),
        calendar: persian,
        locale: persian_fa 
      }));
      
      if (reminderData.end_date) {
        setEndDate(new DateObject({ 
          date: new Date(reminderData.end_date),
          calendar: persian,
          locale: persian_fa 
        }));
      }
      
      setSelectedDays(reminderData.days_of_week || []);
      
      // تبدیل زمان‌ها به فرمت مورد نیاز
      const formattedTimes = reminderData.times.map((time: ReminderTimeResponse) => {
        const [hour, minute] = time.time.split(":");
        return { hour, minute };
      });
      
      setTimes(formattedTimes);
      
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("خطا در دریافت اطلاعات");
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

  // اضافه کردن زمان جدید با مقادیر پیش‌فرض بهتر
  const addTime = () => {
    // زمان فعلی را به عنوان پیش‌فرض استفاده می‌کنیم
    const now = new Date();
    const hour = now.getHours().toString().padStart(2, '0');
    const minute = now.getMinutes().toString().padStart(2, '0');
    setTimes([...times, { hour, minute }]);
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
        await axios.put(
          `http://localhost:8000/api/reminder/medications/${id}/reminders/${reminderId}/`,
          dataWithoutEndDate,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      } else {
        await axios.put(
          `http://localhost:8000/api/reminder/medications/${id}/reminders/${reminderId}/`,
          requestData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      }

      toast.success("یادآور با موفقیت بروزرسانی شد");
      router.push(`/reminder/medications/${id}`);
    } catch (error) {
      console.error("Error updating reminder:", error);
      toast.error("خطا در بروزرسانی یادآور");
    } finally {
      setIsSubmitting(false);
    }
  };

  // حذف یادآور
  const deleteReminder = async () => {
    setIsDeleting(true);
    try {
      const token = localStorage.getItem("access_token");
      if (!token) return;

      await axios.delete(
        `http://localhost:8000/api/reminder/medications/${id}/reminders/${reminderId}/`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success("یادآور با موفقیت حذف شد");
      router.push(`/reminder/medications/${id}`);
    } catch (error) {
      console.error("Error deleting reminder:", error);
      toast.error("خطا در حذف یادآور");
      setIsDeleting(false);
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

  if (!medication || !reminder) {
    return (
      <div className="min-h-screen pharma-container flex justify-center items-center">
        <div className="text-center pharma-card p-8 rounded-lg animate-scaleUp">
          <div className="text-6xl mb-6 text-red-500">❌</div>
          <h2 className="pharma-title mb-4">یادآور یا دارو یافت نشد</h2>
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

      {/* مدال تأیید حذف */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4 animate-scaleUp">
            <h3 className="text-xl font-bold mb-4">حذف یادآور</h3>
            <p className="mb-6">آیا از حذف این یادآور اطمینان دارید؟ این عمل غیرقابل بازگشت است.</p>
            <div className="flex justify-end space-x-3 space-x-reverse">
              <button 
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-md"
              >
                انصراف
              </button>
              <button 
                onClick={deleteReminder}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md flex items-center"
                disabled={isDeleting}
              >
                {isDeleting ? (
                  <>
                    <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin ml-2"></span>
                    در حال حذف...
                  </>
                ) : (
                  "حذف"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-4xl mx-auto relative z-10">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center">
            <Link href={`/reminder/medications/${id}`}>
              <button className="pharma-button py-2 px-4 ml-4 flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                </svg>
                <span>بازگشت</span>
              </button>
            </Link>
            <h1 className="pharma-title text-2xl">ویرایش یادآور</h1>
          </div>
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="pharma-button-danger flex items-center gap-1"
            type="button"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <span>حذف یادآور</span>
          </button>
        </div>

        {/* Medication Info Card */}
        <div className="lab-card mb-8 animate-fadeIn">
          <div className="flex items-center">
            <div className="ml-4 flex-shrink-0 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300 rounded-full p-3 shadow-inner">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
              </svg>
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">{medication.name}</h2>
              <div className="mt-1 text-sm text-gray-600 dark:text-gray-300">{medication.dosage}</div>
            </div>
          </div>
        </div>

        <div className="pharma-card p-6 rounded-lg animate-scaleUp">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* بخش تنظیم تناوب و وضعیت */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="frequency" className="block text-sm font-medium mb-2">
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
                <label htmlFor="status" className="block text-sm font-medium mb-2">
                  وضعیت یادآوری <span className="text-red-500">*</span>
                </label>
                <select
                  id="status"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="pharma-input w-full"
                >
                  <option value="active">فعال</option>
                  <option value="completed">تکمیل شده</option>
                  <option value="paused">متوقف شده</option>
                </select>
              </div>
            </div>

            {/* بخش انتخاب تاریخ */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">
                  تاریخ شروع <span className="text-red-500">*</span>
                </label>
                <div className="pharma-input-container">
                  <DatePicker
                    value={startDate}
                    onChange={setStartDate}
                    calendar={persian}
                    locale={persian_fa}
                    calendarPosition="bottom-right"
                    inputClass="pharma-input w-full text-right"
                    containerClassName="w-full"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  تاریخ پایان
                </label>
                <div className="pharma-input-container">
                  <DatePicker
                    value={endDate}
                    onChange={setEndDate}
                    calendar={persian}
                    locale={persian_fa}
                    calendarPosition="bottom-right"
                    inputClass="pharma-input w-full text-right"
                    containerClassName="w-full"
                  />
                </div>
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                  اگر تاریخ پایان مشخص نشود، یادآوری به صورت نامحدود ادامه خواهد داشت
                </p>
              </div>
            </div>

            {/* بخش انتخاب روزهای هفته */}
            <div>
              <label className="block text-sm font-medium mb-2">
                روزهای یادآوری <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2">
                {daysOfWeek.map((day, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => handleDayToggle(index)}
                    className={`py-2 px-3 rounded-md text-sm transition-colors ${
                      selectedDays.includes(index)
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                    }`}
                  >
                    {day}
                  </button>
                ))}
              </div>
            </div>

            {/* بخش تنظیم زمان‌های یادآوری */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium">
                  زمان‌های یادآوری <span className="text-red-500">*</span>
                </label>
                <button
                  type="button"
                  onClick={addTime}
                  className="pharma-button-secondary text-sm py-1 flex items-center gap-1"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                  </svg>
                  افزودن زمان جدید
                </button>
              </div>

              <div className="space-y-3">
                {times.map((time, index) => (
                  <div key={index} className="flex items-center space-x-2 space-x-reverse bg-gray-50 dark:bg-gray-800 p-3 rounded-lg border border-gray-200 dark:border-gray-700">
                    <div className="flex-1 flex items-center space-x-2 space-x-reverse">
                      <div className="relative">
                        <select
                          value={time.hour}
                          onChange={(e) => handleTimeChange(index, "hour", e.target.value)}
                          className="pharma-input w-20 text-center appearance-none"
                        >
                          {Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, '0')).map(hour => (
                            <option key={hour} value={hour}>{hour}</option>
                          ))}
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center px-2 text-gray-700 dark:text-gray-300">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                          </svg>
                        </div>
                      </div>
                      <span className="text-gray-500 text-xl">:</span>
                      <div className="relative">
                        <select
                          value={time.minute}
                          onChange={(e) => handleTimeChange(index, "minute", e.target.value)}
                          className="pharma-input w-20 text-center appearance-none"
                        >
                          {Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, '0')).map(minute => (
                            <option key={minute} value={minute}>{minute}</option>
                          ))}
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center px-2 text-gray-700 dark:text-gray-300">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                          </svg>
                        </div>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeTime(index)}
                      className="bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 p-2 rounded-full hover:bg-red-200 dark:hover:bg-red-800/50 transition-colors"
                      title="حذف این زمان"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
              {times.length === 0 && (
                <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 text-yellow-800 dark:text-yellow-200 p-3 rounded-md text-sm">
                  حداقل یک زمان یادآوری باید وارد کنید
                </div>
              )}
            </div>

            <div className="flex justify-between space-x-4 space-x-reverse pt-6 border-t dark:border-gray-700">
              <div>
                <button
                  type="button"
                  onClick={() => setShowDeleteConfirm(true)}
                  className="pharma-button-danger-outline flex items-center gap-1"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  <span>حذف یادآور</span>
                </button>
              </div>
              <div className="flex space-x-3 space-x-reverse">
                <Link
                  href={`/reminder/medications/${id}`}
                  className="pharma-button-secondary flex items-center gap-1"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                  <span>انصراف</span>
                </Link>
                <button
                  type="submit"
                  className="pharma-button-primary flex items-center gap-1"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin ml-2"></span>
                      در حال ذخیره...
                    </>
                  ) : (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span>ذخیره تغییرات</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
} 