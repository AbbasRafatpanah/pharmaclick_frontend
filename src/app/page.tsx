"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { MedicineBottle, Pills, Syringe, HeartPulse, FloatingParticles } from "@/components/BackgroundElements";
import Link from "next/link";
import { ArrowRight, MessageSquare, Bell, Shield, Zap } from "lucide-react";
import Head from "next/head";
import Script from "next/script";
import { 
  generateOrganizationSchema,
  generateFAQSchema,
  generateMedicalWebPageSchema 
} from "@/lib/seo-helper";

export default function Home() {
  // Generate JSON-LD structured data
  const organizationSchema = generateOrganizationSchema();
  const faqSchema = generateFAQSchema();
  const medicalWebPageSchema = generateMedicalWebPageSchema(
    "فارماکلیک | سیستم مشاور دارویی و پزشکی هوشمند",
    "با فارماکلیک، پاسخ سوالات پزشکی و اطلاعات دارویی دریافت کنید و برای مصرف به موقع داروهای خود یادآور تنظیم کنید"
  );

  return (
    <>
      {/* JSON-LD Structured Data */}
      <Script
        id="jsonld-organization"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(organizationSchema)
        }}
      />
      
      <Script
        id="jsonld-faq"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqSchema)
        }}
      />
      
      <Script
        id="jsonld-medical-service"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(medicalWebPageSchema)
        }}
      />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800 pt-12 pb-20 md:pt-20 md:pb-28">
        <FloatingParticles count={20} />
        <div className="absolute inset-0 bg-grid-pattern opacity-[0.03] pointer-events-none"></div>
        
      {/* Background Elements */}
        <MedicineBottle className="top-32 left-[10%] text-blue-500/20 animate-float hidden lg:block" size={100} />
        <Pills className="bottom-32 right-[10%] text-blue-500/20 animate-float hidden lg:block" size={100} />
        <Syringe className="top-[40%] right-[15%] text-blue-500/20 animate-float hidden lg:block" size={80} />
        <HeartPulse className="bottom-[40%] left-[15%] text-blue-500/20 animate-float hidden lg:block" size={80} />
        
        <Container>
          <div className="flex flex-col lg:flex-row gap-12 items-center">
            <div className="flex-1 text-center lg:text-right">
              <div className="inline-block px-3 py-1 mb-6 text-sm font-medium rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300">
                سیستم مشاور دارویی و پزشکی هوشمند
              </div>
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
                فارماکلیک
              </h1>
              <p className="mt-4 text-xl text-gray-600 dark:text-gray-400 max-w-2xl">
                با <span className="font-semibold text-blue-600 dark:text-blue-400">فارماکلیک</span>، پاسخ سوالات پزشکی و اطلاعات دارویی دریافت کنید و برای مصرف به موقع داروهای خود یادآور تنظیم کنید.
              </p>
              <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
                <Link href="/chatbot">
                  <Button variant="gradient" size="lg" className="gap-2">
                    شروع گفتگو با ربات پزشکی
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/reminder">
                  <Button variant="outline" size="lg" className="gap-2">
                    تنظیم یادآور دارو
                    <Bell className="h-4 w-4" />
                  </Button>
              </Link>
              </div>
            </div>
            
            <div className="flex-1 relative">
              <div className="relative w-full h-[400px] rounded-2xl bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 p-1">
                <div className="absolute inset-0 rounded-2xl overflow-hidden">
                  <div className="absolute inset-0 bg-grid-pattern opacity-[0.07] pointer-events-none"></div>
                </div>
                <div className="relative h-full w-full rounded-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-6 flex flex-col">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2 space-x-reverse">
                      <div className="w-3 h-3 rounded-full bg-red-500"></div>
                      <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                      <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">چت‌بات دارویی</div>
                  </div>
                  
                  <div className="flex-1 overflow-y-auto scrollbar-thin">
                    <div className="space-y-4">
                      <div className="flex justify-start">
                        <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-3 max-w-[80%]">
                          <p className="text-sm">سلام، من می‌خواهم درباره داروی آموکسی‌سیلین اطلاعاتی کسب کنم.</p>
                        </div>
                      </div>
                      <div className="flex justify-end">
                        <div className="bg-blue-600 text-white rounded-lg p-3 max-w-[80%]">
                          <p className="text-sm">سلام، آموکسی‌سیلین یک آنتی‌بیوتیک از خانواده پنی‌سیلین‌هاست که برای درمان عفونت‌های باکتریایی استفاده می‌شود.</p>
                        </div>
                      </div>
                      <div className="flex justify-start">
                        <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-3 max-w-[80%]">
                          <p className="text-sm">چه عوارض جانبی دارد؟</p>
                        </div>
                      </div>
                      <div className="flex justify-end">
                        <div className="bg-blue-600 text-white rounded-lg p-3 max-w-[80%]">
                          <p className="text-sm">عوارض جانبی شایع آموکسی‌سیلین شامل:</p>
                          <ul className="list-disc mr-5 mt-1 text-sm">
                            <li>اسهال</li>
                            <li>تهوع</li>
                            <li>راش پوستی</li>
                          </ul>
                          <p className="text-sm mt-1">در صورت بروز واکنش آلرژیک شدید، فوراً با پزشک تماس بگیرید.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-4 flex gap-2">
                    <input
                      type="text"
                      placeholder="پیام خود را بنویسید..."
                      className="flex-1 rounded-lg border border-gray-300 dark:border-gray-600 bg-transparent px-3 py-2 text-sm"
                    />
                    <Button variant="gradient" size="icon" className="rounded-lg">
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white dark:bg-gray-900">
        <Container>
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">امکانات فارماکلیک</h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-12">
              با استفاده از امکانات هوشمند فارماکلیک، مدیریت داروها و دریافت اطلاعات دارویی آسان‌تر از همیشه است.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card variant="glass" animation="hover">
              <CardHeader>
                <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center text-blue-600 dark:text-blue-400 mb-4">
                  <MessageSquare className="h-6 w-6" />
                </div>
                <CardTitle>چت‌بات دارویی هوشمند</CardTitle>
                <CardDescription>
                  با هوش مصنوعی گفتگو کنید و اطلاعات دارویی دقیق دریافت کنید
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2">
                    <svg className="h-4 w-4 text-green-500" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M7.75 12.75L10 15.25L16.25 8.75" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
                    </svg>
                    <span className="text-sm">اطلاعات جامع درباره داروها</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <svg className="h-4 w-4 text-green-500" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M7.75 12.75L10 15.25L16.25 8.75" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
                    </svg>
                    <span className="text-sm">پشتیبانی از آپلود تصویر داروها</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <svg className="h-4 w-4 text-green-500" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M7.75 12.75L10 15.25L16.25 8.75" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
                    </svg>
                    <span className="text-sm">تشخیص تداخلات دارویی</span>
                  </li>
                </ul>
              </CardContent>
              <CardFooter>
                <Link href="/chatbot" className="w-full">
                  <Button variant="default" className="w-full">
                    شروع گفتگو
                  </Button>
                </Link>
              </CardFooter>
            </Card>
            
            <Card variant="glass" animation="hover">
              <CardHeader>
                <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900/50 flex items-center justify-center text-green-600 dark:text-green-400 mb-4">
                  <Bell className="h-6 w-6" />
                </div>
                <CardTitle>یادآور مصرف دارو</CardTitle>
                <CardDescription>
                  برای مصرف به موقع داروهای خود یادآور تنظیم کنید
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2">
                    <svg className="h-4 w-4 text-green-500" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M7.75 12.75L10 15.25L16.25 8.75" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
                    </svg>
                    <span className="text-sm">یادآوری زمان مصرف داروها</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <svg className="h-4 w-4 text-green-500" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M7.75 12.75L10 15.25L16.25 8.75" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
                    </svg>
                    <span className="text-sm">تنظیم برنامه منظم دارویی</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <svg className="h-4 w-4 text-green-500" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M7.75 12.75L10 15.25L16.25 8.75" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
                </svg>
                    <span className="text-sm">مدیریت داروهای مختلف</span>
                  </li>
                </ul>
              </CardContent>
              <CardFooter>
                <Link href="/reminder" className="w-full">
                  <Button variant="default" className="w-full">
                    تنظیم یادآور
                  </Button>
              </Link>
              </CardFooter>
            </Card>
            
            <Card variant="glass" animation="hover">
              <CardHeader>
                <div className="w-12 h-12 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center text-indigo-600 dark:text-indigo-400 mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
                    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
                  </svg>
                </div>
                <CardTitle>راهنمای جامع استفاده</CardTitle>
                <CardDescription>
                  آموزش کامل نحوه استفاده از تمام امکانات سیستم
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2">
                    <svg className="h-4 w-4 text-green-500" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M7.75 12.75L10 15.25L16.25 8.75" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
                    </svg>
                    <span className="text-sm">آموزش مدیریت داروها</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <svg className="h-4 w-4 text-green-500" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M7.75 12.75L10 15.25L16.25 8.75" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
                    </svg>
                    <span className="text-sm">راهنمای تنظیم یادآورها</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <svg className="h-4 w-4 text-green-500" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M7.75 12.75L10 15.25L16.25 8.75" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
                    </svg>
                    <span className="text-sm">سوالات متداول کاربران</span>
                  </li>
                </ul>
              </CardContent>
              <CardFooter>
                <Link href="/guide" className="w-full">
                  <Button variant="default" className="w-full">
                    مشاهده راهنما
                  </Button>
              </Link>
              </CardFooter>
            </Card>
            
            <Card variant="glass" animation="hover" className="md:col-span-2 lg:col-span-1">
              <CardHeader>
                <div className="w-12 h-12 rounded-full bg-purple-100 dark:bg-purple-900/50 flex items-center justify-center text-purple-600 dark:text-purple-400 mb-4">
                  <Shield className="h-6 w-6" />
            </div>
                <CardTitle>امنیت و حریم خصوصی</CardTitle>
                <CardDescription>
                  اطلاعات شما با بالاترین استانداردهای امنیتی محافظت می‌شود
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2">
                    <svg className="h-4 w-4 text-green-500" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M7.75 12.75L10 15.25L16.25 8.75" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
                    </svg>
                    <span className="text-sm">رمزنگاری پیشرفته اطلاعات</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <svg className="h-4 w-4 text-green-500" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M7.75 12.75L10 15.25L16.25 8.75" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
                    </svg>
                    <span className="text-sm">حفظ حریم خصوصی کاربران</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <svg className="h-4 w-4 text-green-500" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M7.75 12.75L10 15.25L16.25 8.75" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
                    </svg>
                    <span className="text-sm">دسترسی ایمن به اطلاعات</span>
                  </li>
                </ul>
              </CardContent>
              <CardFooter>
                <Link href="/auth/register" className="w-full">
                  <Button variant="default" className="w-full">
                    ثبت نام رایگان
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          </div>
        </Container>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-gray-50 dark:bg-gray-800">
        <Container>
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">نحوه کار فارماکلیک</h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-12">
              استفاده از فارماکلیک بسیار ساده است. در سه مرحله ساده می‌توانید از امکانات آن بهره‌مند شوید.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="relative">
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-lg">1</div>
              <Card variant="premium" className="pt-8 text-center h-full">
                <CardContent>
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center text-blue-600 dark:text-blue-400">
                    <svg className="h-8 w-8" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2" />
                      <path d="M16 2V6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                      <path d="M8 2V6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                      <path d="M3 10H21" stroke="currentColor" strokeWidth="2" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">ثبت نام کنید</h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    در چند ثانیه یک حساب کاربری ایجاد کنید و به تمام امکانات دسترسی داشته باشید.
                  </p>
                </CardContent>
              </Card>
            </div>
            
            <div className="relative">
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-lg">2</div>
              <Card variant="premium" className="pt-8 text-center h-full">
                <CardContent>
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center text-blue-600 dark:text-blue-400">
                    <MessageSquare className="h-8 w-8" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">سؤال بپرسید</h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    سؤالات خود درباره داروها را از چت‌بات هوشمند بپرسید یا تصویر دارو را آپلود کنید.
                  </p>
                </CardContent>
              </Card>
            </div>
            
            <div className="relative">
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-lg">3</div>
              <Card variant="premium" className="pt-8 text-center h-full">
                <CardContent>
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center text-blue-600 dark:text-blue-400">
                    <Bell className="h-8 w-8" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">یادآور تنظیم کنید</h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    برای داروهای خود یادآور تنظیم کنید تا هرگز زمان مصرف آن‌ها را فراموش نکنید.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </Container>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-br from-blue-600 to-indigo-700 text-white">
        <Container>
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="md:w-2/3">
              <h2 className="text-3xl font-bold mb-4">همین امروز شروع کنید</h2>
              <p className="text-blue-100 mb-6">
                  با فارماکلیک، مدیریت داروها و دریافت اطلاعات دارویی آسان‌تر از همیشه است. همین حالا ثبت نام کنید و از امکانات آن بهره‌مند شوید.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link href="/auth/register">
                  <Button variant="default" size="lg" className="bg-white text-blue-600 hover:bg-blue-50">
                    ثبت نام رایگان
                  </Button>
                </Link>
                <Link href="/chatbot">
                  <Button variant="outline" size="lg" className="border-white text-white hover:bg-white/10">
                    امتحان چت‌بات
                  </Button>
                </Link>
              </div>
            </div>
            <div className="md:w-1/3 flex justify-center">
              <div className="w-32 h-32 rounded-full bg-white/10 flex items-center justify-center">
                <Zap className="h-16 w-16" />
          </div>
        </div>
      </div>
        </Container>
      </section>
    </>
  );
} 