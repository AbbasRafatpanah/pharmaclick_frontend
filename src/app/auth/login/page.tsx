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
  Syringe,
  MedicineBottle
} from "@/components/BackgroundElements";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { ArrowLeft, Lock, Phone } from "lucide-react";
import { authEvent } from "@/components/layout/header";
import { API_ENDPOINTS } from "@/lib/api-config";

export default function LoginPage() {
  const [formData, setFormData] = useState({
    phone_number: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // بررسی وجود توکن معتبر
    const token = localStorage.getItem("access_token");
    if (token) {
      // ریدایرکت به صفحه اصلی اگر توکن وجود داشت
      router.push("/");
    }
  }, [router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await axios.post(API_ENDPOINTS.AUTH.LOGIN, {
        phone_number: formData.phone_number,
        password: formData.password,
      });

      // ذخیره توکن در localStorage
      localStorage.setItem("access_token", response.data.access);
      localStorage.setItem("refresh_token", response.data.refresh);
      
      // اطلاع‌رسانی به سایر کامپوننت‌ها
      authEvent.login();
      
      toast.success("ورود با موفقیت انجام شد");
      
      // ریدایرکت به صفحه اصلی
      router.push("/");
    } catch (error: any) {
      console.error("Login error:", error);
      
      if (error.response?.data) {
        const errors = error.response.data;
        console.log("Backend errors:", errors); // For debugging

        if (errors.non_field_errors) {
          toast.error(errors.non_field_errors[0]);
        } else if (errors.detail) {
          toast.error(errors.detail);
        } else {
          Object.keys(errors).forEach(key => {
              const fieldErrors = errors[key];
              if (Array.isArray(fieldErrors) && fieldErrors.length > 0) {
                  let fieldName = key;
                  if (key === 'phone_number') fieldName = 'شماره تلفن';
                  else if (key === 'password') fieldName = 'رمز عبور';
                  
                  toast.error(`${fieldName}: ${fieldErrors[0]}`);
              }
          });
        }
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
      <FloatingParticles count={15} />
      <GradientBlob className="top-20 right-20 w-96 h-96 opacity-10" color="blue" />
      <GradientBlob className="bottom-20 left-20 w-96 h-96 opacity-10" color="purple" />
      
      <Syringe className="top-32 right-[15%] text-blue-500/20 animate-float hidden lg:block" size={80} />
      <MedicineBottle className="bottom-32 left-[15%] text-blue-500/20 animate-float hidden lg:block" size={80} />
      <Pills className="top-[60%] right-[30%] text-blue-500/20 animate-float hidden lg:block" size={60} />

      <Container size="sm" padding="none" className="relative z-10">
        <Card variant="glass" animation="subtle" className="backdrop-blur-md border-white/20 dark:border-gray-700/30">
          <CardHeader className="space-y-1 text-center">
            <div className="mx-auto w-16 h-16 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center mb-2">
              <Lock className="h-8 w-8 text-white" />
            </div>
            <CardTitle className="text-2xl font-bold">ورود به حساب کاربری</CardTitle>
            <CardDescription>
              برای استفاده از امکانات داروخانه یار وارد حساب کاربری خود شوید
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <div className="relative">
                  <Phone className="absolute right-3 top-2.5 h-5 w-5 text-muted-foreground" />
                  <Input
                    id="phone_number"
                    name="phone_number"
                    type="text"
                    placeholder="شماره تلفن خود را وارد کنید"
                    required
                    value={formData.phone_number}
                    onChange={handleChange}
                    variant="modern"
                    className="pr-10"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <div className="relative">
                  <Lock className="absolute right-3 top-2.5 h-5 w-5 text-muted-foreground" />
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="رمز عبور خود را وارد کنید"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    variant="modern"
                    className="pr-10"
                  />
                </div>
              </div>
              <Button 
                type="submit" 
                variant="gradient" 
                className="w-full" 
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <svg className="animate-spin h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>در حال ورود...</span>
                  </div>
                ) : (
                  <span>ورود به حساب کاربری</span>
                )}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <div className="text-center text-sm">
              <span className="text-muted-foreground">حساب کاربری ندارید؟</span>{" "}
              <Link href="/auth/register" className="text-primary hover:underline">
                ثبت نام کنید
              </Link>
            </div>
            <Link href="/" className="w-full">
              <Button variant="outline" className="w-full flex items-center justify-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                <span>بازگشت به صفحه اصلی</span>
              </Button>
            </Link>
          </CardFooter>
        </Card>
      </Container>
    </div>
  );
} 