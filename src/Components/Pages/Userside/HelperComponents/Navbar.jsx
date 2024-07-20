import React, { useState, useCallback, useEffect } from 'react'
import { AiFillHome, AiOutlineSearch, AiFillMessage, AiFillNotification, AiFillPlusCircle, AiFillProfile, AiOutlineMore } from 'react-icons/ai'
import { BiSolidMessageRounded } from "react-icons/bi";
import { FaUser } from "react-icons/fa";
import AddPost from './AddPost'
import PrivetRoute from '../../../Wrappers/PrivetRoute'
import { useDispatch } from 'react-redux'
import { delAuth } from '../../../../Redux/UserdataSlice'
import { Link } from 'react-router-dom'
import { delStories } from '../../../../Redux/StoriesSlice'
import { delPost } from '../../../../Redux/PostSlice'
import { IoIosNotifications } from "react-icons/io";
import { fetchNotifications } from './../../../../Redux/NotificationSlice'
import api from '../../../../Config'

function Navbar() {
  const dispatch = useDispatch()
  const [addPost, setAddPost] = useState(false)
  const [notificationCount, setNotificationCount] = useState(0)
  const access = localStorage.getItem('access')
  
  const addPostCloseFun = useCallback(() => {
    setAddPost(prevState => !prevState);
  }, [addPost]);

  // const handleLogout = () => {
  //   localStorage.clear()
  //   dispatch(delAuth())
  //   dispatch(delStories())
  //   dispatch(delPost())

  // }

  const fetchUnreadNotificationCount = async () => {
    try {
      const response = await api.get(`user/notifications/?count=${true}`, {
        headers: {
          Authorization: `Bearer ${access}`
        }
      })
      setNotificationCount(response.data.unread_count)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    if(!notificationCount){
      fetchUnreadNotificationCount()
    }
    
  },
  [notificationCount])

  useEffect(() => {
    const notificationSocket = new WebSocket(`ws://127.0.0.1:8000/ws/notification/?token=${access}`);
    console.log(notificationSocket)
    notificationSocket.onopen = () => {
      console.log('WebSocket connection established.');
    };

    notificationSocket.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    notificationSocket.onmessage = (event) => {
      console.log('WebSocket message received:', event.data);
      try {
        const data = JSON.parse(event.data);
        console.log('Parsed message:', data);
        if (data.type === 'notification') {
          setNotificationCount(prev => prev + 1)
          dispatch(fetchNotifications())
        }
      } catch (error) {
        console.error('Error parsing message:', error);
      }
    };

    return () => notificationSocket.close()
  },
    [])


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
            <Link to={'/home/'}><li className='flex gap-x-2 py-2 mt-3 cursor-pointer hover:bg-gray-900 rounded-md px-2 md:text-xl'><span><AiFillHome size={24} /></span>Home</li></Link>
            <Link to={'/home/explore/'}><li className='flex gap-x-2 py-2 mt-3 cursor-pointer hover:bg-gray-900 rounded-md px-2 md:text-xl'><span><AiOutlineSearch size={24} /></span>Explore</li></Link>
            <Link to={`/home/message/`}><li className='flex gap-x-2 py-2 mt-3 cursor-pointer hover:bg-gray-900 rounded-md px-2 md:text-xl'><span><BiSolidMessageRounded size={24} /></span>Message</li></Link>

            <Link to={`/home/notification/`}>
              <li className='flex gap-x-2 py-2 mt-3 cursor-pointer hover:bg-gray-900 rounded-md px-2 md:text-xl relative'><span><IoIosNotifications size={25} /></span>Notification
                {notificationCount > 0 && <div className='absolute bg-red-600 flex justify-center items-center left-5 -top-3 rounded-full text-sm size-5'>{notificationCount}</div>}</li>
            </Link>

            <li className='flex gap-x-2 py-2 mt-3 cursor-pointer hover:bg-gray-900 rounded-md px-2 md:text-xl' onClick={() => setAddPost(c => !c)}><span><AiFillPlusCircle size={24} /></span>Create Post</li>
            <Link to={`/home/profile/`}><li className='flex gap-x-2 py-2 mt-3 cursor-pointer hover:bg-gray-900 rounded-md px-2 md:text-xl'><span><FaUser size={24} /></span>Profile</li></Link>
            <Link to={`/home/profile/more/`}><li className='flex gap-x-2 py-2 mt-3 cursor-pointer hover:bg-gray-900 rounded-md px-2 md:text-xl'><span className='flex items-center'><AiOutlineMore size={23} className='rotate-90' /></span>More</li></Link>
          </ul>

        </div>
      </nav>

      <nav className='border-t border-gray-700 fixed  flex p-1 w-screen bottom-0 md:bottom-[-100%] transition-all ease-in-out delay-700 bg-[#000300] z-40 select-none'>
        <ul className='flex justify-between px-5 w-full items-center p-1'>
          <Link to={'/home/'}><li className='flex gap-x-2 p-1 cursor-pointer hover:bg-gray-900 rounded-md px-2 md:text-xl'><span><AiFillHome size={20} /></span></li></Link>
          <Link to={'/home/explore/'}><li className='flex gap-x-2 p-1 cursor-pointer hover:bg-gray-900 rounded-md px-2 md:text-xl'><span><AiOutlineSearch size={20} /></span></li></Link>
          <Link to={`/home/message/`}><li className='flex gap-x-2 p-1 cursor-pointer hover:bg-gray-900 rounded-md px-2 md:text-xl'><span><BiSolidMessageRounded size={20} /></span></li></Link>

          <Link to={`/home/notification/`}><li className='flex gap-x-2 p-1 cursor-pointer relative hover:bg-gray-900 rounded-md px-2 md:text-xl'><span><IoIosNotifications size={20} /></span>
            {notificationCount > 0 && <div className='absolute left-5 -top-1 bg-red-600 size-4 text-xs rounded-full flex justify-center'>{notificationCount}</div>}
          </li></Link>

          <li className='flex gap-x-2 p-1 cursor-pointer hover:bg-gray-900 rounded-md px-2 md:text-xl'><span><AiFillPlusCircle size={20} onClick={() => setAddPost(c => !c)} /></span></li>
          <Link to={`/home/profile/`}><li className='flex gap-x-2 p-1 cursor-pointer hover:bg-gray-900 rounded-md px-2 md:text-xl'><span><FaUser size={20} /></span></li></Link>
          <Link to={`/home/profile/more/`}><li className='flex gap-x-2 p-1 cursor-pointer hover:bg-gray-900 rounded-md px-2 md:text-xl'><span className='flex items-center'><AiOutlineMore size={20} className='rotate-90' /></span></li></Link>
        </ul>
      </nav>
    </div>

  )
}

export default Navbar