import React, { useEffect, useState } from 'react'
import Navbar from './HelperComponents/Navbar'
import { CgProfile } from "react-icons/cg";
import { MdVerified } from "react-icons/md";
import api from '../../../Config'
import { Link, useParams } from 'react-router-dom';
import { MdOutlineLockReset } from "react-icons/md";
import { baseURL } from '../../../Config';
import { useDispatch } from 'react-redux';
import { Toggle_is_following } from '../../../Redux/PostSlice';
import { IoMdMore } from "react-icons/io";
import { ToastContainer, toast } from 'react-toastify';

function UserProfile() {
    const { id } = useParams()
    const dispatch = useDispatch()
    const access = localStorage.getItem('access')
    const [userProfile, setUserProfile] = useState(null)
    const [more, setMore] = useState(false)
    const [report, toggleReport] = useState(false)
    const [reason, setReason] = useState('')
    const [error, setError] = useState(null)

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
            dispatch(Toggle_is_following(username))
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

    const handleReport = e => {
        setReason(e.target.value)
    }

    const SubmitREport = async () => {
        if (reason === '') {
            setError('You cannot report a user without a valid reason !')
            setTimeout(() => (
                setError('')
            ), 2000)
            return false
        }
        let data = {
            "reported_user": id,
            "report_reason": reason
        }
        try {
            const response = await api.post('report/', data, {
                headers: {
                    Authorization: `Bearer ${access}`
                }
            })
            toast.success('Reported', {
                position: "top-right",
                autoClose: 1000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: false,
                draggable: true,
                style: { backgroundColor: 'green', color: 'black' },
            })
            setTimeout(() => (
                toggleReport(false)
            ), 1000)
        } catch (error) {
            setError('something went wrong')
        }
    }

    return (
        <>
            <Navbar />
            <div className='md:ml-[320px] grid grid-cols-12 text-white'>

                <ToastContainer />
                <div className='absolute right-0'>
                    <IoMdMore className='absolute right-5 size-8 top-4 cursor-pointer' onClick={() => {
                        if (more === true & report === true) {
                            toggleReport(false)
                        }
                        setMore(prev => !prev)
                    }} />

                    <div className={`flex mt-8  bg-gray-900 mr-10 py-1 px-2  transition-all delay-100  rounded-tl-xl rounded-bl-xl rounded-br-xl
                    z-50
                    ease-in-out
                    ${more ? 'scale-100' : 'scale-0'}`}>
                        <ul className='px-7 py-4 select-none  bg-gray-900 h-fit  '>
                            <li className='text-sm text-red-500 mt-2 cursor-pointer font-semibold'>Block</li>
                            <li className='text-sm text-red-500 mt-2 cursor-pointer font-semibold' onClick={() => toggleReport(pre => !pre)}>Report</li>
                        </ul>

                    </div>
                </div>

                <div className={`'w-fit  px-5 py-5 absolute z-20 flex-col flex gap-4 bg-gray-900 mr-2 mt-20 
                    transition-all delay-100 ease-in-out ' ${report ? 'scale-100' : 'scale-0'} md:top-10 md:right-36 top-20 ml-2 `}>

                    <div className='flex items-center gap-x-2'>
                        <input type="radio" name="report_reason" value="Posting irrelevant or repetitive content" onChange={e => handleReport(e)} />
                        <p className='text-sm font-thin'> Spam: Posting irrelevant or repetitive content.</p>
                    </div>

                    <div className='flex items-center  gap-x-2'>
                        <input type="radio" name="report_reason" value="Promoting or inciting violence" onChange={e => handleReport(e)} />
                        <p className='text-sm font-thin'> Violence: Promoting or inciting violence.</p>
                    </div>

                    <div className='flex items-center  gap-x-2'>
                        <input type="radio" name="report_reason" value="Spreading false or misleading information" onChange={e => handleReport(e)} />
                        <p className='text-sm font-thin'> False Information: Spreading false or misleading information.</p>
                    </div>

                    <div className='flex items-center  gap-x-2'>
                        <input type="radio" name="report_reason" value="Sharing personal information without consent" onChange={e => handleReport(e)} />
                        <p className='text-sm font-thin'>  Privacy Violation: Sharing personal information without consent.</p>
                    </div>

                    <div className='flex items-center  gap-x-2'>
                        <input type="radio" name="report_reason" value="Attempting to scam or defraud others" onChange={e => handleReport(e)} />
                        <p className='text-sm font-thin'> Scams and Fraud: Attempting to scam or defraud others.</p>
                    </div>

                    <div className='flex items-center  gap-x-2'>
                        <input type="radio" name="report_reason" value="Sharing offensive or explicit material" onChange={e => handleReport(e)} />
                        <p className='text-sm font-thin'>  Inappropriate Content: Sharing offensive or explicit material.</p>
                    </div>

                    <div className='flex items-center gap-x-2'>
                        <button className='bg-red-500 px-4 rounded-md mx-auto py-1' onClick={SubmitREport}>Report</button>
                    </div>
                    {error && <p className='text-center text-red-500 text-sm'>{error}</p>}

                </div>

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

                                : <button className={`'h-fit md:px-6 px-4 border border-gray-400 md:py-2 py-1 ml-2 rounded-md md:text-sm text-xs font-semibold hover:text-black hover:bg-gray-200 '${more ? 'md:z-10 -z-20' : 'z-10'}`}
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