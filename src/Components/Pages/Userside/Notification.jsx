import React, { useEffect } from 'react'
import Navbar from './HelperComponents/Navbar'
import { useDispatch, useSelector } from 'react-redux';
import { fetchNotifications, followback } from '../../../Redux/NotificationSlice'
import { Link } from 'react-router-dom';
import api from '../../../Config'
import { FaCircleUser } from "react-icons/fa6";
import IncomingCall from './HelperComponents/IncomingCall';
import CallSocketProvider from '../../../Contexts/CallSocketProvider';

const BASE_URL = process.env.REACT_APP_BASE_URL


function Notification() {
    const status = useSelector(state => state.notifications.status)
    const notifications = useSelector(state => state.notifications.notifications)
    const errors = useSelector(state => state.notifications.error)
    const dispatch = useDispatch()
    const access = localStorage.getItem('access')

    const readnotifications = async () => {
        try {
            const response = await api.post(`user/notifications/`, {}, {
                headers: {
                    Authorization: `Bearer ${access}`
                }
            })
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        if (status === 'idle') {
            dispatch(fetchNotifications())
        }
        readnotifications()
    },
        [status])

    const followuser = async (username, date, idx) => {

        try {
            const response = await api.post(`follow/${username}`, {}, {
                headers: {
                    Authorization: `Bearer ${access}`
                }
            });
            dispatch(followback({ date, idx }))
        }
        catch (error) {
            console.log(error)
        }
    }

    const currentDate = new Date();

    // Extracting date components
    const day = currentDate.getDate().toString().padStart(2, '0'); // Pad with zero if single digit
    const month = (currentDate.getMonth() + 1).toString().padStart(2, '0'); // Month is zero-based
    const year = currentDate.getFullYear();

    // Creating the formatted date string
    const formattedDate = `${month}/${day}/${year}`;
    return (
        <>
            <Navbar />
            <CallSocketProvider>
                <IncomingCall />
            </CallSocketProvider>
            <div className='text-white md:ml-[320px] max-w-full  h-screen'>
                <div className='w-full h-25  py-3 md:py-5  pl-3 border-b border-gray-600 sticky top-0 bg-black'>
                    <h1 className='text-xl font-semibold md:text-3xl md:font-bold'>Notificaion</h1>
                </div>
                <div className=' max-w-[800px] pl-2 max-h-[600px] overflow-y-scroll no-scrollbar  '>
                    {status !== 'loading' ? (
                        Object.keys(notifications).length < 1 ? (
                            <div className='w-full flex justify-center pt-20 text-3xl font-semibold text-gray-400'>No Notifications</div>
                        ) : (
                            Object.keys(notifications).map((date, index) => (
                                <div className='mt-5 w-full' key={index}>
                                    <h1 className='text-xl md:text-2xl font-semibold'>
                                        {formattedDate === date ? 'Today' : date}
                                    </h1>
                                    {notifications[date].map((not, idx) => (


                                        <div className='flex justify-between bg-gray-900 mt-3 h-14 mr-3 rounded-md px-2 items-center' key={idx}>
                                            <Link to={not.notification_type === 'follow' ? `/home/user/profile/${not.invoked_user.id}`
                                                : not.notification_type === 'verification' ? '/home/profile/more/' : `/home/post/${not.postID ? not.postID.id : ''}`}>
                                                <div className='max-w-[full] flex gap-x-2 items-center'>
                                                    {not.notification_type !== 'verification' &&
                                                        <div>
                                                            {not.invoked_user.profile_pic ?
                                                                <div className='shrink-0 h-fit w-fit'>
                                                                    <img src={not.invoked_user.profile_pic} alt="profile" className='size-9 rounded-full border-[1px] border-gray-500' />
                                                                </div>
                                                                :
                                                                <FaCircleUser className='size-9' />
                                                            }
                                                        </div>}
                                                    <p className={`
                                                    ${not.notification_type === 'verification' ?
                                                            'max-w-full md:text-[16px] text-sm pl-2'
                                                            :
                                                            'max-w-[400px] md:text-[17px] text-sm'
                                                        }`
                                                    }
                                                    >{not.message}</p>
                                                </div>
                                            </Link>
                                            {
                                                (not.notification_type === 'follow' && !not.is_following) ? (
                                                    <button className='border md:text-sm text-xs border-gray-200 rounded-md py-1 px-3' onClick={() => followuser(not.invoked_user.username, date, idx)}>
                                                        Follow back
                                                    </button>
                                                ) : (
                                                    not.postID && not.postID.contend &&

                                                    <img src={not.postID.contend} alt="post" className='max-w-16 max-h-full pt-1 pb-1 my-2 rounded-md' />

                                                )
                                            }
                                        </div>

                                    ))}
                                </div>
                            ))
                        )

                    )
                        :
                        Array(3).fill().map((_, index) => (
                            <div className='mt-5 w-full' key={index}>
                                <div className='w-32 rounded-md animate-pulse h-10 bg-gray-600'></div>
                                {Array(2).fill().map((_, idx) => (
                                    <div className='flex animate-pulse justify-between bg-gray-800 mt-3 h-14 mr-3 rounded-md px-2 items-center'>
                                        <div className='w-80 h-5 animate-pulse rounded-md  bg-gray-600'></div>
                                        <div className='w-14 h-3 rounded-md animate-pulse bg-gray-600'></div>
                                    </div>
                                ))}
                            </div>
                        ))
                    }
                </div>
            </div>
        </>
    )
}

export default Notification