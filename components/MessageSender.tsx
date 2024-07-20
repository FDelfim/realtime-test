import React, { FormEvent } from 'react'
import firebase from 'firebase/compat/app';
import { addDoc } from "firebase/firestore";
import { userNames } from "@/utils/names"; // Add this line to import the userNames array

interface MessageSenderProps {
  messagesCollection: any,
  formValue: string,
  setFormValue: any,
  user: any,
  uid: string,
  photoURL: string,
  userName: string | null
}

export default function MessageSender(props : MessageSenderProps) {

const { messagesCollection, formValue, setFormValue, user, uid, photoURL } = props
    
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

  return (
    <div className='fixed bottom-0 w-full p-8 bg-zinc-800'>
      <form className="w-full flex justify-center" onSubmit={sendMessage}>
        <input className="input w-auto text-black p-2 rounded-l-lg placeholder:from-neutral-300" value={formValue} onChange={(e) => setFormValue(e.target.value)} placeholder="Mensagem" />
        <button className="bg-slate-800 w-auto p-2 rounded-r-lg disabled:cursor-not-allowed" type="submit" disabled={!formValue}>&gt;</button>
      </form>
    </div>
  )
}
