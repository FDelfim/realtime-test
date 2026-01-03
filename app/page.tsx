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
  const [messages] = useCollectionData(queryMessages);
  const [formValue, setFormValue] = useState('');
  const [previousMessageCount, setPreviousMessageCount] = useState(0);
  const [isFirstLoad, setIsFirstLoad] = useState(true);
  const uid = '';
  const photoURL = '';
  const lastMessage = useRef<HTMLElement>(null);

  useEffect(() => {
    if (messages && messages.length > 0) {
      if (isFirstLoad) {
        setPreviousMessageCount(messages.length);
        setIsFirstLoad(false);
        return;
      }

      if (messages.length > previousMessageCount) {
        const newMessage = messages[0]; // A mensagem mais recente
        
        if (getNotificationPermission() === 'granted') {
          if (!document.hidden) {
            setPreviousMessageCount(messages.length);
            return;
          }

          if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
            navigator.serviceWorker.controller.postMessage({
              type: 'SHOW_NOTIFICATION',
              title: `💬 ${newMessage.userName}`,
              body: newMessage.text.substring(0, 100) + (newMessage.text.length > 100 ? '...' : ''),
              userName: newMessage.userName
            });
          }
        }
        
        setPreviousMessageCount(messages.length);
      }
    }
  }, [messages, previousMessageCount, isFirstLoad]);

  const getRandomName = () => {
    return userNames[Math.floor(Math.random() * userNames.length)].name || 'Anônimo';
  };

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