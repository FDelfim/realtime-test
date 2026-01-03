import React, { FormEvent } from 'react';
import firebase from 'firebase/compat/app';
import { addDoc } from "firebase/firestore";
import { IoSend } from "react-icons/io5";

interface MessageSenderProps {
  messagesCollection: any,
  formValue: string,
  setFormValue: any,
  user: any,
  uid: string,
  photoURL: string,
  getRandomName: () => string
}

export default function MessageSender(props: MessageSenderProps) {
  const { messagesCollection, formValue, setFormValue, user, uid, photoURL, getRandomName } = props;

  const sendMessage = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const finalUserName = getRandomName();
    
    await addDoc(messagesCollection, {
      text: formValue,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      userName: finalUserName,
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
    <div className='fixed bottom-0 w-full px-3 py-4 sm:px-6 sm:py-6 bg-slate-800 shadow-2xl border-t border-slate-700'>
      <form className="w-full flex justify-center" onSubmit={sendMessage}>
        <div className="w-full max-w-4xl flex gap-2 items-end">
          <textarea
            className="flex-1 text-white bg-slate-700 p-3 rounded-2xl border border-slate-600 focus:border-cyan-500 focus:outline-none placeholder:text-gray-400 resize-none overflow-hidden min-h-[48px] max-h-[120px] overflow-y-auto"
            value={formValue}
            onChange={handleInput}
            placeholder="Digite sua mensagem..."
            rows={1}
            style={{ height: 'auto' }}
          />
          <button 
            className="bg-cyan-600 hover:bg-cyan-700 disabled:bg-gray-600 disabled:cursor-not-allowed p-3 rounded-full w-12 h-12 flex items-center justify-center transition-colors shadow-lg" 
            type="submit" 
            disabled={!formValue.trim()}
          >
            <IoSend size={20} />
          </button>
        </div>
      </form>
    </div>
  );
}
