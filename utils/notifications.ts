// Utilidade para gerenciar notificações push

export const requestNotificationPermission = async (): Promise<boolean> => {
  if (!('Notification' in window)) {
    console.log('Este navegador não suporta notificações');
    return false;
  }

  if (Notification.permission === 'granted') {
    return true;
  }

  if (Notification.permission !== 'denied') {
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  }

  return false;
};

export const registerServiceWorker = async (): Promise<ServiceWorkerRegistration | null> => {
  if ('serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.register('/sw-custom.js', {
        scope: '/'
      });
      console.log('Service Worker registrado com sucesso:', registration);
      return registration;
    } catch (error) {
      console.error('Erro ao registrar Service Worker:', error);
      return null;
    }
  }
  return null;
};

export const showNotification = async (title: string, options?: NotificationOptions) => {
  const hasPermission = await requestNotificationPermission();
  
  if (!hasPermission) {
    console.log('Permissão de notificação negada');
    return;
  }

  if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
    // Usar service worker para notificações
    const registration = await navigator.serviceWorker.ready;
    await registration.showNotification(title, {
      icon: '/icons/icon-512x512.png',
      badge: '/icons/android-chrome-192x192.png',
      tag: 'chat-message',
      requireInteraction: false,
      ...options
    } as any);
  } else {
    // Fallback para notificação simples
    new Notification(title, {
      icon: '/icons/icon-512x512.png',
      ...options
    });
  }
};

export const isNotificationSupported = (): boolean => {
  return 'Notification' in window && 'serviceWorker' in navigator;
};

export const getNotificationPermission = (): NotificationPermission => {
  if ('Notification' in window) {
    return Notification.permission;
  }
  return 'denied';
};
