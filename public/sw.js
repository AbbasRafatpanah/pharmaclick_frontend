/**
 * سرویس ورکر برای مدیریت نوتیفیکیشن‌های وب
 */

// نسخه کش
const CACHE_VERSION = 'v1';
const CACHE_NAME = `pharmecyhelp-${CACHE_VERSION}`;

// فایل‌های استاتیک برای کش
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/static/js/main.js',
  '/static/css/main.css',
  '/static/images/notification-icon.png'
];

// نصب سرویس ورکر
self.addEventListener('install', (event) => {
  console.log('[Service Worker] Installing Service Worker...', event);
  
  // کش کردن فایل‌های استاتیک
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[Service Worker] Caching app shell');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => {
        console.log('[Service Worker] Skip waiting on install');
        return self.skipWaiting();
      })
      .catch(error => {
        console.error('[Service Worker] Install error:', error);
      })
  );
});

// فعال‌سازی سرویس ورکر
self.addEventListener('activate', (event) => {
  console.log('[Service Worker] Activating Service Worker...', event);
  
  // حذف کش‌های قدیمی
  event.waitUntil(
    caches.keys()
      .then((keyList) => {
        return Promise.all(keyList.map((key) => {
          if (key !== CACHE_NAME) {
            console.log('[Service Worker] Removing old cache', key);
            return caches.delete(key);
          }
        }));
      })
      .then(() => {
        console.log('[Service Worker] Claiming clients');
        return self.clients.claim();
      })
      .catch(error => {
        console.error('[Service Worker] Activate error:', error);
      })
  );
  
  return self.clients.claim();
});

// دریافت درخواست‌ها
self.addEventListener('fetch', (event) => {
  // استراتژی network first, fallback to cache
  event.respondWith(
    fetch(event.request)
      .catch(() => {
        return caches.match(event.request);
      })
  );
});

// دریافت نوتیفیکیشن‌ها
self.addEventListener('push', (event) => {
  console.log('[Service Worker] Push notification received', event);
  
  let notification = {};
  
  try {
    if (event.data) {
      notification = event.data.json();
      console.log('[Service Worker] Push data:', notification);
    } else {
      console.log('[Service Worker] No data in push event');
    }
  } catch (e) {
    console.error('[Service Worker] Error parsing push data:', e);
    notification = {
      title: 'یادآور دارو',
      body: 'زمان مصرف داروی شما رسیده است',
      icon: '/static/images/notification-icon.svg',
      badge: '/static/images/notification-badge.svg',
      data: {
        url: '/reminder'
      }
    };
  }
  
  const title = notification.title || 'یادآور دارو';
  const options = {
    body: notification.body || 'زمان مصرف داروی شما رسیده است',
    icon: notification.icon || '/static/images/notification-icon.png',
    badge: notification.badge || '/static/images/notification-badge.png',
    vibrate: [100, 50, 100],
    data: notification.data || {},
    actions: notification.actions || [
      { action: 'taken', title: 'مصرف شد' },
      { action: 'later', title: 'بعداً' }
    ],
    // نمایش نوتیفیکیشن حتی در حالت فوکوس
    requireInteraction: true
  };
  
  console.log('[Service Worker] Showing notification:', title, options);
  
  event.waitUntil(
    self.registration.showNotification(title, options)
      .then(() => {
        console.log('[Service Worker] Notification shown successfully');
      })
      .catch(error => {
        console.error('[Service Worker] Error showing notification:', error);
      })
  );
});

// کلیک روی نوتیفیکیشن
self.addEventListener('notificationclick', (event) => {
  console.log('[Service Worker] Notification click received', event);
  
  const notification = event.notification;
  const action = event.action;
  const data = notification.data || {};
  
  // بستن نوتیفیکیشن
  notification.close();
  
  // پردازش اکشن‌ها
  if (action === 'taken') {
    // ارسال درخواست به سرور برای ثبت مصرف دارو
    if (data.medicationId) {
      const url = `/api/reminder/medications/${data.medicationId}/taken/`;
      event.waitUntil(
        fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${data.token || ''}`
          }
        })
        .then(response => {
          console.log('[Service Worker] Medication taken response:', response);
        })
        .catch(error => {
          console.error('[Service Worker] Error marking medication as taken:', error);
        })
      );
    }
  } else if (action === 'later') {
    // ارسال درخواست به سرور برای یادآوری مجدد
    if (data.medicationId) {
      const url = `/api/reminder/medications/${data.medicationId}/remind-later/`;
      event.waitUntil(
        fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${data.token || ''}`
          }
        })
        .then(response => {
          console.log('[Service Worker] Remind later response:', response);
        })
        .catch(error => {
          console.error('[Service Worker] Error setting remind later:', error);
        })
      );
    }
  } else {
    // باز کردن صفحه مربوطه
    const urlToOpen = data.url || '/reminder';
    
    event.waitUntil(
      self.clients.matchAll({ type: 'window' })
        .then((clientList) => {
          // بررسی وجود پنجره باز
          for (const client of clientList) {
            if (client.url.includes(urlToOpen) && 'focus' in client) {
              return client.focus();
            }
          }
          
          // باز کردن پنجره جدید
          if (self.clients.openWindow) {
            return self.clients.openWindow(urlToOpen);
          }
        })
        .catch(error => {
          console.error('[Service Worker] Error opening window:', error);
        })
    );
  }
}); 