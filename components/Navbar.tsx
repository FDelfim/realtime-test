import React from 'react'
import Image from "next/image";

export default function Navbar() {
  return (
      <nav className="bg-slate-800 p-4 fixed z-50 top-0 w-full">
        <div className="container mx-auto flex justify-between">
          <div className='flex gap-2'>
            <Image className='rounded-lg' src="/icons/icon-512x512.png" alt="Logo" width={32} height={32} />
            <h1 className="text-white text-2xl uppercase">Chat dos otário</h1>
          </div>
        </div>
      </nav>
  )
}
