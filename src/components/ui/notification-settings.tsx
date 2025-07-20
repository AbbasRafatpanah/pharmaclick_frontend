'use client';

import React from 'react';
import { Card } from './card';

export const NotificationSettings: React.FC = () => {
  return (
    <Card className="p-6 mb-6">
      <h2 className="text-xl font-bold mb-4">تنظیمات نوتیفیکیشن</h2>
      
      <div className="p-4 bg-blue-50 border-l-4 border-blue-400 rounded-md">
        <h3 className="font-bold text-blue-800 mb-2">سیستم نوتیفیکیشن به زودی</h3>
        <p className="text-blue-700 mb-3">
          سیستم نوتیفیکیشن و یادآوری دارو به زودی فعال خواهد شد. تیم ما در حال تکمیل این قابلیت است.
        </p>
        <p className="text-blue-700 mb-3">
          در حال حاضر، لطفاً برای پیگیری مصرف داروها از لاگ‌های یادآور استفاده کنید.
        </p>
        <p className="text-blue-700">
          از صبر و شکیبایی شما سپاسگزاریم.
        </p>
      </div>
    </Card>
  );
}; 