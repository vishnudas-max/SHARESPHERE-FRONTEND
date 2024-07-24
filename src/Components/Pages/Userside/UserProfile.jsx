import React, { useEffect, useState, useCallback } from 'react'
import Navbar from './HelperComponents/Navbar'
import Loader from './HelperComponents/Loader';
import { MdVerified } from "react-icons/md";
import api from '../../../Config'
import { Link, useNavigate, useParams } from 'react-router-dom';
import { MdOutlineLockReset } from "react-icons/md";
import { BASE_URL } from '../../../secrets';
import { useDispatch } from 'react-redux';
import { Toggle_is_following } from '../../../Redux/PostSlice';
import { IoMdMore } from "react-icons/io";
import { ToastContainer, toast } from 'react-toastify';
import { FaCircleUser } from "react-icons/fa6";
import IncomingCall from './HelperComponents/IncomingCall';
import CallSocketProvider from '../../../Contexts/CallSocketProvider';
import { FaChevronLeft } from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import debounce from 'lodash/debounce';


function UserProfile() {
    const { id } = useParams()
    const dispatch = useDispatch()
    const access = localStorage.getItem('access')
    const [userProfile, setUserProfile] = useState(null)
    const [more, setMore] = useState(false)
    const [report, toggleReport] = useState(false)
    const [reason, setReason] = useState('')
    const [error, setError] = useState(null)
    const navigate = useNavigate()
    const [showFollowingOrFollwers, toggleShowFollowingorFollowers] = useState(false)
    const [showFollowing, ToggleshowFollowing] = useState(null)
    const [users, setUsers] = useState(null)
    const [searchQuery, setSearchQuery] = useState('')
    const goback = () => navigate(-1)

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
            console.log(error)
            if (error.response.data.detail) {
                toast.error(error.response.data.detail, {
                    position: "top-right",
                    autoClose: 1000,
                    hideProgressBar: true,
                    closeOnClick: true,
                    pauseOnHover: false,
                    draggable: true,
                    style: { backgroundColor: 'red', color: 'black' },
                })
                setTimeout(() => (
                    toggleReport(false)
                ), 1000)
            } else {
                toast.error('Something went wroing ! Try again later.', {
                    position: "top-right",
                    autoClose: 1000,
                    hideProgressBar: true,
                    closeOnClick: true,
                    pauseOnHover: false,
                    draggable: true,
                    style: { backgroundColor: 'red', color: 'black' },
                })
                setTimeout(() => (
                    toggleReport(false)
                ), 1000)

            }

        }
    }

    const blockuser = async () => {
        try {
            const response = await api.post('block/user/', { userID: id }, {
                headers: {
                    Authorization: `Bearer ${access}`
                }
            })
            if (response.data) {
                toast.warning(response.data, {
                    position: "top-right",
                    autoClose: 1000,
                    hideProgressBar: true,
                    closeOnClick: true,
                    pauseOnHover: false,
                    draggable: true,
                    style: { backgroundColor: 'yellow', color: 'black' },
                })
            }
        } catch (error) {
            if (error.response.data) {
                toast.warning(error.response.data, {
                    position: "top-right",
                    autoClose: 1000,
                    hideProgressBar: true,
                    closeOnClick: true,
                    pauseOnHover: false,
                    draggable: true,
                    style: { backgroundColor: 'yellow', color: 'black' },
                })
            }
        }
    }

    const fetchfollowingandfollowers = async () => {
        try {
            const response = await api.get(`get/followingorfollowers/${id}/?following=${showFollowing}&search=${searchQuery}`,
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

    const handleSearch = useCallback(debounce((query) => {
        setSearchQuery(query);
    }, 300), []);

    useEffect(() => {
        if (showFollowingOrFollwers) {
            fetchfollowingandfollowers()
        }

    }, [showFollowing, searchQuery, showFollowingOrFollwers])

    return (
        <>
            <Navbar />
            <CallSocketProvider>
                <IncomingCall />
            </CallSocketProvider>
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
                            <li className='text-sm text-red-500 mt-2 cursor-pointer font-semibold' onClick={blockuser}>Block</li>
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
                <div className='absolute left-2 top-2 md:hidden' onClick={goback}>
                    <FaChevronLeft />
                </div>

                {/* following and followers list-- */}
                {showFollowingOrFollwers &&
                    <div className=' backdrop-blur fixed left-0  right-0 h-screen z-50'>
                        <div><IoClose className='size-9 absolute right-5 top-4' onClick={() => {
                            if (showFollowing) ToggleshowFollowing(null)
                            setSearchQuery('')
                            toggleShowFollowingorFollowers(false)
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

                {userProfile ?
                    <>
                        <div className='col-span-12 h-fit grid grid-cols-12 border-b border-gray-700 py-4 pt-9'>
                            <div className='col-span-4 flex md:mb-10 mb:5'>
                                {userProfile.profile_pic ?

                                    <div className='md:p-5 p-2 shrink-0'>
                                        <img src={userProfile.profile_pic} className='md:size-28 border-[2px] border-gray-500 size-20 rounded-full' />
                                    </div> :
                                    <div className='md:p-5 p-2'>
                                        <FaCircleUser className='md:size-32 size-20' />
                                    </div>
                                }

                                <div className='flex gap-x-1 py-3 items-start px-2 pt-8'>
                                    <div className='flex flex-col'>
                                        <div className='flex gap-x-2'>
                                            <h1 className='md:text-3xl font-bold h-fit'>{userProfile.username}</h1>
                                            {userProfile.is_verified && <MdVerified className='size-8 text-blue-500' />}
                                            {userProfile.is_following ?

                                                <button className={`h-fit md:px-6 px-4 border border-gray-400 md:py-2 py-1 ml-2 rounded-md md:text-sm text-xs font-semibold hover:text-black hover:bg-gray-200 ${more ? 'md:z-10 -z-20' : 'z-10'}`}
                                                    onClick={() => followUser(userProfile.username)}>UnFollow</button>

                                                : <button className={`h-fit md:px-6 px-4 border border-gray-400 md:py-2  py-1 ml-2 rounded-md md:text-sm text-xs font-semibold hover:text-black hover:bg-gray-200 ${more ? 'md:z-10 -z-20' : 'z-10'}`}
                                                    onClick={() => followUser(userProfile.username)}>Follow</button>
                                            }
                                        </div>

                                        <div className='max-h-20 mt-2 max-w-60'>
                                            {userProfile.bio && <p className='font-thin md:text-sm text-xs whitespace-pre-line break-words'>{userProfile.bio}</p>}
                                        </div>
                                    </div>

                                </div>

                            </div>
                            <div className='md:col-span-8 col-span-12 px-6 justify-evenly flex items-end'>
                                <h1 className='md:text-2xl tex-xl font-semibold'>{userProfile.post_count} Posts</h1>
                                <h1 className='md:text-2xl tex-xl font-semibold' onClick={() => {
                                    ToggleshowFollowing(false)
                                    toggleShowFollowingorFollowers(true)
                                }}>{userProfile.followers_count} Followers</h1>
                                <h1 className='md:text-2xl tex-xl font-semibold' onClick={() => {
                                    ToggleshowFollowing(true)
                                    toggleShowFollowingorFollowers(true)
                                }}>{userProfile.following_count} Following</h1>
                            </div>
                        </div>

                        <div className='col-span-12 px-4 py-2'>

                            {userProfile.is_following || userProfile.is_currentUser_verified ? (
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
                            ) : (
                                <div className='flex justify-center mt-32 items-center text-gray-400'>
                                    <MdOutlineLockReset className='size-24' />
                                    <h1 className='md:text-5xl text-3xl'>Account is protected</h1></div>

                            )
                            }
                        </div>
                    </> :
                    <div className='col-span-12 mt-52'>
                        <Loader />
                    </div>
                }
            </div>
        </>
    )
}

export default UserProfile