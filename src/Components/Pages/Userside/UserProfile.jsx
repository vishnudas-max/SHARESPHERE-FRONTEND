import React, { useEffect, useState } from 'react'
import Navbar from './HelperComponents/Navbar'
import { CgProfile } from "react-icons/cg";
import { MdVerified } from "react-icons/md";
import api from '../../../Config'
import { Link, useParams } from 'react-router-dom';
import { MdOutlineLockReset } from "react-icons/md";
import { baseURL } from '../../../Config';

function UserProfile() {
    const { id } = useParams()
    const access = localStorage.getItem('access')
    const [userProfile, setUserProfile] = useState(null)

    useEffect(() => {

        const fetchProfile = async () => {
            try {
                const response = await api.get(`user/profile/detailes/${id}/`, {
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
        [id, access])


    const followUser = async (username) => {
        try {
            const response = await api.post(`follow/${username}`, {}, {
                headers: {
                    Authorization: `Bearer ${access}`
                }
            });
            console.log(response.data)
            if (response.data.following_Status) {
                setUserProfile({
                    ...userProfile, is_following: response.data.following_Status
                    , followers_count: userProfile.followers_count + 1
                })
            }
            else {
                setUserProfile({
                    ...userProfile, is_following: response.data.following_Status
                    , followers_count: userProfile.followers_count - 1
                })
            }

        }
        catch (error) {
            console.log(error)
        }
    }
    return (
        <>
            <Navbar />
            <div className='md:ml-[320px] grid grid-cols-12 text-white'>
                <div className='col-span-12 h-fit grid grid-cols-12 border-b border-gray-700 py-4'>
                    <div className='col-span-4 flex'>
                        <div className='md:p-5 p-2'>
                            <CgProfile className='md:size-32 size-20' />
                        </div>

                        {userProfile && <div className='flex gap-x-1 py-3 items-start px-2 pt-8'>
                            <h1 className='md:text-3xl font-bold h-fit'>{userProfile.username}</h1>
                            {userProfile.is_verified && <MdVerified className='size-8 text-blue-500' />}
                            {userProfile.is_following ?

                                <button className='h-fit md:px-6 px-4 border border-gray-400 md:py-2 py-1 ml-2 rounded-md md:text-sm text-xs font-semibold hover:text-black hover:bg-gray-200 z-10'
                                    onClick={() => followUser(userProfile.username)}>UnFollow</button>

                                : <button className='h-fit md:px-6 px-4 border border-gray-400 md:py-2 py-1 ml-2 rounded-md md:text-sm text-xs font-semibold hover:text-black hover:bg-gray-200 z-10'
                                    onClick={() => followUser(userProfile.username)}>Follow</button>
                            }
                        </div>
                        }
                    </div>
                    {userProfile && <div className='md:col-span-8 col-span-12 px-6 justify-evenly flex items-end '>
                        <h1 className='md:text-2xl tex-xl font-semibold'>{userProfile.post_count} Posts</h1>
                        <h1 className='md:text-2xl tex-xl font-semibold'>{userProfile.followers_count} Followers</h1>
                        <h1 className='md:text-2xl tex-xl font-semibold'>{userProfile.following_count} Following</h1>
                    </div>}
                </div>

                <div className='col-span-12 px-4 py-2'>
                    {userProfile ? (
                        userProfile.is_following ? (
                            <div className="grid grid-cols-3 gap-2">
                                {userProfile.posts.length > 0 ? (
                                    userProfile.posts.map((post, index) => (
                                        <div className="col-span-1 flex justify-center border-1 border-gray-600" key={index}>
                                            <Link to={`/home/post/${post.id}`}>
                                                <img src={baseURL+post.contend} alt="post" className='max-h-52' />
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
                            <div className='flex justify-center mt-32 items-center text-gray-400'>
                                <MdOutlineLockReset className='size-24' />
                                <h1 className='md:text-5xl text-3xl'>Account is protected</h1></div>

                        )
                    ) : (
                        <div>Loading...</div>
                    )}
                </div>
            </div>
        </>
    )
}

export default UserProfile