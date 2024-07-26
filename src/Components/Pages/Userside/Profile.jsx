import React, { useState, useEffect, useCallback } from 'react'
import Navbar from './HelperComponents/Navbar'
import { useSelector } from 'react-redux'
import api from '../../../Config'
import { Link } from 'react-router-dom'
import { MdVerified } from "react-icons/md";
import { FaCircleUser } from "react-icons/fa6";
import { FaUserEdit } from "react-icons/fa";
import Loader from './HelperComponents/Loader'
import CallSocketProvider from '../../../Contexts/CallSocketProvider'
import IncomingCall from './HelperComponents/IncomingCall'
import { IoClose } from "react-icons/io5";
import debounce from 'lodash/debounce';

const BASE_URL = process.env.REACT_APP_BASE_URL

function Profile() {

    const userID = useSelector(state => state.authInfo.userID)
    const username = useSelector(state => state.authInfo.username)
    const access = localStorage.getItem('access')
    const [userProfile, setUserProfile] = useState(null)
    const [showFollowingOrFollwers, toggleShowFollowingorFollowers] = useState(false)
    const [showFollowing, ToggleshowFollowing] = useState(null)
    const [users, setUsers] = useState(null)
    const [searchQuery, setSearchQuery] = useState('')


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

    const fetchfollowingandfollowers = async () => {
        try {
            const response = await api.get(`get/followingorfollowers/${userID}/?following=${showFollowing}&search=${searchQuery}`,
                {
                    headers: {
                        Authorization: `Bearer ${access}`
                    }
                })
            setUsers(response.data)
            console.log(response)
        } catch (error) {
            toggleShowFollowingorFollowers(false)
            ToggleshowFollowing(false)
        }
    }

    useEffect(() => {
        if (showFollowingOrFollwers) {
            fetchfollowingandfollowers()
        }

    }, [showFollowing, searchQuery,showFollowingOrFollwers])


    const handleSearch = useCallback(debounce((query) => {
        setSearchQuery(query);
    }, 300), []);

    return (
        <>
            <Navbar />
            <CallSocketProvider>
                <IncomingCall />
            </CallSocketProvider>
            <div className='md:ml-[320px] grid grid-cols-12 text-white'>

                {/* following and followers list-- */}
                {showFollowingOrFollwers &&
                    <div className=' backdrop-blur fixed left-0  right-0 h-screen '>
                        <div><IoClose className='size-9 absolute right-5 top-4' onClick={() => {
                            if (showFollowing) ToggleshowFollowing(null)
                            toggleShowFollowingorFollowers(false)
                            setSearchQuery('')
                        }} />
                        </div>
                        <div className='md:max-w-[450px] max-w-[300px] px-3 pt-3 pb-3 relative h-fit bg-gray-900 mx-auto mt-20 '>
                            <div className='sticky top-0 h-fit'>

                                <div className='grid-cols-2 grid select-none'>
                                    <h1 className={`col-span-1 text-center md:text-xl  ${showFollowing ? 'text-white' : 'text-gray-600'}`} onClick={() => {

                                        ToggleshowFollowing(true)
                                    }}>Following</h1>

                                    <h1 className={`col-span-1 text-center md:text-xl ${!showFollowing ? 'text-white' : 'text-gray-600'}`} onClick={() => {
                                        ToggleshowFollowing(false)

                                    }}>Followers</h1>

                                </div>
                                <div className='w-full px-2'>
                                    <input type="text" placeholder='Search by username or email..' className=' w-full  mt-5 mb-3 outline-none bg-transparent border-b md:text-[15px] text-[12px]' onChange={(e) => handleSearch(e.target.value)} />
                                </div>
                            </div>
                            <div className='flex flex-col  overflow-y-scroll no-scrollbar  md:max-h-[400px] max-h-[280px]'>
                                {users && users.length > 0 ? (
                                   <ul className=" py-2">
                                        {users.map((user, index) => (
                                            <li key={user.id} className="mt-3">
                                                <div className='flex items-center gap-x-2 ml-3 '>
                                                    {user.profile_pic ?
                                                        <img src={BASE_URL + user.profile_pic} className='md:size-10 size-8 border border-gray-300  rounded-full' />
                                                        :
                                                        <FaCircleUser className='md:size-9 size-8' />}
                                                    <Link to={`/home/user/profile/${user.id}`}><p className='text-sm md:text-[16px] h-fit'>{user.username}</p></Link>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                    )
                                    :
                                    (
                                        <p className="text-center text-gray-400 mt-5">No users found</p>
                                    )
                                }

                            </div>
                        </div>
                    </div>
                }

                {
                    userProfile ?
                        <div className='col-span-12 h-fit grid grid-cols-12 border-b border-gray-700 py-4 '>
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
                                        <h1 className='md:text-3xl font-bold h-fit'>{userProfile.username}</h1>
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
                                                onClick={() => {
                                                    ToggleshowFollowing(false)
                                                    toggleShowFollowingorFollowers(true)
                                                }}
                                            >{userProfile.followers_count} Followers
                                            </h1>

                                           
                                        </div>

                                        <div className=''>
                                            <h1 className='md:text-2xl text-sm font-semibold cursor-pointer select-none'
                                                onClick={() => {
                                                    ToggleshowFollowing(true)
                                                    toggleShowFollowingorFollowers(true)
                                                }}
                                            >{userProfile.following_count} Following
                                            </h1>

                                            

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

                    <div className="grid md:grid-cols-3 grid-cols-2 gap-2">
                        {userProfile.posts.length > 0 ? (
                            userProfile.posts.map((post, index) => (
                                <div className="col-span-1 flex justify-center border-1 border-gray-600 h-fit" key={index}>
                                    <Link to={`/home/post/${post.id}`}>
                                        <img src={BASE_URL + post.contend} alt="post" className='h-fit' />
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