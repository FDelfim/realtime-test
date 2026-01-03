'use client'
import React, { useEffect, useState } from 'react';
import { IoNotifications, IoNotificationsOff } from 'react-icons/io5';
import { 
  requestNotificationPermission, 
  registerServiceWorker, 
  isNotificationSupported,
  getNotificationPermission 
} from '@/utils/notifications';

interface NotificationButtonProps {
  onPermissionChange?: (enabled: boolean) => void;
}

export default function NotificationButton({ onPermissionChange }: NotificationButtonProps) {
  const [notificationEnabled, setNotificationEnabled] = useState(false);
  const [isSupported, setIsSupported] = useState(false);

  useEffect(() => {
    setIsSupported(isNotificationSupported());
    const permission = getNotificationPermission();
    setNotificationEnabled(permission === 'granted');

    // Registrar service worker ao montar
    registerServiceWorker();
  }, []);

  const handleToggleNotifications = async () => {
    if (!isSupported) {
      alert('Notificações não são suportadas neste navegador');
      return;
    }

    const currentPermission = getNotificationPermission();

    if (currentPermission === 'denied') {
      alert('Você bloqueou as notificações. Por favor, habilite nas configurações do navegador.');
      return;
    }

    if (currentPermission === 'granted') {
      alert('Notificações já estão ativadas! Para desativar, use as configurações do seu navegador.');
      return;
    }

    const granted = await requestNotificationPermission();
    setNotificationEnabled(granted);
    
    if (granted) {
      onPermissionChange?.(true);
      console.log('🔔 Tentando mostrar notificação de teste...');
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.ready.then((registration) => {
          if (registration.active) {
            console.log('SW pronto, enviando notificação de teste');
            try {
              registration.active.postMessage({
                type: 'SHOW_NOTIFICATION',
                title: '🎉 Notificações Ativadas!',
                body: 'Você receberá notificações de novas mensagens',
                userName: 'Sistema',
                isHidden: true // Forçar exibição
              });
            } catch (error) {
              console.error('Erro ao enviar notificação de teste:', error);
            }
          }
        }).catch((error) => {
          console.error('Erro ao obter SW:', error);
        });
      }
    } else {
      onPermissionChange?.(false);
    }
  };

  if (!isSupported) {
    return null;
  }

  return (
    <button
      onClick={handleToggleNotifications}
      className={`p-2 rounded-lg transition-colors ${
        notificationEnabled 
          ? 'bg-green-600 hover:bg-green-700' 
          : 'bg-slate-700 hover:bg-slate-600'
      }`}
      title={notificationEnabled ? 'Notificações ativadas' : 'Ativar notificações'}
    >
      {notificationEnabled ? (
        <IoNotifications size={24} className="text-white" />
      ) : (
        <IoNotificationsOff size={24} className="text-gray-400" />
      )}
    </button>
  );
}
