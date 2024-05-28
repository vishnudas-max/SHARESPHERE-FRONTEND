import React from 'react'
import messi from '../../../../media/images/messi.webp'

function Commets({view}) {
    return (
        <div className={`bg-gray-900 max-w-full md:w-[350px] h-[150px]  mx-3 mt-2 mb-[50px] rounded-md border border-gray-300 px-2 overflow-y-scroll no-scrollbar transition duration-800 ease-in-out absolute z-10 ${view  ? 'scale-100' : 'scale-0'
            }`}>

            <div className='flex sticky top-0 justify-between items-center bg-gray-900 pt-2'>
                <div className='flex gap-x-2 '>
                    <img src={messi} alt="" className='size-5 rounded-full' />
                    <input type="text" placeholder='Type something' className='text-[9px] text-white bg-transparent border-b border-gray-700 outline-none' />
                </div>
                <button className='text-[9px] border border-gray-300 h-fit px-2 rounded-md'>Post</button>
            </div>

            <div className='flex gap-x-2 items-center mt-1'>
                <img src={messi} alt="" className='size-5 rounded-full' />
                <p className='text-[9px] font-thin'>King Leo</p>
            </div>

            <div className='flex gap-x-2 items-center mt-1 justify-end '>
                <p className='text-[9px] font-thin'>King Leo</p>
                <img src={messi} alt="" className='size-5 rounded-full' />
            </div>

            <div className='flex gap-x-2 items-center mt-1'>
                <img src={messi} alt="" className='size-5 rounded-full' />
                <p className='text-[9px] font-thin'>King Leo</p>
            </div>
            <div className='flex gap-x-2 items-center mt-1'>
                <img src={messi} alt="" className='size-5 rounded-full' />
                <p className='text-[9px] font-thin'>King Leo</p>
            </div>

            <div className='flex gap-x-2 items-center mt-1 justify-end '>
                <p className='text-[9px] font-thin'>King Leo</p>
                <img src={messi} alt="" className='size-5 rounded-full' />
            </div>

            <div className='flex gap-x-2 items-center mt-1'>
                <img src={messi} alt="" className='size-5 rounded-full' />
                <p className='text-[9px] font-thin'>King Leo</p>
            </div>
        </div>
    )
}

export default Commets