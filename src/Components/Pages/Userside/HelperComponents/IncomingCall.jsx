import React, { useContext, useEffect, useState } from 'react'
import { FaUserCircle } from "react-icons/fa";
import { IoCall } from "react-icons/io5";
import { CallContext } from '../.././../../Contexts/CallSocketProvider'
import { CLIENT_BASE_RUL } from '../../../../secrets';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

function IncomingCall() {
    const { ws } = useContext(CallContext)
    const [showcall, toggleCall] = useState(false)
    const navigate = useNavigate()
    const [roomID, setRoomID] = useState(null)
    const currentusername = useSelector(state => state.authInfo.username)

    if (ws) {
        ws.onmessage = (event) => {
            const message = JSON.parse(event.data);
            if (currentusername === message.targetUser) {
                setRoomID({'roomID':message.roomID,'targetUser':message.targetUser})
                toggleCall(true)
            }


        };

    }

    const acceptCall = () => {
        toggleCall(false)
        
        navigate(`/home/chat/videocall/${roomID.targetUser}?roomID=${roomID.roomID}`)
    }

    return (
        <>
            {showcall &&
                <div className='fixed z-50 left-0 h-full top-0 right-0 bg-transparentx`'>
                    <div className='h-fit backdrop-blur-2xl fixed top-0 w-full py-3 mx-auto'> 
                    <div className='z-[100] flex bg-gray-900 mx-auto md:h-fit w-[300px] md:w-[500px] px-6 py-2 rounded-full justify-between mt-3 items-center'>
                        <div>
                            <FaUserCircle className='size-10 md:size-16 border-[1px] border-gray-300 rounded-full' />
                        </div>
                        <div className='flex gap-x-3'>
                            <div className='bg-red-600 size-10 md:size-16 flex justify-center cursor-pointer items-center rounded-full '>
                                <IoCall className='size-7' onClick={() => toggleCall(false)} />
                            </div>
                            <div className='bg-green-600 size-10 md:size-16 flex justify-center items-center rounded-full '>
                                <IoCall className='size-7' onClick={acceptCall} />
                            </div>
                        </div>
                    </div>
                    </div>
                </div>
            }
        </>
    )
}


export default IncomingCall