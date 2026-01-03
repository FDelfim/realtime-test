/**
 * Service Worker para Chat dos Otários
 * Suporte a notificações push
 */

const CACHE_NAME = 'chat-otarios-v1';

// Listener para notificações push
self.addEventListener('push', function (event) {
    const data = event.data ? event.data.json() : {};
    const title = data.title || 'Nova Mensagem';
    const options = {
        body: data.body || 'Você tem uma nova mensagem no chat',
        icon: '/icons/icon-512x512.png',
        badge: '/icons/android-chrome-192x192.png',
        vibrate: [200, 100, 200],
        tag: 'chat-message',
        data: data,
        requireInteraction: false
    };

    event.waitUntil(
        self.registration.showNotification(title, options)
    );
});

// Listener para cliques em notificações
self.addEventListener('notificationclick', function (event) {
    event.notification.close();

    event.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function (clientList) {
            // Se já existe uma janela aberta, foca nela
            for (let i = 0; i < clientList.length; i++) {
                const client = clientList[i];
                if (client.url.includes(self.registration.scope) && 'focus' in client) {
                    return client.focus();
                }
            }
            // Caso contrário, abre uma nova janela
            if (clients.openWindow) {
                return clients.openWindow('/');
            }
        })
    );
});

// Listener para instalação do service worker
self.addEventListener('install', function (event) {
    console.log('Service Worker instalado');
    self.skipWaiting();
});

// Listener para ativação do service worker
self.addEventListener('activate', function (event) {
    console.log('Service Worker ativado');
    event.waitUntil(
        clients.claim()
    );
});

// Listener para mensagens do cliente
self.addEventListener('message', function (event) {
    if (event.data && event.data.type === 'SHOW_NOTIFICATION') {
        const { title, body, userName } = event.data;
        self.registration.showNotification(title, {
            body: body,
            icon: '/icons/icon-512x512.png',
            badge: '/icons/android-chrome-192x192.png',
            vibrate: [200, 100, 200],
            tag: 'chat-message',
            data: { userName },
            requireInteraction: false
        });
    }
});
