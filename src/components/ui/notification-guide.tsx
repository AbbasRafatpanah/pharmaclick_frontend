'use client';

import React from 'react';
import { Card } from './card';

interface NotificationGuideProps {
  onRequestPermission?: () => void;
  loading?: boolean;
}

export const NotificationGuide: React.FC<NotificationGuideProps> = () => {
  return (
    <Card className="p-4 mb-4 bg-blue-50 border-l-4 border-blue-400">
      <h3 className="font-bold text-blue-800 mb-2">سیستم نوتیفیکیشن به زودی</h3>
      <p className="text-blue-700">
        سیستم نوتیفیکیشن و یادآوری دارو به زودی فعال خواهد شد. در حال حاضر، لطفاً برای پیگیری مصرف داروها از لاگ‌های یادآور استفاده کنید.
      </p>
    </Card>
  );
}; 