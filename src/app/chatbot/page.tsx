"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "sonner";
import ReactMarkdown from "react-markdown";
import rehypeSanitize from "rehype-sanitize";
import Image from "next/image";
import { GradientBlob, GridPattern, FloatingParticles, Pills, MedicineBottle } from "@/components/BackgroundElements";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { PlusCircle, Send, Image as ImageIcon, X, ArrowLeft, MessageSquare, Calendar, Menu, ChevronRight } from "lucide-react";
import Head from "next/head";
import Script from "next/script";
import { API_ENDPOINTS, authHeaders, getFullImageUrl } from "@/lib/api-config";

// Removed metadata export - cannot export metadata from a client component

interface Message {
  id: number;
  role: "user" | "assistant";
  content: string;
  created_at: string;
  images?: {
    id: number;
    image: string;
  }[];
}

interface ChatSession {
  id: number;
  title: string;
  created_at: string;
  updated_at: string;
}

export default function ChatbotPage() {
  const [message, setMessage] = useState("");
  const [chatHistory, setChatHistory] = useState<Message[]>([]);
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [activeSession, setActiveSession] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [newSessionTitle, setNewSessionTitle] = useState("");
  const [showNewSessionModal, setShowNewSessionModal] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  const router = useRouter();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // اسکرول به آخرین پیام
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  };

  // بررسی اعتبار توکن
  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      router.push("/auth/login");
    }
  }, [router]);

  // دریافت جلسات چت
  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const token = localStorage.getItem("access_token");
        if (!token) return;

        const response = await axios.get(API_ENDPOINTS.CHATBOT.SESSIONS, {
          headers: authHeaders()
        });
        setSessions(response.data);
        
        // اگر جلسه فعالی وجود ندارد، اولین جلسه را فعال کنیم
        if (response.data.length > 0 && !activeSession) {
          setActiveSession(response.data[0].id);
          fetchMessages(response.data[0].id);
        }
      } catch (error) {
        console.error("Error fetching sessions:", error);
        toast.error("خطا در دریافت جلسات گفتگو");
      }
    };

    fetchSessions();
  }, [activeSession]);

  // تنظیم سایدبار برای موبایل
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setShowSidebar(true);
      } else {
        setShowSidebar(false);
      }
    };

    // اجرای اولیه
    handleResize();

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // دریافت پیام‌های یک جلسه
  const fetchMessages = async (sessionId: number) => {
    try {
      const token = localStorage.getItem("access_token");
      if (!token) return;

      const response = await axios.get(API_ENDPOINTS.CHATBOT.MESSAGES(sessionId), {
        headers: authHeaders()
      });
      setChatHistory(response.data);
      
      setTimeout(scrollToBottom, 100);
    } catch (error) {
      console.error("Error fetching messages:", error);
      toast.error("خطا در دریافت پیام‌ها");
    }
  };

  // ارسال پیام
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() && !image) return;
    if (!activeSession) {
      toast.error("ابتدا یک جلسه گفتگو انتخاب کنید یا ایجاد نمایید");
      return;
    }
    
    setIsLoading(true);

    // ایجاد یک پیام موقت کاربر برای نمایش فوری
    const tempUserMessage: Message = {
      id: Date.now(), // یک ID موقت
      role: "user",
      content: message,
      created_at: new Date().toISOString(),
      images: image ? [{ id: Date.now(), image: imagePreview || "" }] : undefined
    };
    
    // افزودن پیام کاربر به تاریخچه قبل از دریافت پاسخ از سرور
    setChatHistory(prev => [...prev, tempUserMessage]);
    
    // اسکرول به پایین بعد از افزودن پیام کاربر
    setTimeout(scrollToBottom, 100);

    try {
      const token = localStorage.getItem("access_token");
      if (!token) return;

      const formData = new FormData();
      formData.append("content", message);
      if (image) {
        formData.append("uploaded_image", image);
      }

      // پاک کردن فیلدها قبل از دریافت پاسخ
      const currentMessage = message;
      setMessage("");
      setImage(null);
      setImagePreview(null);

      const response = await axios.post(
        API_ENDPOINTS.CHATBOT.MESSAGES(activeSession),
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      const { user_message, ai_message } = response.data;
      
      // جایگزینی پیام موقت با پیام واقعی و افزودن پاسخ هوش مصنوعی
      setChatHistory(prev => {
        // حذف پیام موقت
        const filteredHistory = prev.filter(msg => msg.id !== tempUserMessage.id);
        // افزودن پیام‌های واقعی
        return [...filteredHistory, user_message, ai_message];
      });
      
      setTimeout(scrollToBottom, 100);
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("خطا در ارسال پیام");
      
      // در صورت خطا، پیام موقت را حفظ می‌کنیم اما وضعیت را به کاربر اطلاع می‌دهیم
      setChatHistory(prev => {
        const lastMessage = prev[prev.length - 1];
        if (lastMessage.id === tempUserMessage.id) {
          return [...prev.slice(0, -1), {...lastMessage, content: lastMessage.content + " (خطا در ارسال)"}];
        }
        return prev;
      });
    } finally {
      setIsLoading(false);
    }
  };

  // ایجاد جلسه جدید
  const handleCreateSession = async () => {
    if (!newSessionTitle.trim()) {
      toast.error("عنوان جلسه را وارد کنید");
      return;
    }

    try {
      const token = localStorage.getItem("access_token");
      if (!token) return;

      const response = await axios.post(
        API_ENDPOINTS.CHATBOT.SESSIONS,
        {
          title: newSessionTitle,
        },
        {
          headers: authHeaders()
        }
      );

      setSessions((prev) => [...prev, response.data]);
      setActiveSession(response.data.id);
      setChatHistory([]);
      setNewSessionTitle("");
      setShowNewSessionModal(false);
      
      // در موبایل، بعد از ایجاد جلسه جدید سایدبار را ببندیم
      if (window.innerWidth < 768) {
        setShowSidebar(false);
      }
      
      toast.success("جلسه جدید با موفقیت ایجاد شد");
    } catch (error) {
      console.error("Error creating session:", error);
      toast.error("خطا در ایجاد جلسه");
    }
  };

  // انتخاب تصویر
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      
      // بررسی نوع فایل
      const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
      if (!validTypes.includes(selectedFile.type)) {
        toast.error("لطفاً فقط فایل‌های تصویری (JPG, PNG, GIF یا WEBP) را انتخاب کنید");
        return;
      }
      
      // بررسی حجم فایل (حداکثر 20 مگابایت)
      const maxSize = 20 * 1024 * 1024; // 20MB
      if (selectedFile.size > maxSize) {
        toast.error("حجم تصویر نباید بیشتر از 20 مگابایت باشد");
        return;
      }
      
      // ایجاد پیش‌نمایش تصویر
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
      
      setImage(selectedFile);
    }
  };

  // پاک کردن تصویر انتخاب شده
  const handleClearImage = () => {
    setImage(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // تغییر جلسه فعال
  const handleSessionChange = (sessionId: number) => {
    setActiveSession(sessionId);
    fetchMessages(sessionId);
    
    // در موبایل، بعد از انتخاب جلسه سایدبار را ببندیم
    if (window.innerWidth < 768) {
      setShowSidebar(false);
    }
  };

  // فرمت تاریخ به صورت فارسی
  const formatDate = (dateString: string) => {
    if (!dateString) return "بدون تاریخ";
    
    try {
      const date = new Date(dateString);
      
      // بررسی معتبر بودن تاریخ
      if (isNaN(date.getTime())) {
        return "تاریخ نامعتبر";
      }
      
      return new Intl.DateTimeFormat("fa-IR", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }).format(date);
    } catch (error) {
      console.error("Error formatting date:", error);
      return "خطا در تاریخ";
    }
  };

  const activeSessionTitle = sessions.find(s => s.id === activeSession)?.title || "گفتگو";

  return (
    <>
      {/* Structured Data for Chatbot */}
      <Script
        id="jsonld-chatbot"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            "name": "چت‌بات هوشمند پزشکی فارماکلیک",
            "description": "سامانه هوشمند پاسخ به سوالات پزشکی و دارویی با پشتیبانی هوش مصنوعی",
            "applicationCategory": "HealthApplication",
            "operatingSystem": "Web",
            "offers": {
              "@type": "Offer",
              "price": "0",
              "priceCurrency": "IRR"
            },
            "featureList": "پاسخ به سوالات دارویی، تشخیص دارو از روی عکس، اطلاعات تداخلات دارویی، دستورالعمل مصرف دارو"
          })
        }}
      />

      <div className="relative min-h-screen bg-white dark:bg-gray-900">
        <div className="absolute inset-0 pointer-events-none">
          <GridPattern />
          <GradientBlob className="right-0 top-0 text-blue-500/30" />
          <GradientBlob className="left-0 bottom-0 text-indigo-500/30" />
          <FloatingParticles count={15} />
          <Pills className="top-[30%] left-[15%] text-blue-500/20 animate-float hidden lg:block" size={60} />
          <MedicineBottle className="bottom-[20%] right-[10%] text-blue-500/20 animate-float hidden lg:block" size={60} />
        </div>

        <div className="relative z-10 flex h-[calc(100vh-64px)]">
          {/* Mobile Sidebar Toggle */}
          <div className="absolute top-4 left-4 z-20 md:hidden">
            <Button
              variant="outline"
              size="icon"
              className="rounded-full"
              onClick={() => setShowSidebar(!showSidebar)}
            >
              <Menu className="h-5 w-5" />
            </Button>
          </div>
          
          {/* Sidebar */}
          {showSidebar && (
            <div className="w-full md:w-80 h-full bg-white dark:bg-gray-900 border-l dark:border-gray-800 flex flex-col p-4 z-10 absolute md:relative right-0 top-0">
              <div className="sticky top-0 z-10 bg-gradient-to-r from-blue-100 to-indigo-100 dark:from-blue-900/50 dark:to-indigo-900/50 border-b dark:border-gray-700 shadow-sm">
                <div className="flex justify-between items-center p-4">
                  <h2 className="text-xl font-bold text-blue-800 dark:text-blue-300 flex items-center gap-2">
                    <MessageSquare className="h-5 w-5" />
                    گفتگوهای شما
                  </h2>
                  <button
                    onClick={() => setShowSidebar(false)}
                    className="md:hidden bg-blue-200 dark:bg-blue-800 text-blue-800 dark:text-blue-200 p-1.5 rounded-full"
                    aria-label="بستن منو"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
                <div className="px-4 pb-4">
                  <Button
                    onClick={() => setShowNewSessionModal(true)}
                    variant="gradient"
                    className="w-full gap-2"
                  >
                    <span>گفتگوی جدید</span>
                    <PlusCircle className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              <div className="p-4">
                <div className="space-y-2">
                  {sessions.length > 0 ? (
                    sessions.map((session, index) => (
                      <div
                        key={session.id}
                        className={`p-3 rounded-lg cursor-pointer transition-all duration-200 ${
                          activeSession === session.id
                            ? "bg-blue-100 dark:bg-blue-900/40 border-r-4 border-blue-500 shadow-md"
                            : "hover:bg-gray-100 dark:hover:bg-gray-700 bg-white/60 dark:bg-gray-800/60"
                        }`}
                        onClick={() => handleSessionChange(session.id)}
                      >
                        <div className="font-medium">{session.title}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 mt-1 flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {formatDate(session.updated_at)}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 px-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                      <div className="text-4xl mb-3 opacity-50">💬</div>
                      <p className="text-gray-500 dark:text-gray-400 mb-4">هنوز گفتگویی ندارید</p>
                      <Button
                        onClick={() => setShowNewSessionModal(true)}
                        variant="outline"
                        className="w-full"
                      >
                        ایجاد اولین گفتگو
                      </Button>
                    </div>
                  )}
                </div>
              </div>

              {/* Decorative elements */}
              <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-blue-50/50 dark:from-blue-900/20 to-transparent pointer-events-none"></div>
              <MedicineBottle className="absolute bottom-5 left-5 text-blue-500/20 hidden lg:block" size={60} />
              <Pills className="absolute top-1/2 right-5 text-blue-500/20 hidden lg:block" size={50} />
            </div>
          )}

          {/* Chat Area */}
          <div className="flex-1 flex flex-col h-screen max-h-screen overflow-hidden relative z-10">
            {/* Chat Header */}
            <div className="sticky top-0 z-20 bg-white/80 dark:bg-gray-800/80 backdrop-blur-md p-4 border-b dark:border-gray-700 flex items-center shadow-md">
              <div className="flex-1 flex items-center">
                {!showSidebar && (
                  <button
                    onClick={() => setShowSidebar(true)}
                    className="md:hidden mr-3 text-blue-600 dark:text-blue-400"
                    aria-label="نمایش گفتگوها"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                )}
                <h2 className="text-xl font-bold text-blue-800 dark:text-blue-300 flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  {activeSessionTitle}
                </h2>
              </div>
              <Button
                onClick={() => router.push("/")}
                variant="outline"
                size="sm"
                className="gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                <span className="hidden sm:inline">بازگشت به خانه</span>
              </Button>
            </div>

            {/* Messages Container with proper padding for input area */}
            <div className="relative flex-1 overflow-hidden">
              {/* Messages Scrollable Area */}
              <div className="absolute inset-0 overflow-y-auto scrollbar-thin p-3 sm:p-6">
                {activeSession ? (
                  chatHistory.length > 0 ? (
                    <>
                      {chatHistory.map((msg, index) => (
                        <div
                          key={msg.id}
                          className={`flex ${
                            msg.role === "user" ? "justify-start" : "justify-end"
                          } mb-4`}
                        >
                          <div
                            className={`max-w-[90%] sm:max-w-[80%] rounded-2xl p-3 sm:p-4 ${
                              msg.role === "user"
                                ? "bg-blue-600 text-white"
                                : "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
                            }`}
                          >
                            {msg.images && msg.images.length > 0 && (
                              <div className="mb-3">
                                {msg.images.map((img) => (
                                  <div key={img.id} className="relative rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 mb-2">
                                    <img
                                      src={img.image.startsWith('data:') ? img.image : getFullImageUrl(img.image)}
                                      alt="تصویر کاربر"
                                      className="max-w-full rounded-lg"
                                    />
                                    <div className="absolute bottom-0 right-0 p-1 bg-blue-500/70 text-white text-xs rounded-tl-md">
                                      تصویر ارسالی
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                            <div className="whitespace-pre-wrap">
                              {msg.role === "assistant" ? (
                                <div className="prose prose-sm dark:prose-invert max-w-none markdown-custom">
                                  <ReactMarkdown rehypePlugins={[rehypeSanitize]}>
                                    {msg.content}
                                  </ReactMarkdown>
                                </div>
                              ) : (
                                msg.content
                              )}
                            </div>
                            <div
                              className={`text-xs mt-2 ${
                                msg.role === "user"
                                  ? "text-blue-100"
                                  : "text-gray-500 dark:text-gray-400"
                              }`}
                            >
                              {formatDate(msg.created_at)}
                            </div>
                          </div>
                        </div>
                      ))}
                      {/* Extra space at the bottom to ensure messages don't get hidden under input area */}
                      <div className="h-32"></div>
                      <div ref={messagesEndRef} className="h-1"></div>
                    </>
                  ) : (
                    <div className="h-full flex items-center justify-center">
                      <Card variant="glass" className="max-w-lg w-full text-center p-6">
                        <CardHeader>
                          <div className="text-6xl mb-6 text-blue-500 mx-auto">💊</div>
                          <CardTitle className="text-2xl mb-2">به چت‌بات دارویی خوش آمدید</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <p className="text-muted-foreground">
                          می‌توانید هر سؤالی درباره داروها از من بپرسید.
                          <br/>
                          برای شروع، کافیست سؤال خود را در کادر پایین بنویسید.
                          </p>
                          <div className="p-4 bg-blue-100/50 dark:bg-blue-900/30 rounded-lg text-sm">
                            <p className="font-semibold mb-2 text-blue-800 dark:text-blue-300">🔜 به زودی: پشتیبانی از تصاویر</p>
                            <p>به زودی امکان آپلود تصاویر داروها، نسخه‌ها یا بسته‌بندی‌ها برای تحلیل فراهم خواهد شد!</p>
                        </div>
                        </CardContent>
                      </Card>
                    </div>
                  )
                ) : (
                  <div className="h-full flex items-center justify-center">
                    <Card variant="glass" className="max-w-lg w-full text-center p-6">
                      <CardHeader>
                        <div className="text-6xl mb-6 text-blue-500 mx-auto">💬</div>
                        <CardTitle className="text-2xl mb-2">گفتگویی انتخاب نشده است</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <p className="text-muted-foreground">
                          لطفاً یک گفتگو از لیست سمت راست انتخاب کنید یا گفتگوی جدیدی ایجاد نمایید.
                        </p>
                        <Button
                        onClick={() => setShowNewSessionModal(true)}
                          variant="gradient"
                          className="gap-2"
                      >
                        <span>ایجاد گفتگوی جدید</span>
                          <PlusCircle className="h-4 w-4" />
                        </Button>
                      </CardContent>
                    </Card>
                  </div>
                )}
              </div>
            </div>

            {/* Input Area - Fixed at the bottom */}
            <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-md p-3 sm:p-4 border-t dark:border-gray-700 shadow-lg z-20">
              {/* Image Preview */}
              {imagePreview && (
                <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-sm font-medium text-blue-800 dark:text-blue-300 flex items-center">
                      <ImageIcon className="h-4 w-4 mr-1" />
                      پیش‌نمایش تصویر
                    </div>
                    <Button 
                      onClick={handleClearImage}
                      variant="ghost"
                      size="sm"
                      className="h-8 text-red-600 hover:text-red-700 hover:bg-red-100 dark:hover:bg-red-900/20 p-1"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="relative">
                    <img 
                      src={imagePreview} 
                      alt="پیش‌نمایش تصویر" 
                      className="max-h-40 rounded-md object-contain mx-auto border border-blue-200 dark:border-blue-800"
                    />
                    {image && (
                      <div className="absolute bottom-1 right-1 bg-blue-100 dark:bg-blue-900/70 text-blue-800 dark:text-blue-200 text-xs p-1 rounded-md">
                        {(image.size / (1024 * 1024)).toFixed(2)} MB
                      </div>
                    )}
                  </div>
                  <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                    <p>نوع فایل: <span className="text-blue-600 dark:text-blue-400 font-mono">{image?.type}</span></p>
                    <p className="text-xs mt-1 text-blue-600 dark:text-blue-400">
                      تصویر باید کمتر از 20 مگابایت باشد و فرمت JPG، PNG، WEBP یا GIF داشته باشد.
                    </p>
                  </div>
                </div>
              )}

              <form onSubmit={handleSendMessage} className="flex space-x-2 space-x-reverse">
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  className="rounded-full"
                  onClick={() => toast.info("قابلیت ارسال تصویر به زودی فعال خواهد شد")}
                  title="به زودی: آپلود تصویر"
                >
                  <ImageIcon className="h-5 w-5 text-gray-400" />
                <input
                  id="file-upload"
                    ref={fileInputRef}
                  type="file"
                    accept="image/jpeg,image/png,image/gif,image/webp"
                  onChange={handleImageChange}
                  className="hidden"
                  disabled
                />
                </Button>
                <Input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="پیام خود را بنویسید..."
                  disabled={isLoading || !activeSession}
                  variant="modern"
                  className="flex-1"
                />
                <Button
                  type="submit"
                  variant="gradient"
                  size="icon"
                  disabled={isLoading || (!message.trim()) || !activeSession}
                  className="rounded-full"
                >
                  {isLoading ? (
                    <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  ) : (
                    <Send className="h-5 w-5" />
                  )}
                </Button>
              </form>
            </div>
          </div>

          {/* Overlay for mobile when sidebar is open */}
          {showSidebar && window.innerWidth < 768 && (
            <div 
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-20"
              onClick={() => setShowSidebar(false)}
            />
          )}

          {/* New Session Modal */}
          {showNewSessionModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 backdrop-blur-sm">
              <Card variant="glass" className="w-96 p-4 max-w-[90%]">
                <CardHeader>
                  <CardTitle>گفتگوی جدید</CardTitle>
                </CardHeader>
                <CardContent>
                  <Input
                  type="text"
                  value={newSessionTitle}
                  onChange={(e) => setNewSessionTitle(e.target.value)}
                  placeholder="عنوان گفتگو"
                    variant="modern"
                    className="w-full mb-4"
                />
                  <div className="flex justify-end gap-2">
                    <Button
                    onClick={() => setShowNewSessionModal(false)}
                      variant="outline"
                  >
                    انصراف
                  </Button>
                    <Button
                    onClick={handleCreateSession}
                      variant="gradient"
                  >
                    ایجاد
                  </Button>
              </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </>
  );
} 