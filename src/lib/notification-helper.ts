/**
 * توابع کمکی برای مدیریت نوتیفیکیشن‌ها
 */

/**
 * بررسی وضعیت دسترسی به نوتیفیکیشن‌ها
 */
export const checkNotificationPermission = (): { 
  isSupported: boolean; 
  permission: NotificationPermission | null;
} => {
  const isSupported = 'Notification' in window;
  
  if (!isSupported) {
    return { isSupported: false, permission: null };
  }
  
  return { 
    isSupported: true, 
    permission: Notification.permission 
  };
};

/**
 * درخواست دسترسی به نوتیفیکیشن‌ها با نمایش راهنما
 */
export const requestNotificationWithGuide = async (): Promise<NotificationPermission | null> => {
  const { isSupported } = checkNotificationPermission();
  
  if (!isSupported) {
    console.log('Notifications are not supported in this browser');
    return null;
  }
  
  // اگر قبلاً دسترسی رد شده باشد، راهنمایی برای تغییر تنظیمات مرورگر نمایش دهید
  if (Notification.permission === 'denied') {
    console.log('Notification permission was denied before');
    return 'denied';
  }
  
  try {
    // نمایش درخواست دسترسی
    const permission = await Notification.requestPermission();
    return permission;
  } catch (error) {
    console.error('Error requesting notification permission:', error);
    return null;
  }
};

/**
 * نمایش نوتیفیکیشن آزمایشی در مرورگر
 */
export const showTestNotification = () => {
  const { isSupported, permission } = checkNotificationPermission();
  
  if (!isSupported) {
    console.log('Notifications are not supported in this browser');
    return false;
  }
  
  if (permission !== 'granted') {
    console.log('Notification permission not granted');
    return false;
  }
  
  try {
    const notification = new Notification('نوتیفیکیشن آزمایشی', {
      body: 'این یک نوتیفیکیشن آزمایشی است',
      icon: '/static/images/notification-icon.svg',
      badge: '/static/images/notification-badge.svg'
    });
    
    notification.onclick = () => {
      console.log('Notification clicked');
      notification.close();
      window.focus();
    };
    
    return true;
  } catch (error) {
    console.error('Error showing test notification:', error);
    return false;
  }
}; 