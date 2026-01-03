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
      console.log('🔧 Registrando Service Worker...');
      
      // Registrar o service worker
      const registration = await navigator.serviceWorker.register('/sw-custom.js', {
        scope: '/',
        updateViaCache: 'none'
      });
      
      console.log('✅ Service Worker registrado:', registration);
      
      // Forçar atualização
      await registration.update();
      
      // Se houver um SW esperando, ativá-lo imediatamente
      if (registration.waiting) {
        console.log('⚡ Ativando Service Worker que estava esperando...');
        registration.waiting.postMessage({ type: 'SKIP_WAITING' });
      }
      
      // Aguardar estar pronto
      await navigator.serviceWorker.ready;
      console.log('✅ Service Worker pronto');
      
      // Verificar se está ativo
      const activeReg = await navigator.serviceWorker.ready;
      if (activeReg.active) {
        console.log('✅ Service Worker ATIVO confirmado');
      } else {
        console.warn('⚠️ Service Worker registrado mas NÃO está ativo');
      }
      
      return registration;
    } catch (error) {
      console.error('❌ Erro ao registrar Service Worker:', error);
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
