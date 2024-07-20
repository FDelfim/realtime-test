'use client'
import { useRef, useState } from "react";
import { db } from "../db/firebase";
import { collection, limit, orderBy, query, addDoc, Timestamp } from "firebase/firestore";
import { useCollectionData } from 'react-firebase-hooks/firestore';
import 'firebase/compat/firestore';
import Message from "../components/Message";
import MessageSender from "@/components/MessageSender";
import Navbar from "@/components/Navbar";

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
  const uid = '';
  const photoURL = '';

  return (
    <main className="min-h-[500px]">
      <Navbar></Navbar>
      <div className="p-8">
        <div className=" overflow-y-scroll max-h-[80vh]">
          {messages && messages.map(msg => <Message message={msg as Message}></Message>)}
          <span ref={user}></span>
        </div>
      </div>
      <MessageSender
        messagesCollection={messagesCollection}
        formValue={formValue}
        setFormValue={setFormValue}
        user={user}
        uid={uid}
        photoURL={photoURL}
      ></MessageSender>
    </main>
  );
}
