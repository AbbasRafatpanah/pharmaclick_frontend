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
  times: {
    id: number;
    time: string;
  }[];
}

interface ReminderLog {
  id: number;
  scheduled_time: string;
  status: "pending" | "taken" | "skipped";
  taken_time: string | null;
  notes: string | null;
} 

export default function ReminderLogsPage() {
  const [medication, setMedication] = useState<Medication | null>(null);
  const [reminder, setReminder] = useState<Reminder | null>(null);
  const [logs, setLogs] = useState<ReminderLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationDays, setGenerationDays] = useState(7);
  const [showGuide, setShowGuide] = useState(true);
  const [noteText, setNoteText] = useState("");
  const [activeLogId, setActiveLogId] = useState<number | null>(null);
  const [statusFilter, setStatusFilter] = useState<"all" | "pending" | "taken" | "skipped">("all");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const reminderId = params.reminderId as string;

  // دریافت اطلاعات دارو، یادآور و لاگ‌ها
  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      router.push("/auth/login");
      return;
    }

    fetchData();
  }, [id, reminderId, router]);

  // دریافت اطلاعات
  const fetchData = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem("access_token");
      if (!token) return;

      // دریافت اطلاعات دارو
      const medicationRes = await axios.get(
        `http://localhost:8000/api/reminder/medications/${id}/`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setMedication(medicationRes.data);

      // دریافت اطلاعات یادآور
      const reminderRes = await axios.get(
        `http://localhost:8000/api/reminder/medications/${id}/reminders/${reminderId}/`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setReminder(reminderRes.data);

      // دریافت لاگ‌ها با فیلتر و مرتب‌سازی
      await fetchLogs();
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("خطا در دریافت اطلاعات");
    } finally {
      setIsLoading(false);
    }
  };

  // دریافت لاگ‌ها با فیلتر و مرتب‌سازی
  const fetchLogs = async () => {
    try {
      const token = localStorage.getItem("access_token");
      if (!token) return;

      // ساخت پارامترهای کوئری
      const queryParams = new URLSearchParams();
      if (statusFilter !== "all") {
        queryParams.append("status", statusFilter);
      }
      queryParams.append("sort", sortOrder === "asc" ? "scheduled_time" : "-scheduled_time");

      const logsRes = await axios.get(
        `http://localhost:8000/api/reminder/medications/${id}/reminders/${reminderId}/logs/?${queryParams.toString()}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setLogs(logsRes.data);
    } catch (error) {
      console.error("Error fetching logs:", error);
      toast.error("خطا در دریافت لاگ‌ها");
    }
  };

  // تغییر فیلتر وضعیت
  const handleStatusFilterChange = (newStatus: "all" | "pending" | "taken" | "skipped") => {
    setStatusFilter(newStatus);
    // بعد از تغییر فیلتر، لاگ‌ها را دوباره دریافت می‌کنیم
    setTimeout(() => fetchLogs(), 100);
  };

  // تغییر ترتیب مرتب‌سازی
  const handleSortOrderChange = () => {
    const newSortOrder = sortOrder === "asc" ? "desc" : "asc";
    setSortOrder(newSortOrder);
    // بعد از تغییر ترتیب، لاگ‌ها را دوباره دریافت می‌کنیم
    setTimeout(() => fetchLogs(), 100);
  };

  // تولید لاگ‌های یادآوری
  const generateLogs = async () => {
    try {
      setIsGenerating(true);
      const token = localStorage.getItem("access_token");
      if (!token) return;

      await axios.post(
        `http://localhost:8000/api/reminder/medications/${id}/reminders/${reminderId}/generate-logs/`,
        { days: generationDays },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // بروزرسانی لیست لاگ‌ها
      await fetchLogs();
      toast.success("لاگ‌های یادآوری با موفقیت تولید شدند");
    } catch (error) {
      console.error("Error generating logs:", error);
      toast.error("خطا در تولید لاگ‌های یادآوری");
    } finally {
      setIsGenerating(false);
    }
  };

  // بروزرسانی وضعیت لاگ
  const updateLogStatus = async (logId: number, newStatus: "pending" | "taken" | "skipped") => {
    try {
      const token = localStorage.getItem("access_token");
      if (!token) return;
      
      await axios.patch(
        `http://localhost:8000/api/reminder/medications/${id}/reminders/${reminderId}/logs/${logId}/`,
        { 
          status: newStatus,
          taken_time: newStatus === 'taken' ? new Date().toISOString() : null
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      // بروزرسانی وضعیت لاگ در حالت محلی
      setLogs(logs.map(log => 
        log.id === logId ? { ...log, status: newStatus, taken_time: newStatus === 'taken' ? new Date().toISOString() : null } : log
      ));
      
      toast.success("وضعیت یادآور با موفقیت بروزرسانی شد");
      
    } catch (error) {
      console.error("Error updating log status:", error);
      toast.error("خطا در بروزرسانی وضعیت یادآور");
    }
  };

  // اضافه کردن یادداشت به لاگ
  const addNoteToLog = async (logId: number) => {
    if (!noteText.trim()) {
      toast.error("لطفاً یادداشت را وارد کنید");
      return;
    }

    try {
      const token = localStorage.getItem("access_token");
      if (!token) return;
      
      await axios.patch(
        `http://localhost:8000/api/reminder/medications/${id}/reminders/${reminderId}/logs/${logId}/`,
        { notes: noteText },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      // بروزرسانی یادداشت لاگ در حالت محلی
      setLogs(logs.map(log => 
        log.id === logId ? { ...log, notes: noteText } : log
      ));
      
      // پاک کردن متن یادداشت و بستن فرم
      setNoteText("");
      setActiveLogId(null);
      
      toast.success("یادداشت با موفقیت ذخیره شد");
      
    } catch (error) {
      console.error("Error adding note:", error);
      toast.error("خطا در ذخیره یادداشت");
    }
  };

  // تبدیل وضعیت به نام فارسی
  const getStatusName = (status: string) => {
    switch (status) {
      case "pending":
        return "در انتظار";
      case "taken":
        return "مصرف شده";
      case "skipped":
        return "رد شده";
      default:
        return status;
    }
  };

  // تعیین کلاس رنگ برای وضعیت
  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "status-pending";
      case "taken":
        return "status-taken";
      case "skipped":
        return "status-skipped";
      default:
        return "";
    }
  };

  // فرمت تاریخ به صورت فارسی
  const formatDateTime = (dateTimeStr: string | null) => {
    if (!dateTimeStr) return "";
    
    try {
      const date = new Date(dateTimeStr);
      
      // فرمت تاریخ شمسی
      const persianDate = new Intl.DateTimeFormat("fa-IR", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        calendar: "persian"
      }).format(date);
      
      return persianDate;
    } catch (error) {
      console.error("Error formatting date:", error);
      return dateTimeStr;
    }
  };

  // فیلتر لاگ‌ها بر اساس وضعیت
  const filteredLogs = logs.filter(log => {
    if (statusFilter === "all") return true;
    return log.status === statusFilter;
  });

  // مرتب‌سازی لاگ‌ها بر اساس زمان
  const sortedLogs = [...filteredLogs].sort((a, b) => {
    const dateA = new Date(a.scheduled_time).getTime();
    const dateB = new Date(b.scheduled_time).getTime();
    return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
  });

  // گروه‌بندی لاگ‌ها بر اساس تاریخ
  const groupedLogs = sortedLogs.reduce((groups: Record<string, ReminderLog[]>, log) => {
    // تبدیل تاریخ به فرمت YYYY-MM-DD
    const date = new Date(log.scheduled_time);
    const dateKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    
    if (!groups[dateKey]) {
      groups[dateKey] = [];
    }
    
    groups[dateKey].push(log);
    return groups;
  }, {});

  // تبدیل تاریخ به فرمت فارسی برای نمایش گروه‌ها
  const formatDateForGroup = (dateKey: string) => {
    try {
      const [year, month, day] = dateKey.split('-').map(Number);
      const date = new Date(year, month - 1, day);
      
      return new Intl.DateTimeFormat("fa-IR", {
        year: "numeric",
        month: "long",
        day: "numeric",
        calendar: "persian"
      }).format(date);
    } catch (error) {
      return dateKey;
    }
  };

  // تعیین رنگ پس‌زمینه برای گروه‌ها بر اساس تاریخ (امروز، گذشته، آینده)
  const getDateGroupStyle = (dateKey: string) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const [year, month, day] = dateKey.split('-').map(Number);
    const date = new Date(year, month - 1, day);
    date.setHours(0, 0, 0, 0);
    
    const diffTime = date.getTime() - today.getTime();
    const diffDays = diffTime / (1000 * 60 * 60 * 24);
    
    if (diffDays === 0) {
      return "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800";
    } else if (diffDays < 0) {
      return "bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700";
    } else {
      return "bg-green-50 dark:bg-green-900/10 border-green-200 dark:border-green-800";
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
            <h1 className="pharma-title text-2xl">سوابق یادآور</h1>
          </div>
          <Link href={`/reminder/medications/${id}/reminders/${reminderId}/edit`}>
            <button className="pharma-button py-2 px-4 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
              </svg>
              <span>ویرایش یادآور</span>
            </button>
          </Link>
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

        {/* راهنمای استفاده */}
        {showGuide && (
          <div className="pharma-card p-6 rounded-lg mb-6 animate-fadeIn border-r-4 border-blue-500">
            <div className="flex justify-between items-start">
              <div className="flex items-start">
                <div className="ml-4 flex-shrink-0 text-blue-600 dark:text-blue-300">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-lg font-bold mb-2">راهنمای استفاده از صفحه سوابق یادآور</h2>
                  <ul className="list-disc mr-5 space-y-1 text-gray-600 dark:text-gray-300">
                    <li>برای شروع، از بخش «تولید لاگ‌های یادآوری» استفاده کنید تا یادآورهای آینده ایجاد شوند.</li>
                    <li>پس از تولید لاگ‌ها، می‌توانید وضعیت هر یادآور را به «مصرف شده» یا «رد شده» تغییر دهید.</li>
                    <li>برای هر یادآور می‌توانید یادداشت اضافه کنید (مثلاً علت رد کردن دارو یا عوارض جانبی).</li>
                    <li>می‌توانید لاگ‌ها را بر اساس وضعیت فیلتر کنید.</li>
                  </ul>
                </div>
              </div>
              <button 
                onClick={() => setShowGuide(false)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
        )}

        {/* Generate Logs Form */}
        <div className="pharma-card p-6 rounded-lg mb-6 animate-scaleUp">
          <h2 className="text-lg font-bold mb-4 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
            </svg>
            تولید لاگ‌های یادآوری
          </h2>
          
          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-md mb-4 text-sm text-blue-800 dark:text-blue-200">
            <p>با استفاده از این بخش، می‌توانید برای روزهای آینده یادآورهای خودکار تولید کنید. این یادآورها بر اساس تناوب و زمان‌های تعیین شده در تنظیمات یادآور ایجاد می‌شوند.</p>
          </div>
          
          <div className="flex flex-col md:flex-row md:items-end gap-4">
            <div className="flex-1">
              <label htmlFor="generationDays" className="block text-sm font-medium mb-2">
                تعداد روزهای آینده
              </label>
              <div className="flex items-center">
                <input
                  type="range"
                  id="generationDaysRange"
                  min="1"
                  max="30"
                  value={generationDays}
                  onChange={(e) => setGenerationDays(parseInt(e.target.value))}
                  className="flex-1 mr-4"
                />
                <input
                  type="number"
                  id="generationDays"
                  min="1"
                  max="30"
                  value={generationDays}
                  onChange={(e) => setGenerationDays(parseInt(e.target.value) || 7)}
                  className="pharma-input w-20 text-center"
                />
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                لاگ‌های یادآوری برای {generationDays} روز آینده ایجاد خواهند شد.
              </p>
            </div>
            <div className="flex-shrink-0">
              <button
                onClick={generateLogs}
                disabled={isGenerating}
                className="pharma-button-primary w-full md:w-auto flex items-center justify-center gap-2"
              >
                {isGenerating ? (
                  <>
                    <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    <span>در حال تولید...</span>
                  </>
                ) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                    </svg>
                    <span>تولید لاگ‌های یادآوری</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Logs List */}
        <div className="pharma-card p-6 rounded-lg animate-scaleUp">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7.414A2 2 0 0015.414 6L12 2.586A2 2 0 0010.586 2H6zm2 10a1 1 0 10-2 0v3a1 1 0 102 0v-3zm2-3a1 1 0 011 1v5a1 1 0 11-2 0v-5a1 1 0 011-1zm4-1a1 1 0 10-2 0v7a1 1 0 102 0V8z" clipRule="evenodd" />
              </svg>
              لیست یادآوری‌ها
            </h2>
            <div className="flex items-center gap-2">
              <div className="relative">
                <select
                  value={statusFilter}
                  onChange={(e) => handleStatusFilterChange(e.target.value as "all" | "pending" | "taken" | "skipped")}
                  className="pharma-input pl-8 pr-2 py-1 text-sm appearance-none"
                >
                  <option value="all">همه وضعیت‌ها</option>
                  <option value="pending">در انتظار</option>
                  <option value="taken">مصرف شده</option>
                  <option value="skipped">رد شده</option>
                </select>
                <div className="absolute inset-y-0 right-2 flex items-center pointer-events-none">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                  </svg>
                </div>
              </div>
              <button
                onClick={handleSortOrderChange}
                className="pharma-button py-1 px-2 text-sm flex items-center gap-1"
                title={sortOrder === "asc" ? "مرتب‌سازی نزولی" : "مرتب‌سازی صعودی"}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  {sortOrder === "asc" ? (
                    <path d="M3 3a1 1 0 000 2h11a1 1 0 100-2H3zM3 7a1 1 0 000 2h7a1 1 0 100-2H3zM3 11a1 1 0 100 2h4a1 1 0 100-2H3zM15 8a1 1 0 10-2 0v5.586l-1.293-1.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L15 13.586V8z" />
                  ) : (
                    <path d="M3 3a1 1 0 000 2h11a1 1 0 100-2H3zM3 7a1 1 0 000 2h5a1 1 0 000-2H3zM3 11a1 1 0 100 2h4a1 1 0 100-2H3zM13 16a1 1 0 102 0v-5.586l1.293 1.293a1 1 0 001.414-1.414l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 101.414 1.414L13 10.414V16z" />
                  )}
                </svg>
                <span>{sortOrder === "asc" ? "قدیمی‌ترین" : "جدیدترین"}</span>
              </button>
            </div>
          </div>
          
          {/* آمار لاگ‌ها */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3 text-center border border-blue-200 dark:border-blue-800">
              <div className="text-2xl font-bold text-blue-700 dark:text-blue-300">
                {logs.filter(log => log.status === "pending").length}
              </div>
              <div className="text-sm text-blue-600 dark:text-blue-400">در انتظار</div>
            </div>
            <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-3 text-center border border-green-200 dark:border-green-800">
              <div className="text-2xl font-bold text-green-700 dark:text-green-300">
                {logs.filter(log => log.status === "taken").length}
              </div>
              <div className="text-sm text-green-600 dark:text-green-400">مصرف شده</div>
            </div>
            <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-3 text-center border border-red-200 dark:border-red-800">
              <div className="text-2xl font-bold text-red-700 dark:text-red-300">
                {logs.filter(log => log.status === "skipped").length}
              </div>
              <div className="text-sm text-red-600 dark:text-red-400">رد شده</div>
            </div>
          </div>
          
          {Object.keys(groupedLogs).length > 0 ? (
            <div className="space-y-6">
              {Object.entries(groupedLogs).map(([dateKey, logsForDate]) => (
                <div key={dateKey} className={`border rounded-lg overflow-hidden ${getDateGroupStyle(dateKey)}`}>
                  <div className="p-3 font-bold border-b border-inherit">
                    {formatDateForGroup(dateKey)}
                  </div>
                  <div className="divide-y divide-gray-200 dark:divide-gray-700">
                    {logsForDate.map((log) => (
                      <div key={log.id} className="p-4 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                        <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
                          {/* اطلاعات اصلی لاگ */}
                          <div className="flex-1">
                            <div className="flex items-center mb-2">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                              </svg>
                              <div className="text-base font-medium">
                                {new Date(log.scheduled_time).toLocaleTimeString("fa-IR", {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                  hour12: false
                                })}
                              </div>
                            </div>
                            
                            <div className="flex items-center mt-2">
                              <span className={`px-2 py-1 rounded-md text-xs ${getStatusColor(log.status)}`}>
                                {getStatusName(log.status)}
                              </span>
                              
                              {log.taken_time && (
                                <div className="mr-3 text-xs text-gray-600 dark:text-gray-400 flex items-center">
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                  </svg>
                                  {formatDateTime(log.taken_time)}
                                </div>
                              )}
                            </div>
                            
                            {/* نمایش یادداشت‌ها */}
                            {log.notes && (
                              <div className="mt-3 bg-gray-50 dark:bg-gray-700 p-3 rounded-md text-sm">
                                <div className="flex items-center text-gray-600 dark:text-gray-400 mb-1">
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M18 13V5a2 2 0 00-2-2H4a2 2 0 00-2 2v8a2 2 0 002 2h3l3 3 3-3h3a2 2 0 002-2zM5 7a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1zm1 3a1 1 0 100 2h3a1 1 0 100-2H6z" clipRule="evenodd" />
                                  </svg>
                                  یادداشت:
                                </div>
                                <p className="text-gray-800 dark:text-gray-200 whitespace-pre-wrap">{log.notes}</p>
                              </div>
                            )}
                            
                            {/* فرم افزودن یادداشت */}
                            {activeLogId === log.id && (
                              <div className="mt-3 bg-blue-50 dark:bg-blue-900/20 p-3 rounded-md">
                                <label htmlFor={`note-${log.id}`} className="block text-sm font-medium mb-1">
                                  افزودن یادداشت
                                </label>
                                <textarea
                                  id={`note-${log.id}`}
                                  value={noteText}
                                  onChange={(e) => setNoteText(e.target.value)}
                                  className="pharma-input w-full h-20 mb-2"
                                  placeholder="یادداشت خود را وارد کنید..."
                                />
                                <div className="flex justify-end space-x-2 space-x-reverse">
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setActiveLogId(null);
                                      setNoteText("");
                                    }}
                                    className="pharma-button py-1 px-3 text-sm"
                                  >
                                    انصراف
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => addNoteToLog(log.id)}
                                    className="pharma-button-primary py-1 px-3 text-sm"
                                  >
                                    ذخیره
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
                          
                          {/* دکمه‌های عملیات */}
                          <div className="flex md:flex-col gap-2">
                            {log.status === "pending" ? (
                              <>
                                <button
                                  onClick={() => updateLogStatus(log.id, "taken")}
                                  className="flex-1 md:flex-none pharma-button-primary py-1 px-2 text-sm flex items-center justify-center gap-1"
                                >
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                  </svg>
                                  <span>مصرف شد</span>
                                </button>
                                <button
                                  onClick={() => updateLogStatus(log.id, "skipped")}
                                  className="flex-1 md:flex-none bg-red-600 hover:bg-red-700 text-white py-1 px-2 rounded-md text-sm flex items-center justify-center gap-1"
                                >
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                  </svg>
                                  <span>رد شد</span>
                                </button>
                              </>
                            ) : (
                              <button
                                onClick={() => updateLogStatus(log.id, "pending")}
                                className="flex-1 md:flex-none bg-yellow-600 hover:bg-yellow-700 text-white py-1 px-2 rounded-md text-sm flex items-center justify-center gap-1"
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                  <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                                </svg>
                                <span>بازنشانی</span>
                              </button>
                            )}
                            
                            <button
                              onClick={() => {
                                setActiveLogId(activeLogId === log.id ? null : log.id);
                                setNoteText(log.notes || "");
                              }}
                              className="flex-1 md:flex-none pharma-button py-1 px-2 text-sm flex items-center justify-center gap-1"
                              title={log.notes ? "ویرایش یادداشت" : "افزودن یادداشت"}
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M18 13V5a2 2 0 00-2-2H4a2 2 0 00-2 2v8a2 2 0 002 2h3l3 3 3-3h3a2 2 0 002-2zM5 7a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1zm1 3a1 1 0 100 2h3a1 1 0 100-2H6z" clipRule="evenodd" />
                              </svg>
                              <span>{log.notes ? "ویرایش" : "یادداشت"}</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              <div className="text-6xl mb-4">📅</div>
              <p className="text-lg font-medium mb-2">هنوز هیچ لاگ یادآوری‌ای وجود ندارد</p>
              <p className="mb-4">برای تولید لاگ‌های یادآوری، از فرم بالا استفاده کنید</p>
              <button
                onClick={generateLogs}
                disabled={isGenerating}
                className="pharma-button-primary"
              >
                {isGenerating ? "در حال تولید..." : "تولید لاگ‌های یادآوری"}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 