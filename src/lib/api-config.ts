/**
 * تنظیمات API برای اتصال به سرور
 */

// آدرس API سرور
export const API_BASE_URL = 'https://django-x8fuqs.chbk.app/api';

// نقاط پایانی API
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: `${API_BASE_URL}/auth/token/`,
    REGISTER: `${API_BASE_URL}/auth/register/`,
    ME: `${API_BASE_URL}/auth/me/`,
    CHANGE_PASSWORD: `${API_BASE_URL}/auth/change-password/`,
  },
  CHATBOT: {
    SESSIONS: `${API_BASE_URL}/chatbot/sessions/`,
    MESSAGES: (sessionId: number) => `${API_BASE_URL}/chatbot/sessions/${sessionId}/messages/`,
  },
  REMINDER: {
    MEDICATIONS: `${API_BASE_URL}/reminder/medications/`,
    MEDICATION: (id: number) => `${API_BASE_URL}/reminder/medications/${id}/`,
    REMINDERS: (id: number) => `${API_BASE_URL}/reminder/medications/${id}/reminders/`,
    REMINDER: (medId: number, reminderId: number) => `${API_BASE_URL}/reminder/medications/${medId}/reminders/${reminderId}/`,
    LOGS: (medId: number, reminderId: number) => `${API_BASE_URL}/reminder/medications/${medId}/reminders/${reminderId}/logs/`,
    LOG: (medId: number, reminderId: number, logId: number) => `${API_BASE_URL}/reminder/medications/${medId}/reminders/${reminderId}/logs/${logId}/`,
    GENERATE_LOGS: (medId: number, reminderId: number) => `${API_BASE_URL}/reminder/medications/${medId}/reminders/${reminderId}/generate-logs/`,
  },
  NOTIFICATIONS: {
    VAPID_PUBLIC_KEY: `${API_BASE_URL}/notifications/web-push/vapid-public-key/`,
    SUBSCRIBE: `${API_BASE_URL}/notifications/web-push/subscribe/`,
    UNSUBSCRIBE: `${API_BASE_URL}/notifications/web-push/unsubscribe/`,
    TEST: `${API_BASE_URL}/notifications/web-push/test-notification/`,
    FORCE_TEST: `${API_BASE_URL}/notifications/web-push/force-test-notification/`,
    SETTINGS: `${API_BASE_URL}/notifications/settings/`,
  }
};

// تابع ساخت هدرها با توکن احراز هویت
export const authHeaders = () => {
  const token = localStorage.getItem('access_token');
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  };
};

// تابع آدرس کامل برای تصاویر
export const getFullImageUrl = (imagePath: string) => {
  if (imagePath.startsWith('data:')) {
    return imagePath;
  }
  return `https://django-x8fuqs.chbk.app${imagePath}`;
}; 