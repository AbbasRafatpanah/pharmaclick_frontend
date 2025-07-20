'use client';

import { useEffect } from 'react';

export function ServiceWorkerRegistration() {
  useEffect(() => {
    // Service worker registration disabled temporarily
    console.log('Web push notifications are coming soon...');
    
    // Commented out service worker registration
    /*
    if ('serviceWorker' in navigator) {
      console.log('Service Worker is supported in this browser');
      
      window.addEventListener('load', async () => {
        try {
          console.log('Registering service worker...');
          const registration = await navigator.serviceWorker.register('/sw.js');
          console.log('Service Worker registered with scope:', registration.scope);
        } catch (error) {
          console.error('Service Worker registration failed:', error);
        }
      });
    } else {
      console.log('Service Worker is not supported in this browser');
    }
    */
  }, []);

  return null;
} 