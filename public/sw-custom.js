/**
 * Service Worker para Chat dos Otários
 * Suporte a notificações push
 */

console.log('🎬 Service Worker - Script carregado');

const CACHE_NAME = 'chat-otarios-v1';

// Ativar imediatamente
self.addEventListener('install', (event) => {
    console.log('📦 Service Worker - Instalado');
    self.skipWaiting(); // Ativa imediatamente
});

self.addEventListener('activate', (event) => {
    console.log('✅ Service Worker - Ativado');
    event.waitUntil(
        self.clients.claim() // Assume controle imediatamente
    );
});

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
    console.log('📦 Service Worker instalado (duplicado - removido)');
    // Já está no topo do arquivo
});

// Listener para ativação do service worker
self.addEventListener('activate', function (event) {
    console.log('✅ Service Worker ativado (duplicado - removido)');
    // Já está no topo do arquivo
});

// Listener para mensagens do cliente
let pageIsHidden = false;
let lastNotificationTimestamp = 0;

self.addEventListener('message', function (event) {
    console.log('📨 SW recebeu mensagem:', event.data);

    if (event.data && event.data.type === 'SKIP_WAITING') {
        console.log('⚡ Ativação imediata solicitada');
        self.skipWaiting();
        return;
    }

    if (event.data && event.data.type === 'SHOW_NOTIFICATION') {
        const { title, body, userName, isHidden, timestamp } = event.data;

        console.log('🔔 TIPO: SHOW_NOTIFICATION');
        console.log('📋 Dados:', { title, body, userName, isHidden, timestamp });
        console.log('🔐 Notification.permission:', Notification.permission);
        console.log('📱 self.registration:', self.registration);

        // Verificar permissão
        if (Notification.permission !== 'granted') {
            console.error('❌ Permissão de notificação não concedida:', Notification.permission);
            return;
        }

        // Evitar notificações duplicadas
        if (timestamp && timestamp === lastNotificationTimestamp) {
            console.log('⚠️ Notificação duplicada ignorada');
            return;
        }
        lastNotificationTimestamp = timestamp;

        console.log('🚀 Chamando showNotification...');

        // Opções mais simples possível
        const options = {
            body: body || 'Nova mensagem',
            tag: 'chat-' + timestamp,
            requireInteraction: false
        };

        console.log('⚙️ Options:', options);

        // Tentar mostrar notificação
        try {
            self.registration.showNotification(title, options)
                .then(() => {
                    console.log('✅ showNotification Promise resolvida!');
                })
                .catch((error) => {
                    console.error('❌ showNotification Promise rejeitada:', error);
                    console.error('❌ Error name:', error?.name);
                    console.error('❌ Error message:', error?.message);
                    console.error('❌ Error stack:', error?.stack);

                    // Tentar notificação fallback
                    console.log('🔄 Tentando notificação fallback...');
                    new Notification(title, { body: body });
                });
        } catch (error) {
            console.error('❌ Erro síncrono ao chamar showNotification:', error);
            console.error('❌ Error details:', {
                name: error?.name,
                message: error?.message,
                stack: error?.stack
            });
        }
    }

    if (event.data && event.data.type === 'PAGE_VISIBILITY') {
        pageIsHidden = event.data.isHidden;
        console.log('Page visibility changed:', pageIsHidden ? 'hidden' : 'visible');
    }
});
