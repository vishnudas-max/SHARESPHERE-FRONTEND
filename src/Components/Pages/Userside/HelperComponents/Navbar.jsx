import React, { useState, useCallback } from 'react'
import { AiFillHome, AiOutlineSearch, AiFillMessage, AiFillNotification, AiFillPlusCircle, AiFillProfile, AiOutlineMore } from 'react-icons/ai'
import AddPost from './AddPost'
import PrivetRoute from '../../../Wrappers/PrivetRoute'
import { useDispatch } from 'react-redux'
import { delAuth } from '../../../../Redux/UserdataSlice'

function Navbar() {
  const dispatch = useDispatch()
  const [addPost, setAddPost] = useState(false)
  const addPostCloseFun = useCallback(() => {
    setAddPost(prevState => !prevState);
  }, [addPost]);

  const handleLogout =()=>{
    localStorage.clear()
    dispatch(delAuth())

  }
  return (
    <div className='text-white '>
      {addPost &&
        <PrivetRoute>
          <AddPost setAddPost={addPostCloseFun} />
        </PrivetRoute>
      }
      <nav className='border-r border-gray-700  w-[320px] h-screen hidden  md:block fixed top-0 bg-[#000300] select-none'>
        <div className='max-w-[200px] mx-auto pt-9'>
          <h1 className='text-white text-2xl font-semibold'><span className='text-3xl font-bold'>S</span>HARESPHERE</h1>
        </div>
        <div className='max-w-[200px] mx-auto mt-4'>
          <ul className='flex-col'>
            <li className='flex gap-x-2 py-2 mt-3 cursor-pointer hover:bg-gray-900 rounded-md px-2 md:text-xl'><span><AiFillHome size={24} /></span>Home</li>
            <li className='flex gap-x-2 py-2 mt-3 cursor-pointer hover:bg-gray-900 rounded-md px-2 md:text-xl'><span><AiOutlineSearch size={24} /></span>Explore</li>
            <li className='flex gap-x-2 py-2 mt-3 cursor-pointer hover:bg-gray-900 rounded-md px-2 md:text-xl'><span><AiFillMessage size={24} /></span>Message</li>
            <li className='flex gap-x-2 py-2 mt-3 cursor-pointer hover:bg-gray-900 rounded-md px-2 md:text-xl'><span><AiFillNotification size={24} /></span>Notification</li>
            <li className='flex gap-x-2 py-2 mt-3 cursor-pointer hover:bg-gray-900 rounded-md px-2 md:text-xl' onClick={() => setAddPost(c => !c)}><span><AiFillPlusCircle size={24} /></span>Create Post</li>
            <li className='flex gap-x-2 py-2 mt-3 cursor-pointer hover:bg-gray-900 rounded-md px-2 md:text-xl'><span><AiFillProfile size={24} /></span>Profile</li>
            <li className='flex gap-x-2 py-2 mt-3 cursor-pointer hover:bg-gray-900 rounded-md px-2 md:text-xl'><span className='flex items-center'><AiOutlineMore size={23} className='rotate-90' /></span>More</li>
          </ul>
         
        </div>
         <p className='text-red-600 font-semibold absolute bottom-10 left-14 cursor-pointer' onClick={handleLogout}>LOGOUT</p>
      </nav>

      <nav className='border-t border-gray-700 fixed  flex p-1 w-screen bottom-0 md:bottom-[-100%] transition-all ease-in-out delay-700 bg-[#000300] z-40 select-none'>
        <ul className='flex justify-between px-5 w-full items-center p-1'>
          <li className='flex gap-x-2 p-1 cursor-pointer hover:bg-gray-900 rounded-md px-2 md:text-xl'><span><AiFillHome size={20} /></span></li>
          <li className='flex gap-x-2 p-1 cursor-pointer hover:bg-gray-900 rounded-md px-2 md:text-xl'><span><AiOutlineSearch size={20} /></span></li>
          <li className='flex gap-x-2 p-1 cursor-pointer hover:bg-gray-900 rounded-md px-2 md:text-xl'><span><AiFillMessage size={20} /></span></li>
          <li className='flex gap-x-2 p-1 cursor-pointer hover:bg-gray-900 rounded-md px-2 md:text-xl'><span><AiFillNotification size={20} /></span></li>
          <li className='flex gap-x-2 p-1 cursor-pointer hover:bg-gray-900 rounded-md px-2 md:text-xl'><span><AiFillPlusCircle size={20} onClick={() => setAddPost(c => !c)} /></span></li>
          <li className='flex gap-x-2 p-1 cursor-pointer hover:bg-gray-900 rounded-md px-2 md:text-xl'><span><AiFillProfile size={20} /></span></li>
          <li className='flex gap-x-2 p-1 cursor-pointer hover:bg-gray-900 rounded-md px-2 md:text-xl'><span className='flex items-center'><AiOutlineMore size={20} className='rotate-90' /></span></li>
        </ul>
      </nav>
    </div>

  )
}

export default Navbar