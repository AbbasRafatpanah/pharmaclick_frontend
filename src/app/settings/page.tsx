'use client';

import React from 'react';
import { Container } from '@/components/ui/container';
import { NotificationSettings } from '@/components/ui/notification-settings';
import { Toaster } from 'react-hot-toast';

export default function SettingsPage() {
  return (
    <>
      <Container>
        <div className="py-8">
          <h1 className="text-3xl font-bold mb-6">تنظیمات</h1>
          
          <div className="space-y-6">
            <NotificationSettings />
            
            {/* در آینده، بخش‌های دیگر تنظیمات می‌تواند اینجا اضافه شود */}
          </div>
        </div>
      </Container>
      <Toaster position="bottom-center" />
    </>
  );
} 