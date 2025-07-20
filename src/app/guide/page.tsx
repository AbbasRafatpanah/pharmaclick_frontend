'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Container } from '@/components/ui/container';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  GradientBlob, 
  GridPattern, 
  FloatingParticles
} from "@/components/BackgroundElements";

export default function GuidePage() {
  const [activeSection, setActiveSection] = useState('intro');

  // Helper function to determine if a section is active
  const isActive = (section: string) => activeSection === section;

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800 py-8 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Elements */}
      <GridPattern className="opacity-30" />
      <GradientBlob className="top-20 left-20 w-96 h-96 opacity-10" color="blue" />
      <GradientBlob className="bottom-20 right-20 w-96 h-96 opacity-10" color="purple" />
      <FloatingParticles count={12} />

      <Container className="relative z-10">
        <div className="py-8">
          <h1 className="text-3xl font-bold mb-2 text-center text-blue-800 dark:text-blue-300">راهنمای استفاده از سیستم یادآوری دارو</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-8 text-center">
            این راهنما به شما کمک می‌کند تا به راحتی از تمام امکانات سیستم یادآوری دارو استفاده کنید.
          </p>

          <div className="flex flex-col md:flex-row gap-6">
            {/* Sidebar navigation */}
            <div className="md:w-1/4">
              <Card className="p-4 sticky top-4">
                <h2 className="text-lg font-bold mb-4 text-blue-700 dark:text-blue-300">فهرست مطالب</h2>
                <nav className="space-y-2">
                  <button
                    onClick={() => setActiveSection('intro')}
                    className={`w-full text-right py-2 px-3 rounded-md transition ${
                      isActive('intro')
                        ? 'bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300'
                        : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                    }`}
                  >
                    معرفی سیستم
                  </button>
                  <button
                    onClick={() => setActiveSection('medications')}
                    className={`w-full text-right py-2 px-3 rounded-md transition ${
                      isActive('medications')
                        ? 'bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300'
                        : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                    }`}
                  >
                    مدیریت داروها
                  </button>
                  <button
                    onClick={() => setActiveSection('reminders')}
                    className={`w-full text-right py-2 px-3 rounded-md transition ${
                      isActive('reminders')
                        ? 'bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300'
                        : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                    }`}
                  >
                    تنظیم یادآورها
                  </button>
                  <button
                    onClick={() => setActiveSection('logs')}
                    className={`w-full text-right py-2 px-3 rounded-md transition ${
                      isActive('logs')
                        ? 'bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300'
                        : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                    }`}
                  >
                    مدیریت لاگ‌ها
                  </button>
                  <button
                    onClick={() => setActiveSection('faq')}
                    className={`w-full text-right py-2 px-3 rounded-md transition ${
                      isActive('faq')
                        ? 'bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300'
                        : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                    }`}
                  >
                    سوالات متداول
                  </button>
                </nav>
                <div className="mt-6">
                  <Link href="/reminder">
                    <Button variant="outline" className="w-full">
                      بازگشت به صفحه یادآورها
                    </Button>
                  </Link>
                </div>
              </Card>
            </div>

            {/* Main content */}
            <div className="md:w-3/4">
              <Card className="p-6">
                {/* Introduction section */}
                {isActive('intro') && (
                  <div className="space-y-6 animate-fadeIn">
                    <h2 className="text-2xl font-bold text-blue-700 dark:text-blue-300">معرفی سیستم یادآوری دارو</h2>
                    <p className="text-gray-700 dark:text-gray-300">
                      سیستم یادآوری دارو به شما کمک می‌کند تا برنامه مصرف داروهای خود را به صورت منظم مدیریت کنید. 
                      با استفاده از این سیستم، می‌توانید:
                    </p>
                    <ul className="list-disc list-inside space-y-2 pr-4 text-gray-700 dark:text-gray-300">
                      <li>داروهای خود را با جزئیات کامل ثبت کنید</li>
                      <li>برای هر دارو چندین یادآور با زمان‌بندی مختلف تنظیم کنید</li>
                      <li>سابقه مصرف داروها را به صورت روزانه پیگیری کنید</li>
                      <li>گزارش‌های مختلف از وضعیت مصرف داروها دریافت کنید</li>
                    </ul>

                    <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-100 dark:border-blue-800">
                      <h3 className="text-lg font-bold text-blue-700 dark:text-blue-300 mb-2">چگونه شروع کنیم؟</h3>
                      <ol className="list-decimal list-inside space-y-2 pr-4 text-gray-700 dark:text-gray-300">
                        <li>
                          ابتدا از منوی <strong className="text-blue-600 dark:text-blue-400">"یادآوری داروها"</strong> وارد صفحه مدیریت داروها شوید
                        </li>
                        <li>
                          با کلیک روی دکمه <strong className="text-blue-600 dark:text-blue-400">"افزودن داروی جدید"</strong> اولین داروی خود را ثبت کنید
                        </li>
                        <li>
                          پس از ثبت دارو، با کلیک روی <strong className="text-blue-600 dark:text-blue-400">"یادآوری جدید"</strong> زمان‌های مصرف دارو را تنظیم کنید
                        </li>
                        <li>
                          سیستم به صورت خودکار برای هر روز لاگ‌های یادآوری ایجاد می‌کند که می‌توانید وضعیت مصرف داروها را در آنها ثبت کنید
                        </li>
                      </ol>
                    </div>

                    <div className="flex justify-end mt-4">
                      <Button onClick={() => setActiveSection('medications')} className="bg-blue-500 hover:bg-blue-600">
                        ادامه: مدیریت داروها
                      </Button>
                    </div>
                  </div>
                )}

                {/* Medications section */}
                {isActive('medications') && (
                  <div className="space-y-6 animate-fadeIn">
                    <h2 className="text-2xl font-bold text-blue-700 dark:text-blue-300">مدیریت داروها</h2>
                    <p className="text-gray-700 dark:text-gray-300">
                      در این بخش می‌توانید داروهای خود را مدیریت کنید. افزودن، ویرایش و حذف داروها از طریق این صفحه انجام می‌شود.
                    </p>

                    <h3 className="text-xl font-bold text-blue-600 dark:text-blue-400 mt-6">افزودن داروی جدید</h3>
                    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                      <ol className="list-decimal list-inside space-y-4 pr-4 text-gray-700 dark:text-gray-300">
                        <li>
                          از صفحه اصلی یادآورها، روی دکمه <strong className="text-blue-600 dark:text-blue-400">"افزودن داروی جدید"</strong> کلیک کنید
                          <div className="mt-2 bg-gray-50 dark:bg-gray-900 p-3 rounded-md">
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              این دکمه در بالای صفحه یادآورها قرار دارد و با علامت + مشخص شده است.
                            </p>
                          </div>
                        </li>
                        <li>
                          در فرم افزودن دارو، اطلاعات زیر را وارد کنید:
                          <ul className="list-disc list-inside pr-8 mt-2 space-y-2">
                            <li><strong>نام دارو:</strong> نام کامل دارو را وارد کنید (اجباری)</li>
                            <li><strong>توضیحات:</strong> هر توضیح اضافی درباره دارو مانند کاربرد آن (اختیاری)</li>
                            <li><strong>دوز مصرفی:</strong> میزان دوز مصرفی دارو مانند "5 میلی‌گرم" (اختیاری)</li>
                          </ul>
                        </li>
                        <li>
                          پس از تکمیل اطلاعات، روی دکمه <strong className="text-blue-600 dark:text-blue-400">"ثبت دارو"</strong> کلیک کنید
                        </li>
                      </ol>
                    </div>

                    <h3 className="text-xl font-bold text-blue-600 dark:text-blue-400 mt-6">مشاهده و ویرایش دارو</h3>
                    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                      <ol className="list-decimal list-inside space-y-4 pr-4 text-gray-700 dark:text-gray-300">
                        <li>
                          در صفحه یادآورها، لیست تمام داروهای شما نمایش داده می‌شود
                        </li>
                        <li>
                          برای مشاهده جزئیات هر دارو، روی دکمه <strong className="text-blue-600 dark:text-blue-400">"مشاهده"</strong> کلیک کنید
                        </li>
                        <li>
                          در صفحه جزئیات دارو، می‌توانید:
                          <ul className="list-disc list-inside pr-8 mt-2 space-y-2">
                            <li>اطلاعات کامل دارو را ببینید</li>
                            <li>یادآورهای مرتبط با این دارو را مدیریت کنید</li>
                            <li>با کلیک روی دکمه "ویرایش دارو"، اطلاعات دارو را تغییر دهید</li>
                          </ul>
                        </li>
                      </ol>
                    </div>

                    <h3 className="text-xl font-bold text-blue-600 dark:text-blue-400 mt-6">حذف دارو</h3>
                    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                      <div className="flex items-start p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-100 dark:border-yellow-800 rounded-md mb-4">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-500 ml-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                        <p className="text-yellow-700 dark:text-yellow-300 text-sm">
                          <strong>توجه:</strong> با حذف دارو، تمام یادآورها و لاگ‌های مرتبط با آن نیز حذف می‌شوند. این عملیات غیرقابل بازگشت است.
                        </p>
                      </div>
                      <ol className="list-decimal list-inside space-y-4 pr-4 text-gray-700 dark:text-gray-300">
                        <li>
                          در صفحه یادآورها یا صفحه جزئیات دارو، روی دکمه <strong className="text-blue-600 dark:text-blue-400">"حذف"</strong> کلیک کنید
                        </li>
                        <li>
                          یک پیام تأیید نمایش داده می‌شود. در صورت اطمینان، گزینه "تأیید" را انتخاب کنید
                        </li>
                      </ol>
                    </div>

                    <div className="flex justify-between mt-4">
                      <Button onClick={() => setActiveSection('intro')} variant="outline">
                        قبلی: معرفی سیستم
                      </Button>
                      <Button onClick={() => setActiveSection('reminders')} className="bg-blue-500 hover:bg-blue-600">
                        ادامه: تنظیم یادآورها
                      </Button>
                    </div>
                  </div>
                )}

                {/* Reminders section */}
                {isActive('reminders') && (
                  <div className="space-y-6 animate-fadeIn">
                    <h2 className="text-2xl font-bold text-blue-700 dark:text-blue-300">تنظیم یادآورها</h2>
                    <p className="text-gray-700 dark:text-gray-300">
                      یادآورها به شما کمک می‌کنند تا زمان مصرف داروهای خود را فراموش نکنید. برای هر دارو، می‌توانید چندین یادآور با زمان‌بندی‌های مختلف تنظیم کنید.
                    </p>

                    <h3 className="text-xl font-bold text-blue-600 dark:text-blue-400 mt-6">افزودن یادآور جدید</h3>
                    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                      <ol className="list-decimal list-inside space-y-4 pr-4 text-gray-700 dark:text-gray-300">
                        <li>
                          از صفحه یادآورها، روی کارت دارو مورد نظر، دکمه <strong className="text-blue-600 dark:text-blue-400">"یادآوری جدید"</strong> را کلیک کنید
                          <div className="mt-2 bg-gray-50 dark:bg-gray-900 p-3 rounded-md">
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              همچنین می‌توانید از صفحه جزئیات دارو نیز یادآور جدید اضافه کنید.
                            </p>
                          </div>
                        </li>
                        <li>
                          در فرم ایجاد یادآور، اطلاعات زیر را تنظیم کنید:
                          <ul className="list-disc list-inside pr-8 mt-2 space-y-2">
                            <li><strong>تناوب مصرف:</strong> روزانه، هفتگی، یا موردی</li>
                            <li><strong>وضعیت:</strong> فعال یا غیرفعال</li>
                            <li><strong>تاریخ شروع:</strong> تاریخی که می‌خواهید یادآوری از آن شروع شود</li>
                            <li><strong>تاریخ پایان:</strong> تاریخی که می‌خواهید یادآوری در آن پایان یابد (اختیاری)</li>
                            <li><strong>روزهای هفته:</strong> در صورت انتخاب تناوب هفتگی، روزهای هفته را انتخاب کنید</li>
                            <li><strong>زمان‌های یادآوری:</strong> ساعت‌های مصرف دارو را تعیین کنید</li>
                          </ul>
                        </li>
                        <li>
                          می‌توانید چندین زمان یادآوری برای هر یادآور تنظیم کنید:
                          <div className="mt-2 bg-gray-50 dark:bg-gray-900 p-3 rounded-md">
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              برای مثال، اگر دارویی را باید صبح، ظهر و شب مصرف کنید، می‌توانید سه زمان متفاوت برای یک یادآور تنظیم کنید.
                            </p>
                          </div>
                        </li>
                        <li>
                          پس از تکمیل اطلاعات، روی دکمه <strong className="text-blue-600 dark:text-blue-400">"ثبت یادآور"</strong> کلیک کنید
                        </li>
                      </ol>
                    </div>

                    <h3 className="text-xl font-bold text-blue-600 dark:text-blue-400 mt-6">انواع تناوب یادآوری</h3>
                    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                      <div className="space-y-4">
                        <div className="p-3 border-r-4 border-blue-500 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-600">
                          <h4 className="font-bold text-blue-700 dark:text-blue-300">روزانه (Daily)</h4>
                          <p className="text-gray-700 dark:text-gray-300 mt-1">
                            یادآور هر روز در ساعت‌های تعیین شده فعال می‌شود. مناسب برای داروهایی که باید هر روز مصرف شوند.
                          </p>
                        </div>
                        
                        <div className="p-3 border-r-4 border-purple-500 bg-purple-50 dark:bg-purple-900/20 dark:border-purple-600">
                          <h4 className="font-bold text-purple-700 dark:text-purple-300">هفتگی (Weekly)</h4>
                          <p className="text-gray-700 dark:text-gray-300 mt-1">
                            یادآور فقط در روزهای مشخصی از هفته فعال می‌شود. می‌توانید یک یا چند روز هفته را انتخاب کنید.
                          </p>
                        </div>
                        
                        <div className="p-3 border-r-4 border-green-500 bg-green-50 dark:bg-green-900/20 dark:border-green-600">
                          <h4 className="font-bold text-green-700 dark:text-green-300">موردی (One-time)</h4>
                          <p className="text-gray-700 dark:text-gray-300 mt-1">
                            یادآور فقط یک بار در تاریخ و ساعت مشخص شده فعال می‌شود. مناسب برای داروهایی که باید در یک زمان خاص مصرف شوند.
                          </p>
                        </div>
                      </div>
                    </div>

                    <h3 className="text-xl font-bold text-blue-600 dark:text-blue-400 mt-6">ویرایش یادآور</h3>
                    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                      <ol className="list-decimal list-inside space-y-4 pr-4 text-gray-700 dark:text-gray-300">
                        <li>
                          از صفحه جزئیات دارو، به بخش یادآورها بروید
                        </li>
                        <li>
                          در کنار یادآور مورد نظر، روی دکمه <strong className="text-blue-600 dark:text-blue-400">"ویرایش"</strong> کلیک کنید
                        </li>
                        <li>
                          در فرم ویرایش، اطلاعات یادآور را به دلخواه تغییر دهید
                        </li>
                        <li>
                          برای غیرفعال کردن موقت یادآور، وضعیت آن را به "غیرفعال" تغییر دهید
                          <div className="mt-2 bg-gray-50 dark:bg-gray-900 p-3 rounded-md">
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              یادآورهای غیرفعال در سیستم باقی می‌مانند اما لاگ جدیدی برای آنها ایجاد نمی‌شود.
                            </p>
                          </div>
                        </li>
                        <li>
                          پس از اعمال تغییرات، روی دکمه <strong className="text-blue-600 dark:text-blue-400">"ذخیره تغییرات"</strong> کلیک کنید
                        </li>
                      </ol>
                    </div>

                    <h3 className="text-xl font-bold text-blue-600 dark:text-blue-400 mt-6">حذف یادآور</h3>
                    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                      <div className="flex items-start p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-100 dark:border-yellow-800 rounded-md mb-4">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-500 ml-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                        <p className="text-yellow-700 dark:text-yellow-300 text-sm">
                          <strong>توجه:</strong> با حذف یادآور، تمام لاگ‌های مرتبط با آن نیز حذف می‌شوند. این عملیات غیرقابل بازگشت است.
                        </p>
                      </div>
                      <ol className="list-decimal list-inside space-y-4 pr-4 text-gray-700 dark:text-gray-300">
                        <li>
                          از صفحه جزئیات دارو، به بخش یادآورها بروید
                        </li>
                        <li>
                          در کنار یادآور مورد نظر، روی دکمه <strong className="text-blue-600 dark:text-blue-400">"حذف"</strong> کلیک کنید
                        </li>
                        <li>
                          یک پیام تأیید نمایش داده می‌شود. در صورت اطمینان، گزینه "تأیید" را انتخاب کنید
                        </li>
                      </ol>
                    </div>

                    <div className="flex justify-between mt-4">
                      <Button onClick={() => setActiveSection('medications')} variant="outline">
                        قبلی: مدیریت داروها
                      </Button>
                      <Button onClick={() => setActiveSection('logs')} className="bg-blue-500 hover:bg-blue-600">
                        ادامه: مدیریت لاگ‌ها
                      </Button>
                    </div>
                  </div>
                )}

                {/* Logs section */}
                {isActive('logs') && (
                  <div className="space-y-6 animate-fadeIn">
                    <h2 className="text-2xl font-bold text-blue-700 dark:text-blue-300">مدیریت لاگ‌های دارو</h2>
                    <p className="text-gray-700 dark:text-gray-300">
                      لاگ‌های دارو، سوابق مصرف داروهای شما را نگهداری می‌کنند. سیستم به صورت خودکار برای هر یادآور فعال، لاگ‌های روزانه ایجاد می‌کند.
                      شما می‌توانید وضعیت مصرف داروها را در این لاگ‌ها ثبت کنید.
                    </p>

                    <h3 className="text-xl font-bold text-blue-600 dark:text-blue-400 mt-6">چرخه زندگی لاگ‌ها</h3>
                    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                      <div className="flex flex-col md:flex-row justify-between gap-4">
                        <div className="flex-1 p-3 border-r-4 border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20 dark:border-yellow-600">
                          <h4 className="font-bold text-yellow-700 dark:text-yellow-300">1. ایجاد خودکار</h4>
                          <p className="text-gray-700 dark:text-gray-300 mt-1">
                            سیستم هر روز به صورت خودکار برای تمام یادآورهای فعال، لاگ‌های جدید ایجاد می‌کند.
                          </p>
                        </div>
                        
                        <div className="flex-1 p-3 border-r-4 border-blue-500 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-600">
                          <h4 className="font-bold text-blue-700 dark:text-blue-300">2. در انتظار</h4>
                          <p className="text-gray-700 dark:text-gray-300 mt-1">
                            لاگ‌ها در وضعیت "در انتظار" قرار می‌گیرند تا زمان مصرف دارو فرا برسد.
                          </p>
                        </div>
                        
                        <div className="flex-1 p-3 border-r-4 border-green-500 bg-green-50 dark:bg-green-900/20 dark:border-green-600">
                          <h4 className="font-bold text-green-700 dark:text-green-300">3. ثبت وضعیت</h4>
                          <p className="text-gray-700 dark:text-gray-300 mt-1">
                            کاربر وضعیت مصرف دارو را به "مصرف شده" یا "مصرف نشده" تغییر می‌دهد.
                          </p>
                        </div>
                      </div>
                    </div>

                    <h3 className="text-xl font-bold text-blue-600 dark:text-blue-400 mt-6">مشاهده لاگ‌های دارو</h3>
                    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                      <ol className="list-decimal list-inside space-y-4 pr-4 text-gray-700 dark:text-gray-300">
                        <li>
                          از صفحه جزئیات دارو، روی یکی از یادآورها کلیک کنید
                        </li>
                        <li>
                          در صفحه جزئیات یادآور، بخش "لاگ‌های یادآوری" را پیدا کنید
                        </li>
                        <li>
                          در این بخش، لیست تمام لاگ‌های مربوط به این یادآور را مشاهده خواهید کرد
                        </li>
                        <li>
                          برای مشاهده جزئیات بیشتر، روی دکمه <strong className="text-blue-600 dark:text-blue-400">"مشاهده لاگ‌ها"</strong> کلیک کنید
                          <div className="mt-2 bg-gray-50 dark:bg-gray-900 p-3 rounded-md">
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              در صفحه لاگ‌ها، می‌توانید تاریخچه کامل مصرف دارو را مشاهده کنید.
                            </p>
                          </div>
                        </li>
                      </ol>
                    </div>

                    <h3 className="text-xl font-bold text-blue-600 dark:text-blue-400 mt-6">ثبت وضعیت مصرف دارو</h3>
                    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                      <ol className="list-decimal list-inside space-y-4 pr-4 text-gray-700 dark:text-gray-300">
                        <li>
                          از صفحه لاگ‌های یادآور، لاگ مورد نظر را پیدا کنید
                        </li>
                        <li>
                          در کنار لاگ، وضعیت فعلی آن را مشاهده می‌کنید:
                          <ul className="list-disc list-inside pr-8 mt-2 space-y-2">
                            <li><span className="px-2 py-1 rounded-full bg-yellow-100 text-yellow-800 text-xs">در انتظار</span> - هنوز وضعیت مصرف ثبت نشده است</li>
                            <li><span className="px-2 py-1 rounded-full bg-green-100 text-green-800 text-xs">مصرف شده</span> - دارو در زمان مقرر مصرف شده است</li>
                            <li><span className="px-2 py-1 rounded-full bg-red-100 text-red-800 text-xs">مصرف نشده</span> - دارو در زمان مقرر مصرف نشده است</li>
                          </ul>
                        </li>
                        <li>
                          برای تغییر وضعیت لاگ، روی دکمه <strong className="text-blue-600 dark:text-blue-400">"ثبت وضعیت"</strong> کلیک کنید
                        </li>
                        <li>
                          در پنجره باز شده، وضعیت جدید را انتخاب کنید:
                          <ul className="list-disc list-inside pr-8 mt-2 space-y-2">
                            <li><strong>مصرف شده:</strong> اگر دارو را مصرف کرده‌اید</li>
                            <li><strong>مصرف نشده:</strong> اگر دارو را مصرف نکرده‌اید</li>
                          </ul>
                        </li>
                        <li>
                          در صورت نیاز، می‌توانید یادداشتی نیز اضافه کنید (مثلاً علت عدم مصرف دارو)
                        </li>
                        <li>
                          روی دکمه <strong className="text-blue-600 dark:text-blue-400">"ثبت"</strong> کلیک کنید تا تغییرات ذخیره شود
                        </li>
                      </ol>
                    </div>

                    <h3 className="text-xl font-bold text-blue-600 dark:text-blue-400 mt-6">وضعیت‌های مختلف لاگ</h3>
                    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="p-4 rounded-lg bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800">
                          <div className="flex items-center mb-2">
                            <span className="w-3 h-3 rounded-full bg-yellow-500 ml-2"></span>
                            <h4 className="font-bold text-yellow-700 dark:text-yellow-300">در انتظار</h4>
                          </div>
                          <p className="text-gray-700 dark:text-gray-300 text-sm">
                            لاگ ایجاد شده اما هنوز وضعیت مصرف دارو ثبت نشده است.
                          </p>
                        </div>
                        
                        <div className="p-4 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
                          <div className="flex items-center mb-2">
                            <span className="w-3 h-3 rounded-full bg-green-500 ml-2"></span>
                            <h4 className="font-bold text-green-700 dark:text-green-300">مصرف شده</h4>
                          </div>
                          <p className="text-gray-700 dark:text-gray-300 text-sm">
                            دارو در زمان مقرر مصرف شده است.
                          </p>
                        </div>
                        
                        <div className="p-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
                          <div className="flex items-center mb-2">
                            <span className="w-3 h-3 rounded-full bg-red-500 ml-2"></span>
                            <h4 className="font-bold text-red-700 dark:text-red-300">مصرف نشده</h4>
                          </div>
                          <p className="text-gray-700 dark:text-gray-300 text-sm">
                            دارو در زمان مقرر مصرف نشده است.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-between mt-4">
                      <Button onClick={() => setActiveSection('reminders')} variant="outline">
                        قبلی: تنظیم یادآورها
                      </Button>
                      <Button onClick={() => setActiveSection('faq')} className="bg-blue-500 hover:bg-blue-600">
                        ادامه: سوالات متداول
                      </Button>
                    </div>
                  </div>
                )}

                {/* FAQ section */}
                {isActive('faq') && (
                  <div className="space-y-6 animate-fadeIn">
                    <h2 className="text-2xl font-bold text-blue-700 dark:text-blue-300">سوالات متداول</h2>
                    <p className="text-gray-700 dark:text-gray-300">
                      در این بخش، پاسخ سوالات رایج کاربران درباره سیستم یادآوری دارو را مشاهده می‌کنید.
                    </p>

                    <div className="space-y-6">
                      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                        <h3 className="text-lg font-bold text-blue-600 dark:text-blue-400 mb-2">چرا یادآورهای من ایجاد نمی‌شوند؟</h3>
                        <p className="text-gray-700 dark:text-gray-300">
                          اطمینان حاصل کنید که:
                        </p>
                        <ul className="list-disc list-inside pr-4 mt-2 space-y-2 text-gray-700 dark:text-gray-300">
                          <li>یادآور در وضعیت "فعال" قرار دارد</li>
                          <li>تاریخ شروع یادآور گذشته است و تاریخ پایان آن هنوز نرسیده است</li>
                          <li>برای یادآور حداقل یک زمان تعیین کرده‌اید</li>
                          <li>اگر تناوب هفتگی انتخاب کرده‌اید، حداقل یک روز هفته را انتخاب کرده‌اید</li>
                        </ul>
                      </div>

                      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                        <h3 className="text-lg font-bold text-blue-600 dark:text-blue-400 mb-2">آیا سیستم یادآوری دارو با نوتیفیکیشن‌های موبایل کار می‌کند؟</h3>
                        <p className="text-gray-700 dark:text-gray-300">
                          در حال حاضر، سیستم نوتیفیکیشن به صورت آزمایشی غیرفعال است و به زودی در آپدیت‌های بعدی اضافه خواهد شد. 
                          فعلاً می‌توانید با بررسی منظم لاگ‌ها، وضعیت مصرف داروهای خود را پیگیری کنید.
                        </p>
                      </div>

                      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                        <h3 className="text-lg font-bold text-blue-600 dark:text-blue-400 mb-2">چگونه می‌توانم چندین دارو را در یک زمان مشخص مصرف کنم؟</h3>
                        <p className="text-gray-700 dark:text-gray-300">
                          برای هر دارو باید یادآور جداگانه تنظیم کنید، اما می‌توانید زمان یکسانی را برای همه آنها تعیین کنید. 
                          سیستم برای هر دارو در آن زمان، لاگ جداگانه ایجاد می‌کند.
                        </p>
                      </div>

                      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                        <h3 className="text-lg font-bold text-blue-600 dark:text-blue-400 mb-2">آیا می‌توانم برای یک دارو چندین یادآور با تناوب‌های مختلف تنظیم کنم؟</h3>
                        <p className="text-gray-700 dark:text-gray-300">
                          بله، می‌توانید برای یک دارو چندین یادآور با تناوب‌های مختلف تنظیم کنید. 
                          برای مثال، می‌توانید یک یادآور روزانه برای مصرف صبح و یک یادآور هفتگی برای دوز اضافی در روزهای خاص تنظیم کنید.
                        </p>
                      </div>

                      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                        <h3 className="text-lg font-bold text-blue-600 dark:text-blue-400 mb-2">اگر یک روز فراموش کنم وضعیت مصرف دارو را ثبت کنم، چه اتفاقی می‌افتد؟</h3>
                        <p className="text-gray-700 dark:text-gray-300">
                          نگران نباشید! لاگ‌ها همیشه در سیستم باقی می‌مانند و هر زمان که بخواهید می‌توانید به آنها دسترسی داشته باشید و وضعیت مصرف دارو را ثبت کنید. 
                          سیستم محدودیتی برای زمان ثبت وضعیت ایجاد نمی‌کند.
                        </p>
                      </div>

                      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                        <h3 className="text-lg font-bold text-blue-600 dark:text-blue-400 mb-2">آیا می‌توانم گزارشی از وضعیت مصرف داروهایم دریافت کنم؟</h3>
                        <p className="text-gray-700 dark:text-gray-300">
                          در حال حاضر می‌توانید با مراجعه به صفحه لاگ‌های هر یادآور، تاریخچه مصرف دارو را مشاهده کنید. 
                          قابلیت دریافت گزارش‌های تحلیلی و آماری در آپدیت‌های آینده اضافه خواهد شد.
                        </p>
                      </div>

                      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                        <h3 className="text-lg font-bold text-blue-600 dark:text-blue-400 mb-2">آیا می‌توانم یادآورهای دارو را با دیگران به اشتراک بگذارم؟</h3>
                        <p className="text-gray-700 dark:text-gray-300">
                          در حال حاضر، هر کاربر فقط به یادآورهای دارویی خود دسترسی دارد. 
                          قابلیت به اشتراک‌گذاری یادآورها با اعضای خانواده یا مراقبان سلامت در آپدیت‌های آینده اضافه خواهد شد.
                        </p>
                      </div>
                    </div>

                    <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border-r-4 border-blue-500 dark:border-blue-600 rounded-md mt-6">
                      <h3 className="text-lg font-bold text-blue-700 dark:text-blue-300 mb-2">سوال دیگری دارید؟</h3>
                      <p className="text-gray-700 dark:text-gray-300">
                        اگر پاسخ سوال خود را در این بخش پیدا نکرده‌اید، می‌توانید از طریق بخش پشتیبانی با ما تماس بگیرید.
                        تیم پشتیبانی ما آماده پاسخگویی به سوالات شما است.
                      </p>
                    </div>

                    <div className="flex justify-between mt-4">
                      <Button onClick={() => setActiveSection('logs')} variant="outline">
                        قبلی: مدیریت لاگ‌ها
                      </Button>
                      <Button onClick={() => setActiveSection('intro')} className="bg-blue-500 hover:bg-blue-600">
                        بازگشت به ابتدا
                      </Button>
                    </div>
                  </div>
                )}
              </Card>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
} 