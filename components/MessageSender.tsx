import React, { FormEvent, useState, useRef } from 'react';
import firebase from 'firebase/compat/app';
import { addDoc } from "firebase/firestore";
import { userNames } from "@/utils/names";
import { IoSend } from "react-icons/io5";

interface MessageSenderProps {
  messagesCollection: any,
  formValue: string,
  setFormValue: any,
  user: any,
  uid: string,
  photoURL: string,
  userName: string | null
}

export default function MessageSender(props: MessageSenderProps) {
  const { messagesCollection, formValue, setFormValue, user, uid, photoURL } = props;

  const sendMessage = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await addDoc(messagesCollection, {
      text: formValue,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      userName: userNames[Math.floor(Math.random() * userNames.length)].name,
      uid,
      photoURL
    });
    setFormValue('');
    user.current?.scrollIntoView({ behavior: 'smooth' });
  }

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setFormValue(e.target.value);
    e.target.style.height = 'auto';
    e.target.style.height = `${e.target.scrollHeight}px`; 
  }


  return (
    <div className='fixed bottom-0 w-full p-8 bg-zinc-800'>
      <form className="w-full flex justify-center" onSubmit={sendMessage}>
        <div className="w-full flex gap-1 justify-center">
          <div className='flex justify-center'>
            <textarea
              className="input text-black p-2 rounded-lg placeholder:from-neutral-300 resize-none overflow-hidden w-[300px] max-h-[60px] overflow-y-scroll"
              value={formValue}
              onChange={handleInput}
              placeholder="Mensagem"
              rows={1}
              style={{ height: 'auto' }}
            />
          </div>
          <div className='flex items-end justify-end'>
            <button className="bg-cyan-600 p-2 rounded-full w-9 h-9 disabled:cursor-not-allowed flex items-center justify-center" type="submit" disabled={!formValue}><IoSend /></button>
          </div>
        </div>
      </form>
    </div>
  );
}
