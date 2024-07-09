import React, { useEffect, useState } from 'react'
import Navbar from './HelperComponents/Navbar'
import api from '../../../Config'
import { useSelector } from 'react-redux'
import Loader from './HelperComponents/Loader'
import { FaCircleUser } from "react-icons/fa6";
import { PiImageFill } from "react-icons/pi";
import { useNavigate } from 'react-router-dom'

function ProfileEdit() {

    const [userProfile, setUserProfile] = useState(null)
    const access = localStorage.getItem('access')
    const userID = useSelector(state => state.authInfo.userID)
    const [profile_pic, setProfilePic] = useState(null)
    const [username, setUsername] = useState('')
    const [bio, setBio] = useState('')
    const navigate = useNavigate()

    const fetchProfile = async () => {
        try {
            const response = await api.get(`user/profile/detailes/${userID}/`, {
                headers: {
                    Authorization: `Bearer ${access}`
                }
            })
            setUserProfile(response.data)
            setBio(response.data.bio)
            // setProfilePic(response.data.profile_pic)
            setUsername(response.data.username)
            console.log(response.data)
        }
        catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        if (userProfile === null) {
            fetchProfile()
        }
    },
        [])

    const handleFileUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            setProfilePic(file)
        }
    };

    const updateProfile = async () => {
        try {
            const formData = new FormData();
            if(profile_pic){
                formData.append('profile_pic', profile_pic);
            }
            formData.append('username', username);
            
            formData.append('bio', bio);

            const response = await api.patch(`user/profile/detailes/${userID}/`, formData, {
                headers: {
                    Authorization: `Bearer ${access}`,
                    "Content-Type":'multipart/form-data'
                }
            })
            navigate('/home/profile/')

        }
        catch (error) {
            alert('something went wrong!')
            console.log(error)
        }
    }

    return (
        <>
            <Navbar />
            <div className='md:ml-[320px] grid grid-cols-12 text-white'>
                {
                    userProfile ?
                        <>
                            <div className='col-span-12 pt-3 py-5 border-b border-gray-500 pl-5 md:text-2xl text-xl font-semibold'>Edit Profile</div>
                            <div className='col-span-12 px-4 py-2 '>
                                <div className='w-full bg-zinc-900 rounded-3xl h-32 flex px-5 items-center'>
                                    <div className='flex items-center gap-x-4'>
                                        {profile_pic ?
                                            <div>
                                                <img src={URL.createObjectURL(profile_pic)} alt="" className='size-20 rounded-full' />
                                            </div>
                                            :
                                            (
                                                userProfile.profile_pic ?
                                                    <div>
                                                        <img src={userProfile.profile_pic} alt="" className='size-10 rounded-full' />
                                                    </div>
                                                    :
                                                    <FaCircleUser className='size-24 rounded-full' />
                                            )}
                                        <div>
                                            <h1 className='text-3xl font-semibold'>{userProfile.username}</h1>
                                        </div>

                                    </div>
                                </div>

                            </div>
                            <div className='flex flex-col col-span-12 mt-2'>
                                <div className='flex flex-col px-10'>
                                    <label htmlFor="username" className='text-[15px] font-semibold ml-2 mb-2'>Username</label>
                                    <input type='text' placeholder='Username' name='username' className='bg-zinc-900 
                                    rounded-full pt-4 pb-2 pl-3 outline-none' value={username}
                                        onChange={e => setUsername(e.target.value)} />
                                </div>
                                <div className='flex flex-col px-10 mt-2'>
                                    <label htmlFor="bio" className='text-[15px] font-semibold ml-2 mb-2'>Bio</label>
                                    <textarea
                                        placeholder='Bio'
                                        name='bio'
                                        className='bg-zinc-900 rounded-md pt-4 pb-2 pl-3 resize-none outline-none'
                                        rows={10}
                                        value={bio ? bio : ''}
                                        onChange={e => setBio(e.target.value)}
                                        maxLength={120}
                                    />
                                </div>

                                <div className='flex  px-10  mt-3 justify-between '>
                                    <div className='flex flex-col'>
                                        <label htmlFor="profilePic" className='text-[15px] font-semibold ml-2 mb-2'>Profile Picture</label>
                                        <input
                                            type='file'
                                            id='profilePic'
                                            name='profilePic'
                                            accept='image/*'
                                            className='hidden'
                                            onChange={handleFileUpload}
                                            
                                        />
                                        <button
                                            type='button'
                                            onClick={() => document.getElementById('profilePic').click()}
                                            className='ml-2 mt-2 '
                                        >
                                            <PiImageFill className='text-white text-2xl size-9' />
                                        </button>
                                    </div>
                                    <button className='text-black h-fit py-1 px-4 bg-blue-700 rounded-md mt-4' onClick={updateProfile}>Update Profile</button>
                                </div>

                            </div>
                        </> :
                        <div className='col-span-12 flex pt-52'> <Loader /></div>

                }
            </div>
        </>
    )
}

export default ProfileEdit