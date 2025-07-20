"use client";

import React from "react";
import { Header } from "./header";
import { Footer } from "./footer";
import { cn } from "@/lib/utils";

interface LayoutWrapperProps {
  children: React.ReactNode;
  className?: string;
  showHeader?: boolean;
  showFooter?: boolean;
  fullHeight?: boolean;
}

export function LayoutWrapper({
  children,
  className,
  showHeader = true,
  showFooter = true,
  fullHeight = false,
}: LayoutWrapperProps) {
  return (
    <div className="flex flex-col min-h-screen">
      {showHeader && <Header />}
      <main
        className={cn(
          "flex-1",
          fullHeight ? "flex flex-col" : "",
          className
        )}
      >
        {children}
      </main>
      {showFooter && <Footer />}
    </div>
  );
} 