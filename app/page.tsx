'use client'
import { useRef, useState, useEffect } from "react";
import { db } from "../db/firebase";
import { collection, limit, orderBy, query, addDoc, Timestamp } from "firebase/firestore";
import { useCollectionData } from 'react-firebase-hooks/firestore';
import 'firebase/compat/firestore';
import Message from "../components/Message";
import MessageSender from "@/components/MessageSender";
import Navbar from "@/components/Navbar";
import { userNames } from "@/utils/names";
import { getNotificationPermission } from "@/utils/notifications";

const messagesCollection = collection(db, 'messages');

interface Message {
  message: {
    text: string,
    uid: string,
    photoURL: string,
    createdAt: Timestamp
  }
}

export default function Home() {

  const user = useRef<HTMLSpanElement>(null);
  const queryMessages = query(messagesCollection, orderBy('createdAt', 'desc'), limit(25));
  const [messages, loading, error] = useCollectionData(queryMessages);
  const [formValue, setFormValue] = useState('');
  const [previousMessageCount, setPreviousMessageCount] = useState(0);
  const [isFirstLoad, setIsFirstLoad] = useState(true);
  const isPageVisible = useRef(true);
  const lastMessageTimestamp = useRef<number>(0);
  const uid = '';
  const photoURL = '';
  const lastMessage = useRef<HTMLElement>(null);

  // Log para debug
  useEffect(() => {
    if (messages) {
      console.log('🔄 Messages updated:', messages.length, 'items');
    }
    if (error) {
      console.error('❌ Firebase error:', error);
    }
  }, [messages, error]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      isPageVisible.current = !document.hidden;
    };

    handleVisibilityChange();
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.ready.then((registration) => {
        console.log('✅ Service Worker está pronto:', registration);
      });
    }
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  useEffect(() => {
    if (!messages || messages.length === 0) return;

    if (isFirstLoad) {
      setPreviousMessageCount(messages.length);
      if (messages[0]?.createdAt) {
        lastMessageTimestamp.current = messages[0].createdAt.seconds || 0;
      }
      setIsFirstLoad(false);
      console.log('🎬 Primeira carga -', messages.length, 'mensagens');
      return;
    }

    const currentFirstMessage = messages[0];
    const currentTimestamp = currentFirstMessage?.createdAt?.seconds || 0;
    const isNewMessage = currentTimestamp > 0 && currentTimestamp > lastMessageTimestamp.current;

    console.log('🔍 Verificando mensagens:', {
      total: messages.length,
      previousCount: previousMessageCount,
      currentTimestamp,
      lastTimestamp: lastMessageTimestamp.current,
      isNew: isNewMessage,
      pageVisible: isPageVisible.current
    });

    if (isNewMessage) {
      lastMessageTimestamp.current = currentTimestamp;
      
      console.log('📨 NOVA MENSAGEM DETECTADA:', currentFirstMessage.userName);
      console.log('👁️ Página visível:', isPageVisible.current);
      console.log('📊 Permission:', getNotificationPermission());
      
      // Enviar notificação se a página estiver oculta
      if (!isPageVisible.current && getNotificationPermission() === 'granted') {
        const sendNotification = async () => {
          if ('serviceWorker' in navigator) {
            try {
              const registration = await navigator.serviceWorker.ready;
              
              if (!registration.active) {
                console.error('❌ SW não está ativo');
                return;
              }
              
              console.log('📤 ENVIANDO NOTIFICAÇÃO AO SW');
              
              registration.active.postMessage({
                type: 'SHOW_NOTIFICATION',
                title: `💬 ${currentFirstMessage.userName}`,
                body: currentFirstMessage.text.substring(0, 100) + (currentFirstMessage.text.length > 100 ? '...' : ''),
                userName: currentFirstMessage.userName,
                isHidden: true,
                timestamp: Date.now()
              });
              
              console.log('✅ Mensagem enviada ao SW com sucesso');
            } catch (error) {
              console.error('❌ Erro ao enviar mensagem ao SW:', error);
            }
          }
        };
        
        sendNotification();
      } else if (isPageVisible.current) {
        console.log('ℹ️ Página visível, notificação não enviada');
      } else {
        console.log('ℹ️ Permissão de notificação não concedida:', getNotificationPermission());
      }
    }
    
    setPreviousMessageCount(messages.length);
  }, [messages, previousMessageCount, isFirstLoad]);

  const getRandomName = () => {
    return userNames[Math.floor(Math.random() * userNames.length)].name || 'Anônimo';
  };

  // Manter o service worker ativo e aware das mudanças
  useEffect(() => {
    const handleVisibilityChange = () => {
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.ready.then((registration) => {
          if (registration.active) {
            console.log('Visibilidade mudou - Hidden:', document.hidden);
            try {
              registration.active.postMessage({
                type: 'PAGE_VISIBILITY',
                isHidden: document.hidden
              });
            } catch (error) {
              console.error('Erro ao enviar visibilidade ao SW:', error);
            }
          }
        });
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    // Verificar se o service worker está pronto
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.ready.then((registration) => {
        console.log('Service Worker está pronto:', registration);
      });
    }
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  setTimeout(() => {
    lastMessage.current?.scrollIntoView({ behavior: 'smooth' });
  }, 1000);
  
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-slate-900 pt-16 pb-24">
        <div className="container mx-auto px-3 sm:px-4 lg:px-8 py-4">
          <div className="flex flex-col items-center">
            {messages && messages.map((msg, key) => {
              return (
                <span key={key} className="w-full flex justify-center">
                  <Message message={msg as Message}></Message>
                  {key === 0 && <span ref={lastMessage}></span>}
                </span>
              )
            }).reverse()}
            <span ref={user}></span>
          </div>
        </div>
      </main>
      <MessageSender
        messagesCollection={messagesCollection}
        formValue={formValue}
        setFormValue={setFormValue}
        user={user}
        uid={uid}
        photoURL={photoURL}
        getRandomName={getRandomName}
      />
    </>
  );
}