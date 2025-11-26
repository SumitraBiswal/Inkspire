import React from 'react'
import { MdWavingHand } from "react-icons/md";

function Header() {
  return (
    <div className='flex flex-col item-center mt-10 px-6 text-center text-gray-800'>
      <h1 className='flex item center gap-2 text-xl sm:text-3xl font-medium mb-2'>Hey developer <MdWavingHand /></h1>
      <h2 className='text-3xl sm:text-5xl font-semibold mb-4'>Welcome to our app</h2>
      <p className='mb-8 max-w-md'>Let's start with a quick product tour and we will have you up and running in no time!</p>
      <button className=' flex items-center gap-2 border border-grey-500 rounded-full px-6 py-2 text-grey-800 hover:bg-gray-100
      transition-all'>get started</button>
    </div>
  )
}

export default Header
