import { Timestamp } from 'firebase/firestore/lite';
import React from 'react'
import { userNames } from '@/utils/names';

interface MessageProps {
  text: string,
  uid: string,
  userName: string,
  photoURL: string,
  createdAt: Timestamp
}

export default function Message(props: any) {
  const message: MessageProps = props.message;
  const formattedDate = message.createdAt ? new Date(message.createdAt.toDate()).toLocaleString('pt-BR') : '';

  return (
    <div className='lg:w-1/2 md:w-3/4 w-full bg-slate-100 my-2 p-2 text-black rounded-lg border transition duration-300 ease-in-out transform hover:scale-[101%]'>
      <p className='font-bold uppercase text-m' style={{ color: userNames.find(user => user.name === message.userName)?.color }}>{message.userName ?? 'Desconhecido'}</p>
      <p className='text-lg break-words'>
        {message.text}
      </p>
      <small className='text-gray-400 flex w-full justify-end text-xs mt-2'>{formattedDate}</small>
    </div>
  )
}
