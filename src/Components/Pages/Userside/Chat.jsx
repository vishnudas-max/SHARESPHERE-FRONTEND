import React, { useState, useEffect } from 'react'
import Navbar from './HelperComponents/Navbar'
import { AiOutlineSearch } from 'react-icons/ai'
import { FaCircleUser, FaVideo, FaFaceSmile } from "react-icons/fa6";
import { IoMdMore } from "react-icons/io";
import { IoSend } from "react-icons/io5";
import api from '../../../Config'
import { useSelector } from 'react-redux';
import { useRef } from 'react';
import Picker from 'emoji-picker-react';
import { RiArrowLeftWideLine } from "react-icons/ri";




function Chat() {


    const [currentChatRoom, setChatRoom] = useState(null)
    const [chatMessages, setChatMessages] = useState(null)
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [socket, setSocket] = useState(null);
    // const socket = use
    const chatEndRef = useRef(null);
    const [onlineUsers, setOnlineUsers] = useState([]);
    const [typingStatus, setTypingStatus] = useState('');
    // const [message, setMessage] = useState('')
    const currentUser = useSelector(state => state.authInfo.userID)
    const currentUsername = useSelector(state => state.authInfo.username)
    const message = useRef('')
    const [users, setUsers] = useState(null)

    useEffect(() => {
        // Scroll to the bottom of the chat messages div
        if (chatEndRef.current) {
            chatEndRef.current.scrollTop = chatEndRef.current.scrollHeight;
        }
    }, [chatMessages, currentChatRoom]);

    // establishing connection--
    const ConnectRoom = (userID) => {
        const access = localStorage.getItem('access');
        const newSocket = new WebSocket(`ws://127.0.0.1:8000/ws/chat/${userID}/?token=${access}`);

        newSocket.onopen = () => {
            console.log('WebSocket connection established.');
            newSocket.send(JSON.stringify({
                'type': 'user_online',
                'username': currentUsername
            }));
        };

        newSocket.onerror = (error) => {
            console.error('WebSocket error:', error);
        };

        setSocket(newSocket);
    };


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

    const scrollToBottom = () => {
        if (chatEndRef.current) {
            chatEndRef.current.style.background = chatEndRef;
        }
    };

    // fetching users for chat--
    useEffect(() => {
        if (users === null) {
            fetchUsers()
        }
        scrollToBottom()

    }, [])


    const handleChat = async (index, username, userID) => {
        ConnectRoom(userID);
        if (currentChatRoom === null) {
            setChatRoom({ 'id': index, 'user': username, 'userID': userID })
        }
        else if (currentChatRoom !== null && currentChatRoom.username !== username) {
            setChatRoom({ 'id': index, 'user': username, 'userID': userID })
        } else {
            setChatRoom(currentChatRoom)
        }
    };



    // sending message --
    const sendMessage = () => {
        console.log(message.current.value)
        if (socket) {
            socket.send(JSON.stringify({
                'type': 'chat_message',
                'message': message.current.value,
                'username': currentUsername
            }));
            message.current.value = ''

        }
    }

    useEffect(() => {
        if (socket) {
            socket.onmessage = (event) => {
                const data = JSON.parse(event.data);

                if (data.type === 'chat_history') {
                    setChatMessages(data.messages);
                } else if (data.type === 'chat_message') {
                    setChatMessages(prevMessages => [...prevMessages, data]);
                } else if (data.type === 'user_typing') {
                    setTypingStatus(data.username);
                    setTimeout(() => {
                        setTypingStatus('');
                    }, 1000);
                } else if (data.type === 'user_online') {
                    setOnlineUsers(prevUsers => {
                        if (!prevUsers.includes(data.username)) {
                            return [...prevUsers, data.username];
                        }
                        return prevUsers;
                    });
                } else if (data.type === 'user_offline') {
                    setOnlineUsers(prevUsers => prevUsers.filter(user => user !== data.username));
                }
            };

            socket.onclose = () => {
                socket.send(JSON.stringify({
                    'type': 'user_offline',
                    'username': currentUsername
                }));
                // setChatRoom('');
            };
        }

        return () => {
            if (socket && socket.readyState === WebSocket.OPEN) {
                socket.send(JSON.stringify({
                    'type': 'user_offline',
                    'username': currentUsername
                }));
                socket.close();
            }
        };
    }, [socket]);

    const handleTyping = () => {
        if (socket) {
            socket.send(JSON.stringify({
                'type': 'user_typing',
                'username': currentUsername
            }));
        }
    };

    const onEmojiClick = (emojiData, event) => {
        if (message.current) {
            message.current.value += emojiData.emoji;
            console.log(emojiData.emojiUrl)
        }
        setShowEmojiPicker(false);
    };

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
                                <div className='px-2 border-b border-gray-800 h-16 flex' key={index} onClick={() => handleChat(index, user.username, user.id)}>
                                    <div className='h-full flex items-center'>
                                        <FaCircleUser className='md:size-10 size-7' />
                                    </div>
                                    <div className=' px-2 w-full grid grid-rows-2 py-2'>
                                        <h3 className='text-md font-normal w-fit row-span-1 '>{user.username}</h3>
                                        <div className='flex justify-between'>
                                            <p className='md:text-sm text-xs py-1 md:py-0 row-span-1 max-w-28 line-clamp-1 text-gray-300 '>{user.last_message.message ? user.last_message.message : 'start message'}</p>
                                            <p className='text-xs row-span-1 max-w-28 text-gray'>{user.last_message ? user.last_message.time : ''}</p>
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
                    <div className='md:col-span-7 h-screen col-span-12 bg-gray-700'>
                        {/* chat head-- */}
                        <div className='flex justify-between bg-gray-800 md:h-20  h-16 sticky top-0'>
                        
                            {/* left side-- */}
                            <div className='flex gap-x-1 items-center ps-3 justify-between'>
                                <RiArrowLeftWideLine  className='size-10 cursor-pointer' onClick={()=>setChatRoom(null)}/>
                                <div className='h-fit'>
                                    <FaCircleUser className='md:size-16 size-12' />
                                </div>
                                <div className='grid grid-rows-2'>
                                    <div className='flex'>
                                        <h1 className='row-span-1 md:text-xl text-md h-fit font-semibold'>{currentChatRoom.user}</h1>
                                        {onlineUsers.includes(currentChatRoom.user) ? <h1>Online</h1> : <h1>Offline</h1>}
                                    </div>

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
                        <div ref={chatEndRef} className="h-[520px] md:h-[590px] bg-gray-700 px-3  grid-cols-2 overflow-y-scroll no-scrollbar pb-3 ">
                            {chatMessages && chatMessages.map((message, index) => (
                                <div
                                    key={index}
                                    className={`flex ${message.sender_id === currentUser ? 'justify-end col-span-2' : 'justify-start col-span-2'}`}
                                >
                                    <div className={`bg-gray-900 px-2 mt-2 flex items-start min-h-[40px] gap-x-2 rounded-tr-2xl h-fit rounded-bl-2xl rounded-md max-w-[50%]`}>
                                        <div className="flex-col py-[7px] ">
                                            <p className="row-span-1 text-sm break-all  ">{message.message}</p>
                                            <p className="row-span-1 text-[10px] text-gray-400 w-full text-right">{message.time}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {typingStatus === currentChatRoom.user &&
                                <div className=" text-black ">typing...</div>
                            }
                            {console.log(`${currentChatRoom} usename, ${typingStatus} status`)}

                        </div>

                        <div className='px-3 pt-1 md:sticky  fixed w-full  md:bottom-0 bottom-12 bg-gray-700'>
                            <div className='flex border border-white py-2 rounded-lg px-3 items-center gap-x-2'>
                                <div className='basis-11/12 flex '>
                                    {showEmojiPicker && (
                                        <div className="absolute bottom-20">
                                            <Picker onEmojiClick={onEmojiClick} />
                                        </div>
                                    )}
                                    <div>
                                        <FaFaceSmile color='yellow' className='md:size-6 size-5' onClick={() => setShowEmojiPicker(!showEmojiPicker)} />
                                    </div>
                                    <input
                                        onKeyDown={handleTyping}
                                        type="text" ref={message} placeholder='text here....' className='bg-transparent w-full pl-2 outline-none  text-sm' />
                                </div>
                                <div className='basis-1/12'>
                                    <IoSend className='md:size-8 text-blue-500 size-6' onClick={sendMessage} />
                                </div>
                            </div>

                        </div>

                        {/* chat end-here-- */}

                    </div>
                }

                {/* right side end here--- */}
            </div>
        </div >

    )
}

export default Chat