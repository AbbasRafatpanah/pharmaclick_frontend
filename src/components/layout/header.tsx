"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { 
  MoonIcon, 
  SunIcon, 
  Menu, 
  X, 
  User, 
  LogOut, 
  Settings, 
  Home, 
  MessageSquare, 
  Bell, 
  HelpCircle 
} from "lucide-react";
import { useTheme } from "next-themes";

const navigation = [
  { name: "خانه", href: "/", icon: Home },
  { name: "چت‌بات دارویی", href: "/chatbot", icon: MessageSquare },
  { name: "یادآور دارو", href: "/reminder", icon: Bell },
  { name: "راهنمای استفاده", href: "/guide", icon: HelpCircle },
];

// ایجاد یک custom event برای اطلاع‌رسانی تغییر وضعیت احراز هویت
export const authEvent = {
  login: () => {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('auth-changed'));
    }
  },
  logout: () => {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('auth-changed'));
    }
  }
};

export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);
  
  // تابع بررسی وضعیت احراز هویت
  const checkAuthStatus = React.useCallback(() => {
    const token = localStorage.getItem("access_token");
    setIsLoggedIn(!!token);
  }, []);
  
  // بررسی وضعیت احراز هویت هنگام لود کامپوننت
  React.useEffect(() => {
    checkAuthStatus();
    
    // اضافه کردن event listener برای تغییرات احراز هویت
    window.addEventListener('auth-changed', checkAuthStatus);
    
    // اضافه کردن event listener برای تغییرات localStorage
    window.addEventListener('storage', (event) => {
      if (event.key === 'access_token') {
        checkAuthStatus();
      }
    });
    
    // پاکسازی event listener ها
    return () => {
      window.removeEventListener('auth-changed', checkAuthStatus);
      window.removeEventListener('storage', checkAuthStatus);
    };
  }, [checkAuthStatus]);
  
  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    setIsLoggedIn(false);
    router.push("/");
    setMobileMenuOpen(false);
    authEvent.logout(); // اطلاع‌رسانی به سایر کامپوننت‌ها
  };
  
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <Container className="flex h-16 items-center" padding="none">
        <div className="flex flex-1 items-center justify-between">
          <Link href="/" className="flex items-center space-x-2 space-x-reverse">
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 text-white font-bold text-xl">ف</div>
            <span className="font-bold text-xl hidden md:inline-block bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">فارماکلیک</span>
          </Link>
          
          <div className="hidden md:flex md:gap-x-2">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
              <Link
                key={item.name}
                href={item.href}
                >
                  <Button
                    variant={pathname === item.href ? "default" : "ghost"}
                    size="sm"
                className={cn(
                      "transition-all duration-200 rounded-full px-4 py-2 flex items-center gap-1.5",
                      pathname === item.href ? "bg-blue-600 text-white hover:bg-blue-700" : "hover:bg-blue-100/50 dark:hover:bg-blue-900/20"
                    )}
                  >
                    <Icon className={cn(
                      "h-4 w-4",
                      pathname === item.href ? "text-blue-100" : "text-blue-600 dark:text-blue-400"
                    )} />
                    <span>{item.name}</span>
                  </Button>
              </Link>
              );
            })}
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              aria-label="Toggle Theme"
              className="rounded-full"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            >
              <SunIcon className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <MoonIcon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <span className="sr-only">تغییر تم</span>
            </Button>
            
            <div className="flex md:hidden">
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                <span className="sr-only">باز کردن منو</span>
                {mobileMenuOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </Button>
            </div>
            
            <div className="hidden md:flex md:items-center md:gap-2">
              {isLoggedIn ? (
                <>
                  <Link href="/settings">
                    <Button variant="ghost" size="icon" className="rounded-full hover:bg-gray-100 dark:hover:bg-gray-800">
                      <Settings className="h-5 w-5" />
                      <span className="sr-only">تنظیمات</span>
                    </Button>
                  </Link>
                  <Link href="/profile">
                    <Button variant="outline" size="sm" className="flex items-center gap-1 rounded-full hover:bg-blue-50 dark:hover:bg-blue-900/20">
                      <User className="h-4 w-4" />
                      <span>پروفایل</span>
                    </Button>
                  </Link>
                  <Button variant="ghost" size="sm" onClick={handleLogout} className="flex items-center gap-1 text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/10 rounded-full">
                    <LogOut className="h-4 w-4" />
                    <span>خروج</span>
                  </Button>
                </>
              ) : (
                <>
                  <Link href="/auth/login">
                    <Button variant="outline" size="sm" className="rounded-full">ورود</Button>
                  </Link>
                  <Link href="/auth/register">
                    <Button variant="gradient" size="sm" className="rounded-full">ثبت نام</Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </Container>
      
      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden">
          <div className="space-y-1 px-4 py-3 border-t border-border/40">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  pathname === item.href
                    ? "bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400"
                    : "text-gray-700 hover:bg-gray-50 hover:text-blue-600 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-blue-400",
                    "flex items-center gap-2 rounded-md px-3 py-2 text-base font-medium transition-colors"
                )}
                onClick={() => setMobileMenuOpen(false)}
              >
                  <Icon className="h-5 w-5" />
                  <span>{item.name}</span>
              </Link>
              );
            })}
            {isLoggedIn && (
              <Link
                href="/settings"
                className={cn(
                  pathname === "/settings"
                    ? "bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400"
                    : "text-gray-700 hover:bg-gray-50 hover:text-blue-600 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-blue-400",
                  "flex items-center gap-2 rounded-md px-3 py-2 text-base font-medium transition-colors"
                )}
                onClick={() => setMobileMenuOpen(false)}
              >
                <Settings className="h-5 w-5" />
                تنظیمات
              </Link>
            )}
            <div className="flex items-center gap-2 pt-2 border-t border-border/40 mt-2">
              {isLoggedIn ? (
                <>
                  <Link href="/profile" className="flex-1" onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="outline" className="w-full flex items-center justify-center gap-1 rounded-full">
                      <User className="h-4 w-4" />
                      <span>پروفایل</span>
                    </Button>
                  </Link>
                  <Button variant="ghost" className="flex-1 flex items-center justify-center gap-1 text-red-600 dark:text-red-400" onClick={handleLogout}>
                    <LogOut className="h-4 w-4" />
                    <span>خروج</span>
                  </Button>
                </>
              ) : (
                <>
                  <Link href="/auth/login" className="flex-1" onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="outline" className="w-full rounded-full">ورود</Button>
                  </Link>
                  <Link href="/auth/register" className="flex-1" onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="gradient" className="w-full rounded-full">ثبت نام</Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
} 