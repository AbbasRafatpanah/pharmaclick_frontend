/**
 * سرویس مدیریت نوتیفیکیشن‌های وب
 */

import axios from 'axios';
import { API_ENDPOINTS, authHeaders } from './api-config';

/**
 * بررسی پشتیبانی مرورگر از نوتیفیکیشن‌های وب
 */
export const checkNotificationSupport = (): boolean => {
  if (!('serviceWorker' in navigator)) {
    console.log('Service Worker is not supported in this browser');
    return false;
  }

  if (!('PushManager' in window)) {
    console.log('Push API is not supported in this browser');
    return false;
  }

  return true;
};

/**
 * بررسی دسترسی به نوتیفیکیشن‌ها
 */
export const checkNotificationPermission = (): NotificationPermission | null => {
  if (!('Notification' in window)) {
    console.log('Notifications are not supported in this browser');
    return null;
  }

  return Notification.permission;
};

/**
 * درخواست دسترسی به نوتیفیکیشن‌ها
 */
export const requestNotificationPermission = async (): Promise<NotificationPermission | null> => {
  if (!('Notification' in window)) {
    console.log('Notifications are not supported in this browser');
    return null;
  }

  try {
    console.log('Requesting notification permission...');
    const permission = await Notification.requestPermission();
    console.log('Permission result:', permission);
    return permission;
  } catch (error) {
    console.error('Error requesting notification permission:', error);
    return null;
  }
};

/**
 * ثبت سرویس ورکر
 */
export const registerServiceWorker = async (): Promise<ServiceWorkerRegistration | null> => {
  if (!('serviceWorker' in navigator)) {
    console.log('Service Worker is not supported in this browser');
    return null;
  }

  try {
    console.log('Registering service worker...');
    const registration = await navigator.serviceWorker.register('/sw.js');
    console.log('Service Worker registered with scope:', registration.scope);
    return registration;
  } catch (error) {
    console.error('Service Worker registration failed:', error);
    return null;
  }
};

/**
 * دریافت کلیدهای عمومی VAPID
 */
export const getVapidPublicKey = async (): Promise<string | null> => {
  try {
    console.log('Fetching VAPID public key...');
    const token = localStorage.getItem('access_token');
    if (!token) {
      console.log('User is not authenticated');
      return null;
    }

    const response = await axios.get(API_ENDPOINTS.NOTIFICATIONS.VAPID_PUBLIC_KEY, {
      headers: authHeaders()
    });
    
    console.log('VAPID public key response:', response.data);
    
    if (response.data.success) {
      const publicKey = response.data.vapid_public_key;
      console.log('VAPID public key received:', publicKey);
      return publicKey;
    } else {
      console.error('Error in VAPID public key response:', response.data.message);
      return null;
    }
  } catch (error) {
    console.error('Error fetching VAPID public key:', error);
    return null;
  }
};

/**
 * تبدیل کلید عمومی به آرایه بافر
 */
const urlBase64ToUint8Array = (base64String: string): Uint8Array => {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }

  return outputArray;
};

/**
 * ثبت اشتراک نوتیفیکیشن
 */
