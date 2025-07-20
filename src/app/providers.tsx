"use client";

import { ThemeProvider } from "next-themes";
import { Toaster } from "sonner";
import { ServiceWorkerRegistration } from "@/components/ServiceWorkerRegistration";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <ServiceWorkerRegistration />
      <Toaster position="top-center" richColors dir="rtl" />
      {children}
    </ThemeProvider>
  );
} 