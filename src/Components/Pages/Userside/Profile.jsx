import React, { useState, useEffect } from 'react'
import Navbar from './HelperComponents/Navbar'
import { useSelector } from 'react-redux'
import api from '../../../Config'
import { Link } from 'react-router-dom'
import { MdOutlineLockReset } from "react-icons/md";
import { baseURL } from '../../../Config';
import { CgProfile } from "react-icons/cg";
import { MdVerified } from "react-icons/md";
import { FaCircleUser } from "react-icons/fa6";

function Profile() {

    const userID = useSelector(state => state.authInfo.userID)
    const username = useSelector(state => state.authInfo.username)
    const access = localStorage.getItem('access')
    const [userProfile, setUserProfile] = useState(null)
    const [showFollowing, ToggleshowFollowing] = useState(false)
    const [shwoFollowers, TogglShowFollowers] = useState(false)

    useEffect(() => {
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
        fetchProfile()
    },
        [access])


    return (
        <>
            <Navbar />
            <div className='md:ml-[320px] grid grid-cols-12 text-white'>

                <div className='col-span-12 h-fit grid grid-cols-12 border-b border-gray-700 py-4'>
                    <div className='col-span-4 flex items-center'>
                        <div className='md:p-5 p-2'>
                            <CgProfile className='md:size-32 size-20' />
                        </div>
                        <h1 className='md:text-3xl font-bold h-fit'>{username}</h1>
                        {userProfile && userProfile.is_verified && <MdVerified className='size-8 text-blue-500' />}
                        <button className='h-fit md:px-6 px-4 border border-gray-400 md:py-2 py-1 ml-2 rounded-md md:text-sm text-xs font-semibold hover:text-black hover:bg-gray-200 z-10'
                        >Edit</button>
                    </div>
                    {userProfile && (
                        <div className='md:col-span-8 col-span-12 px-6 justify-evenly flex flex-col items-star'>
                            <div className='w-full flex justify-evenly items-end'>
                                <h1 className='md:text-2xl text-xl font-semibold select-none'>{userProfile.post_count} Posts</h1>

                                <div>
                                    <h1 className='md:text-2xl text-xl font-semibold select-none'
                                        onClick={() => TogglShowFollowers(!shwoFollowers)}
                                    >{userProfile.followers_count} Followers
                                    </h1>

                                    <div className={`absolute w-fit px-7 overflow-y-scroll no-scrollbar mt-2 transition-all ease-in-out delay-300  bg-[#000300] shadow-md shadow-gray-700 ${shwoFollowers ? 'max-h-64' : 'h-0'}`}>
                                        {userProfile.followers.length > 0 ?
                                            <ul className=" py-2">
                                                {userProfile.followers.map((user, index) => (
                                                    <li key={user.id} className="mt-3">
                                                        <div className='flex items-center gap-x-2 '>
                                                            {user.profile_pic ?
                                                                <img src={user.profile_pic} className='md:size-5 size-4' />
                                                                :
                                                                <FaCircleUser className='md:size-5 size-4' />}
                                                            <Link to={`/home/user/profile/${user.id}`}><p>{user.username}</p></Link>
                                                        </div>
                                                    </li>
                                                ))}
                                            </ul>
                                            :
                                            <h1 className='text-gray-600 font-semibold'>No Followers</h1>}
                                    </div>

                                </div>

                                <div className=''>
                                    <h1 className='md:text-2xl text-xl font-semibold cursor-pointer select-none'
                                        onClick={() => ToggleshowFollowing(!showFollowing)}
                                    >{userProfile.following_count} Following
                                    </h1>

                                    <div className={`absolute w-fit px-7 overflow-y-scroll no-scrollbar mt-2 transition-all ease-in-out delay-300  bg-[#000300] shadow-md shadow-gray-700 ${showFollowing ? 'max-h-64' : 'h-0'}`}>
                                        {userProfile.following.length > 0 ?
                                            <ul className=" py-2">
                                                {userProfile.following.map((user, index) => (
                                                    <li key={user.id} className="mt-3">
                                                        <div className='flex items-center gap-x-2 '>
                                                            {user.profile_pic ?
                                                                <img src={user.profile_pic} className='md:size-5 size-4' />
                                                                :
                                                                <FaCircleUser className='md:size-5 size-4' />}
                                                            <Link to={`/home/user/profile/${user.id}`}><p>{user.username}</p></Link>
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


                </div>
            </div>

            <div className='col-span-12 md:ml-[320px] px-6 py-2'>
                {userProfile ? (

                    <div className="grid grid-cols-3 gap-2">
                        {userProfile.posts.length > 0 ? (
                            userProfile.posts.map((post, index) => (
                                <div className="col-span-1 flex justify-center border-1 border-gray-600" key={index}>
                                    <Link to={`/home/post/${post.id}`}>
                                        <img src={baseURL + post.contend} alt="post" className='max-h-52' />
                                    </Link>
                                </div>
                            ))
                        ) : (
                            <div className="col-span-3 flex justify-center border-1 border-gray-600">
                                <p className='md:text-5xl text-3xl font-bold text-gray-500 mt-20'>No posts available</p>
                            </div>
                        )}
                    </div>

                ) : (
                    <div>Loading...</div>
                )}
            </div>

        </>
    )
}

export default Profile