export const subscribeUserToPush = async (): Promise<boolean> => {
  try {
    console.log('Starting push subscription process...');
    
    // بررسی دسترسی به نوتیفیکیشن‌ها
    console.log('Current notification permission:', Notification.permission);
    const permission = await requestNotificationPermission();
    console.log('Permission after request:', permission);
    
    if (permission !== 'granted') {
      console.log('Notification permission not granted');
      return false;
    }

    // ثبت سرویس ورکر
    const registration = await registerServiceWorker();
    if (!registration) {
      console.error('Failed to register service worker');
      return false;
    }

    // دریافت کلید عمومی VAPID
    const vapidPublicKey = await getVapidPublicKey();
    if (!vapidPublicKey) {
      console.error('Could not get VAPID public key');
      return false;
    }
    
    console.log('Converting VAPID public key to Uint8Array...');
    const applicationServerKey = urlBase64ToUint8Array(vapidPublicKey);

    // بررسی وجود اشتراک قبلی
    console.log('Checking for existing subscription...');
    const existingSubscription = await registration.pushManager.getSubscription();
    if (existingSubscription) {
      console.log('User is already subscribed to push notifications:', existingSubscription);
      
      // ارسال اطلاعات اشتراک موجود به سرور
      const token = localStorage.getItem('access_token');
      if (!token) {
        console.log('User is not authenticated');
        return false;
      }

      console.log('Sending existing subscription to server...');
      try {
        const response = await axios.post(
          API_ENDPOINTS.NOTIFICATIONS.SUBSCRIBE,
          { subscription_info: existingSubscription.toJSON() },
          { headers: authHeaders() }
        );
        
        console.log('Server response for existing subscription:', response.data);
        return true;
      } catch (error) {
        console.error('Error sending existing subscription to server:', error);
        return false;
      }
    }

    // ایجاد اشتراک جدید
    console.log('Creating new push subscription...');
    try {
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: applicationServerKey
      });
      
      console.log('User subscribed to push notifications:', subscription);
      console.log('Subscription JSON:', JSON.stringify(subscription.toJSON()));

      // ارسال اطلاعات اشتراک به سرور
      const token = localStorage.getItem('access_token');
      if (!token) {
        console.log('User is not authenticated');
        return false;
      }

      console.log('Sending subscription to server...');
      const response = await axios.post(
        API_ENDPOINTS.NOTIFICATIONS.SUBSCRIBE,
        { subscription_info: subscription.toJSON() },
        { headers: authHeaders() }
      );
      
      console.log('Server response:', response.data);
      console.log('Push subscription sent to server');
      return true;
    } catch (subscriptionError) {
      console.error('Error subscribing to push:', subscriptionError);
      return false;
    }
  } catch (error) {
    console.error('Error in subscribeUserToPush:', error);
    return false;
  }
};

/**
 * لغو اشتراک نوتیفیکیشن
 */
export const unsubscribeFromPush = async (): Promise<boolean> => {
  try {
    // بررسی ثبت سرویس ورکر
    const registration = await navigator.serviceWorker.ready;
    
    // بررسی وجود اشتراک
    const subscription = await registration.pushManager.getSubscription();
    if (!subscription) {
      console.log('User is not subscribed to push notifications');
      return true;
    }

    // لغو اشتراک
    const unsubscribed = await subscription.unsubscribe();
    console.log('User unsubscribed from push notifications:', unsubscribed);

    if (!unsubscribed) {
      console.error('Failed to unsubscribe from push notifications');
      return false;
    }

    // ارسال درخواست لغو اشتراک به سرور
    const token = localStorage.getItem('access_token');
    if (!token) {
      console.log('User is not authenticated');
      return false;
    }

    await axios.post(
      API_ENDPOINTS.NOTIFICATIONS.UNSUBSCRIBE,
      { endpoint: subscription.endpoint },
      { headers: authHeaders() }
    );

    console.log('Unsubscription notification sent to server');
    return true;
  } catch (error) {
    console.error('Error unsubscribing from push notifications:', error);
    return false;
  }
};

/**
 * ارسال نوتیفیکیشن تست
 */
export const sendTestNotification = async (): Promise<boolean> => {
  try {
    console.log('Sending test notification request...');
    const token = localStorage.getItem('access_token');
    if (!token) {
      console.log('User is not authenticated');
      return false;
    }

    await axios.post(
      API_ENDPOINTS.NOTIFICATIONS.TEST,
      {},
      { headers: authHeaders() }
    );

    console.log('Test notification request sent');
    return true;
  } catch (error) {
    console.error('Error sending test notification:', error);
    return false;
  }
};

/**
 * ارسال نوتیفیکیشن تست اجباری
 */
export const sendForceTestNotification = async (): Promise<boolean> => {
  try {
    const token = localStorage.getItem('access_token');
    if (!token) {
      console.log('User is not authenticated');
      return false;
    }

    console.log('Sending force test notification request...');
    const response = await axios.post(
      API_ENDPOINTS.NOTIFICATIONS.FORCE_TEST,
      {},
      { headers: authHeaders() }
    );

    console.log('Force test notification response:', response.data);
    return true;
  } catch (error) {
    console.error('Error sending force test notification:', error);
    return false;
  }
}; 