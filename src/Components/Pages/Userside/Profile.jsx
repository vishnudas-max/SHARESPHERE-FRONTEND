import React, { useState, useEffect } from 'react'
import Navbar from './HelperComponents/Navbar'
import { useSelector } from 'react-redux'
import api from '../../../Config'
import { Link } from 'react-router-dom'
import { BASE_URL } from '../../../secrets'
import { MdVerified } from "react-icons/md";
import { FaCircleUser } from "react-icons/fa6";
import { FaUserEdit } from "react-icons/fa";
import Loader from './HelperComponents/Loader'
import CallSocketProvider from '../../../Contexts/CallSocketProvider'
import IncomingCall from './HelperComponents/IncomingCall'

function Profile() {

    const userID = useSelector(state => state.authInfo.userID)
    const username = useSelector(state => state.authInfo.username)
    const access = localStorage.getItem('access')
    const [userProfile, setUserProfile] = useState(null)
    const [showFollowing, ToggleshowFollowing] = useState(false)
    const [shwoFollowers, TogglShowFollowers] = useState(false)

    const fetchProfile = async () => {
        try {
            const response = await api.get(`user/profile/detailes/${userID}/`, {
                headers: {
                    Authorization: `Bearer ${access}`
                }
            })
            setUserProfile(response.data)
            console.log(response.data)
        }
        catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        fetchProfile()
    },
        [access])

    useEffect(() => {
        const followwebsocket = new WebSocket(`ws://127.0.0.1:8000/ws/follow/?token=${access}`);
        console.log(followwebsocket)
        followwebsocket.onopen = () => {
            console.log('WebSocket connection established.');
        };

        followwebsocket.onerror = (error) => {
            console.error('WebSocket error:', error);
        };

        followwebsocket.onmessage = (event) => {
            console.log('WebSocket message received:', event.data);
            try {
                const data = JSON.parse(event.data);
                console.log('Parsed message:', data);
                if (data.type === 'follow_message') {
                    console.log('Follow message:', data.message);
                    fetchProfile()
                }
            } catch (error) {
                console.error('Error parsing message:', error);
            }
        };

        return () => followwebsocket.close()
    },
        [])


    return (
        <>
            <Navbar />
            <CallSocketProvider>
                <IncomingCall />
            </CallSocketProvider>
            <div className='md:ml-[320px] grid grid-cols-12 text-white'>

                {
                    userProfile ?
                        <div className='col-span-12 h-fit grid grid-cols-12 border-b border-gray-700 py-4'>
                            <div className='col-span-12 md:col-span-5 flex items-center'>
                                {userProfile ? (userProfile.profile_pic ?
                                    <div className='md:p-5 p-2 shrink-0'>
                                        <img src={userProfile.profile_pic} alt="profile" className='rounded-full md:size-24 size-20  border-[2px] border-gray-500' />
                                    </div>
                                    :
                                    <div className='md:p-5 p-2'>
                                        <FaCircleUser className='md:size-32 size-20' />
                                    </div>
                                ) :
                                    <div className='md:p-5 p-2'>
                                        <FaCircleUser className='md:size-32 size-20' />
                                    </div>


                                }
                                <div>
                                    <div className='flex'>
                                        <h1 className='md:text-3xl font-bold h-fit'>{username}</h1>
                                        {userProfile && userProfile.is_verified && <MdVerified className='md:size-8 size-5 text-blue-500' />}
                                        <div>
                                            <Link to={'/home/profile/edit/'}><FaUserEdit className='md:size-9 ml-2 size-5 cursor-pointer' /></Link>
                                        </div>
                                    </div>
                                    <div className='max-h-20 mt-2 max-w-60 '>
                                        {userProfile && userProfile.bio && <p className='font-thin md:text-sm text-xs whitespace-pre-line break-words mr-2' >{userProfile.bio}</p>}
                                    </div>

                                </div>


                            </div>

                            {userProfile && (
                                <div className='md:col-span-6 mt-5 col-span-12 px-6 justify-evenly flex flex-col items-star md:mt-32'>
                                    <div className='w-full flex justify-evenly items-end'>
                                        <h1 className='md:text-2xl text-sm font-semibold select-none'>{userProfile.post_count} Posts</h1>

                                        <div>
                                            <h1 className='md:text-2xl text-sm font-semibold select-none'
                                                onClick={() => TogglShowFollowers(!shwoFollowers)}
                                            >{userProfile.followers_count} Followers
                                            </h1>

                                            <div className={`absolute w-fit md:px-7 px-2 overflow-y-scroll no-scrollbar mt-2 transition-all ease-in-out delay-500  bg-[#000300] shadow-md shadow-gray-700 ${shwoFollowers ? 'md:max-h-64 max-h-32 ' : 'h-0 '}`}>
                                                {userProfile.followers.length > 0 ?
                                                    <ul className=" py-2">
                                                        {userProfile.followers.map((user, index) => (
                                                            <li key={user.id} className="mt-3">
                                                                <div className='flex items-center gap-x-2 '>
                                                                    {user.profile_pic ?
                                                                        <img src={BASE_URL + user.profile_pic} className='md:size-5 size-4 rounded-full' />
                                                                        :
                                                                        <FaCircleUser className='md:size-5 size-4' />}
                                                                    <Link to={`/home/user/profile/${user.id}`}><p className='text-xs md:text-sm'>{user.username}</p></Link>
                                                                </div>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                    :
                                                    <h1 className='text-gray-600 font-semibold'>No Followers</h1>}
                                            </div>

                                        </div>

                                        <div className=''>
                                            <h1 className='md:text-2xl text-sm font-semibold cursor-pointer select-none'
                                                onClick={() => ToggleshowFollowing(!showFollowing)}
                                            >{userProfile.following_count} Following
                                            </h1>

                                            <div className={`absolute w-fit md:px-7 px-2 overflow-y-scroll no-scrollbar mt-2 transition-all ease-in-out delay-300  bg-[#000300] shadow-md shadow-gray-700 ${showFollowing ? 'md:max-h-64 max-h-32' : 'h-0'}`}>
                                                {userProfile.following.length > 0 ?
                                                    <ul className=" py-2">
                                                        {userProfile.following.map((user, index) => (
                                                            <li key={user.id} className="mt-3">
                                                                <div className='flex items-center gap-x-2 '>
                                                                    {user.profile_pic ?
                                                                        <img src={BASE_URL + user.profile_pic} className='md:size-5 size-4 rounded-full' />
                                                                        :
                                                                        <FaCircleUser className='md:size-5 size-4' />}
                                                                    <Link to={`/home/user/profile/${user.id}`}><p className='text-xs md:text-sm'>{user.username}</p></Link>
                                                                </div>
                                                            </li>
                                                        ))}
                                                    </ul> :
                                                    <h1 className='text-gray-600 font-semibold'>Following Empty</h1>
                                                }
                                            </div>

                                        </div>

                                    </div>
                                </div>
                            )}


                        </div> :
                        <div className='col-span-12 flex justify-center  pt-52'> <Loader /></div>

                }
            </div>


            <div className='col-span-12 md:ml-[320px] px-6 py-2 md:mt-14'>
                {userProfile ? (

                    <div className="grid grid-cols-3 gap-2">
                        {userProfile.posts.length > 0 ? (
                            userProfile.posts.map((post, index) => (
                                <div className="col-span-1 flex justify-center border-1 border-gray-600" key={index}>
                                    <Link to={`/home/post/${post.id}`}>
                                        <img src={BASE_URL + post.contend} alt="post" className='max-h-52' />
                                    </Link>
                                </div>
                            ))
                        ) : (
                            <div className="col-span-3 flex justify-center border-1 border-gray-600">
                                <p className='md:text-5xl text-3xl font-bold text-gray-500 mt-20'>No posts available</p>
                            </div>
                        )}
                    </div>
                )
                    :
                    <div>Loading...</div>
                }
            </div>

        </>
    )
}

export default Profile