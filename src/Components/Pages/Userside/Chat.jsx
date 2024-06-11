import React, { useState, useEffect } from 'react'
import Navbar from './HelperComponents/Navbar'
import { AiOutlineSearch } from 'react-icons/ai'
import { FaCircleUser, FaVideo, FaFaceSmile } from "react-icons/fa6";
import { IoMdMore } from "react-icons/io";
import { IoSend } from "react-icons/io5";
import api from '../../../Config'

function Chat() {


    let messagedata = [
        { message: 'Hello, how are you?', time: '10:00 AM', type: 'from' },
        { message: 'I am good, thank youyouddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd!', time: '10:05 AM', type: 'to' },
        { message: 'What are  up ddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddto?', time: '10:07 AM', type: 'from' },
        { message: 'Just working on a project.', time: '10:10 AM', type: 'to' },
        { message: 'Sounds interesting!', time: '10:15 AM', type: 'from' },
        { message: 'Yes, it is quite engaging.', time: '10:20 AM', type: 'to' },
        { message: 'Do you need any help?', time: '10:25 AM', type: 'from' },
        { message: 'Not at the moment, but thanks!', time: '10:30 AM', type: 'to' },
        { message: 'Alright, let me know if you do.', time: '10:35 AM', type: 'from' },
        { message: 'Sure, will do.', time: '10:40 AM', type: 'to' },
        { message: 'What are your plans for the weekend?', time: '10:45 AM', type: 'from' },
        { message: 'I might go hiking.', time: '10:50 AM', type: 'to' },
        { message: 'That sounds fun!', time: '10:55 AM', type: 'from' },
        { message: 'Yes, I love being outdoors.', time: '11:00 AM', type: 'to' },
        { message: 'Do you go hiking often?', time: '11:05 AM', type: 'from' },
        { message: 'Whenever I get the chance.', time: '11:10 AM', type: 'to' },
        { message: 'We should go together sometime.', time: '11:15 AM', type: 'from' },
        { message: 'Absolutely, let\'s plan it.', time: '11:20 AM', type: 'to' },
        { message: 'Great, I\'ll check my calendar.', time: '11:25 AM', type: 'from' },
        { message: 'Perfect, talk to you later.', time: '11:30 AM', type: 'to' }
    ];

    const [users, setUsers] = useState(null)

    // function to fetch users--
    const fetchUsers = async () => {
        let access = localStorage.getItem('access')
        try {
            const response = await api.get('chat/users/', {
                headers: {
                    Authorization: `Bearer ${access}`
                }
            })
            setUsers(response.data)
            console.log(response.data)

        } catch {

        }
    }
    // function to fetch users end here--

    useEffect(() => {
        if (users === null) {
            fetchUsers()
        }
    }, [])
    console.log(users)

    const [currentChatRoom, setChatRoom] = useState(null)
    const [chatMessages, setChatMessages] = useState(messagedata)
    return (
        <div>
            <Navbar />
            <div className='text-white grid grid-cols-12 md:ml-[320px] h-screen'>
                {/* left side--- */}
                <div className={`border-r
                    ${currentChatRoom !== null && 'md:block hidden'}
                    border-gray-700 md:col-span-5 col-span-12 md:px-5 px-10 h-screen`}>
                    {/* search bar-- */}
                    <div className='w-full flex justify-center py-2 sticky top-0 bg-[#000300]'>
                        <div className='flex mt-6 bg-gray-800 px-5 py-2 itmes-center gap-x-1 rounded-full w-full'>
                            <div className='h-fit'>
                                <AiOutlineSearch className='md:size-6 size-6' />
                            </div>
                            <input type="text" placeholder='  Search...' className='outline-none bg-transparent py-1 px-2' />
                        </div>
                    </div>
                    {/* search bar end -here-- */}

                    {/* friends-start-here--- */}
                    <div className=' h-[650px] overflow-y-scroll no-scrollbar mx-auto'>
                        {users ?
                            users.map((user, index) => (
                                <div className='px-2 border-b border-gray-800 h-16 flex' key={index} onClick={() => setChatRoom({ 'id': index, 'user': user.username })}>
                                    <div className='h-full flex items-center'>
                                        <FaCircleUser className='md:size-10 size-7' />
                                    </div>
                                    <div className=' px-2 w-full grid grid-rows-2 py-2'>
                                        <h3 className='text-md font-normal w-fit row-span-1 '>{user.username}</h3>
                                        <div className='flex justify-between'>
                                            <p className='md:text-sm text-xs py-1 md:py-0 row-span-1 max-w-28 line-clamp-1 text-gray-300 '>Hai how are you bro</p>
                                            <p className='text-xs row-span-1 max-w-28 text-gray'>10:20 A:M</p>
                                        </div>

                                    </div>
                                </div>
                            ))
                            :
                            Array(9).fill().map((_, index) => (
                                <div className='px-2 border-b border-gray-800 h-16 flex mt-2' key={index} >
                                    <div className='w-full bg-gray-700 rounded-2xl'>
                                        <div className='flex items-center h-full px-2 justify-between'>
                                            <div className='flex items-center h-full px-2'>
                                                <div className='rounded-full size-9 bg-gray-800'> </div>
                                            <div>
                                                <div className='w-20 h-5 rounded-full bg-gray-800'></div>
                                                <div className='w-44 h-4 mt-1 rounded-full bg-gray-800'></div>
                                            </div>
                                            </div>
                                            <div className='w-10 h-3 rounded-full bg-gray-800'></div>
                                        </div>
                                        
                                    </div>
                                </div>
                            ))
                        }

                    </div>
                    {/* friends-end-here-- */}
                </div>
                {/* left side end here--- */}

                {/* right side---- */}
                {
                    currentChatRoom !== null &&
                    <div className='md:col-span-7 h-screen col-span-12'>
                        {/* chat head-- */}
                        <div className='flex justify-between bg-gray-800 md:h-20  h-16 sticky top-0'>
                            {/* left side-- */}
                            <div className='flex gap-x-1 items-center ps-3 justify-between'>
                                <div className='h-fit'>
                                    <FaCircleUser className='md:size-16 size-12' />
                                </div>
                                <div className='grid grid-rows-2'>
                                    <h1 className='row-span-1 md:text-xl text-md h-fit font-semibold'>{currentChatRoom.user}</h1>
                                    <p className='row-span-1 md:text-sm text-xs text-gray-400 h-fit'>last seen 10 min ago...</p>
                                </div>
                            </div>
                            {/* left side end-- */}
                            {/* right side start-- */}
                            <div className='flex gap-2 items-center'>
                                <div>
                                    <FaVideo className='md:size-8 size-7' />
                                </div>
                                <div>
                                    <IoMdMore className='md:size-8 size-7' />
                                </div>
                            </div>
                            {/* right side end-- */}
                        </div>
                        {/* chat head end here-- */}

                        {/* chat start here-- */}
                        <div className="h-[520px] md:h-[590px] bg-gray-700 px-3  grid-cols-2 overflow-y-scroll no-scrollbar pb-3">
                            {chatMessages.map((message, index) => (
                                <div
                                    key={index}
                                    className={`flex ${message.type === 'to' ? 'justify-end col-span-2' : 'justify-start col-span-2'}`}
                                >
                                    <div className={`bg-gray-900 px-2 mt-2 flex items-start min-h-[40px] gap-x-2 rounded-tr-2xl h-fit rounded-bl-2xl rounded-md max-w-[50%]`}>
                                        <div className="mt-2">
                                            <FaCircleUser className="size-3" />
                                        </div>
                                        <div className="flex-col py-[7px] ">
                                            <p className="row-span-1 text-sm break-all  ">{message.message}</p>
                                            <p className="row-span-1 text-[10px] text-gray-400 w-full text-right">{message.time}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className='bg-transparent  max-h-full flex justify-between items-center w-full py-2'>
                            <div className='flex gap-x-1 items-center pl-3 basis-11/12'>
                                <div>
                                    <FaFaceSmile color='yellow' className='md:size-7 size-6' />
                                </div>
                                <div className='h-fit md:py-2 w-full pr-8'>
                                    <input type="text" placeholder='text...' className='bg-transparent outline-none px-2 w-full border-b border-gray-600' />
                                </div>
                            </div>
                            <div className='basis-1/12'>
                                <IoSend className='md:size-8 text-blue-500 size-6' />
                            </div>

                        </div>
                        {/* chat end-here-- */}

                    </div>
                }

                {/* right side end here--- */}
            </div>
        </div>

    )
}

export default Chat