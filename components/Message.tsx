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
    <div className='w-full sm:w-11/12 md:w-3/4 lg:w-2/3 xl:w-1/2 bg-white my-2 p-3 sm:p-4 text-gray-900 rounded-2xl shadow-md border border-gray-200 transition-all duration-200 hover:shadow-lg hover:scale-[101%]'>
      <p className='font-bold uppercase text-sm sm:text-base mb-1' style={{ color: userNames.find(user => user.name === message.userName)?.color }}>
        {message.userName ?? 'Desconhecido'}
      </p>
      <p className='text-base sm:text-lg break-words leading-relaxed'>
        {message.text}
      </p>
      <small className='text-gray-500 flex w-full justify-end text-xs mt-2'>{formattedDate}</small>
    </div>
  )
}
