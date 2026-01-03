import React from 'react'
import Image from "next/image";
import NotificationButton from './NotificationButton';

export default function Navbar() {
  return (
      <nav className="bg-slate-800 shadow-lg fixed z-40 top-0 w-full border-b border-slate-700">
        <div className="container mx-auto px-3 py-3 sm:px-4 sm:py-4 flex justify-between items-center">
          <div className='flex gap-2 items-center'>
            <Image className='rounded-lg' src="/icons/icon-512x512.png" alt="Logo" width={28} height={28} />
            <h1 className="text-white text-lg sm:text-2xl font-bold uppercase">Chat dos otário</h1>
          </div>
          <div className='flex gap-2 items-center'>
            <NotificationButton />
          </div>
        </div>
      </nav>
  )
}
