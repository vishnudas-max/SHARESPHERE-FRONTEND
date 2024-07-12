import React, { useEffect, useState, useRef } from 'react'
import CallSocketProvider from '../../../Contexts/CallSocketProvider'
import IncomingCall from './HelperComponents/IncomingCall'
import Navbar from './HelperComponents/Navbar'
import { useSelector } from 'react-redux'
import api from '../../../Config'
import Loader from './HelperComponents/Loader'
import { FaCircleUser } from "react-icons/fa6";
import { RiLogoutCircleLine } from "react-icons/ri";
import { useDispatch } from 'react-redux'
import { delAuth } from '../../../Redux/UserdataSlice'
import { delPost } from '../../../Redux/PostSlice'
import { delStories } from '../../../Redux/StoriesSlice'
import VerifyAccount from './HelperComponents/VerifyAccount'
import { IoDocumentSharp, IoClose } from "react-icons/io5";

function More() {

    const [profile, setUserProfile] = useState(null)
    const access = localStorage.getItem('access')
    const userID = useSelector(state => state.authInfo.userID)
    const [moreOption, setMoreOption] = useState('')
    const dispatch = useDispatch()
    const imgRef = useRef()
    const [doc, setDoc] = useState(null)
    const [accountSecOption, setAccountsecOption] = useState('')

    const handleLogout = () => {
        localStorage.clear()
        dispatch(delAuth())
        dispatch(delStories())
        dispatch(delPost())

    }

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
        if (profile === null) {
            fetchProfile()
        }
    },
        [])

    return (
        <>
            <Navbar />
            <CallSocketProvider>
                <IncomingCall />
            </CallSocketProvider>
            <div className='md:ml-[320px] flex text-white mt-0 h-screen'>

                {/* left side of more--- */}
                <div className={`'md:basis-6/12 md:basis-6/12 w-screen md:border-r border-gray-700 h-full overflow-x-auto px-2 '${moreOption && 'md:block md:block hidden'}`}>
                    <div className='bg-gray-900 max-w-[300px] pb-20 mx-auto mt-20 rounded-3xl border border-gray-600 '>
                        {/* header-- */}
                        <div className='w-flull bg-gray-950 py-4 rounded-tl-3xl rounded-tr-3xl '>
                            <div className='flex justify-center h-fit w-fit mx-auto '>
                                {
                                    profile ?
                                        (
                                            <div className='flex w-fit items-center gap-x-2'>
                                                {
                                                    profile.profile_pic ?
                                                        <div className='shrink-0'>
                                                            <img src={profile.profile_pic} alt='ProfilePic' className='md:size-16 size-12 rounded-full
                                        border-[1px] border-gray-300'/>
                                                        </div>
                                                        :
                                                        <FaCircleUser className='size-12' />

                                                }
                                                <h1 className='md:text-2xl text-md h-fit font-semibold'>{profile.username}</h1>
                                            </div>
                                        )
                                        :
                                        <Loader />
                                }
                            </div>
                        </div>
                        {/* contend--- */}
                        <div className='md:px-10 px-6 pt-3'>
                            <ul>
                                <li onClick={() => {
                                    if (accountSecOption) {
                                        setAccountsecOption('')
                                    }
                                    setMoreOption('Account Security')
                                }
                                } className='md:text-xl text-md w-full bg-gray mt-4 font-sans font-light cursor-pointer hover:bg-gray-800 rounded-full    flex justify-center py-1' >Security</li>

                                <li onClick={() => {
                                    if (accountSecOption) {
                                        setAccountsecOption('')
                                    }
                                    setMoreOption('Verify Account')
                                }
                                } className='md:text-xl text-md w-full bg-gray mt-4 font-sans font-light cursor-pointer hover:bg-gray-800 rounded-full    flex justify-center py-1' >Verify</li>

                                <li className='md:text-xl text-md w-full bg-gray mt-4 font-sans font-light cursor-pointer hover:bg-gray-800 rounded-full    flex justify-center py-1 items-center text-red-600'
                                    onClick={handleLogout}>
                                    <div>
                                        <RiLogoutCircleLine className='size-5' />
                                    </div>
                                    Logout</li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* right side-- */}

                {/* continer for Account Security options-- */}
                {moreOption === 'Account Security' &&

                    <div className={`'md:basis-6/12 md:basis-6/12  w-screen md:border-r border-gray-700 h-full overflow-x-auto'
                    ${accountSecOption ? 'hidden ' : 'block '}`}>
                        <div className='pl-3 pt-3 text-sm text-gray-500 fixed'>
                            <span className='cursor-pointer' onClick={() => setMoreOption('')}>More</span>
                            &nbsp;
                            &gt;
                            &nbsp;
                            <span className='cursor-pointer' >Security</span>
                        </div>
                        <div className='w-full h-fit pb-10 bg-gray-900 max-w-[300px] mx-auto mt-20 rounded-3xl border border-gray-700'>
                            <div className='w-full bg-gray-950 h-fit py-4 px-2 rounded-tl-3xl rounded-tr-3xl'>
                                <h1 className='text-center text-2xl font-semibold'>{moreOption}</h1>
                            </div>
                            <div className='w-full px-10'>


                                <ul>
                                    <li className='font-light w-full py-1 flex justify-center h-fit mt-5 hover:bg-gray-800 rounded-full
                            cursor-pointer' onClick={() => setAccountsecOption('Change Password')}>Change Password</li>
                                    <li className='font-light w-full py-1 flex justify-center h-fit mt-5 hover:bg-gray-800 rounded-full
                            cursor-pointer' onClick={() => setAccountsecOption('Block List')}>Block List</li>
                                    <li className='font-light w-full py-1 flex justify-center h-fit mt-5 hover:bg-gray-800 rounded-full
                            cursor-pointer'>Delete Account</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                }

                {/* conatiner for Change password form-- */}
                {
                    accountSecOption === 'Change Password' &&
                    <div className='md:basis-6/12  md:block  w-screen md:border-r border-gray-700 h-full overflow-x-auto'>

                        <div className='pl-3 pt-3 text-sm text-gray-500 fixed'>
                            <span className='cursor-pointer' onClick={() => {
                                if (accountSecOption) {
                                    setAccountsecOption('')
                                }
                                setMoreOption('')
                            }}
                            >More</span>
                            &nbsp;
                            &gt;
                            &nbsp;
                            <span className='cursor-pointer' onClick={() => setAccountsecOption('')}>Security</span>
                            &nbsp;
                            &gt;
                            &nbsp;
                            <span className='cursor-pointer' >Change Password</span>
                        </div>
                        <h1 className='ml-10  mt-16 text-2xl font-semibold'>{accountSecOption}</h1>


                        {/* breadcrumps-- */}

                        {/* breadcrumps end here--- */}

                        <div className='flex flex-col gap-y-5 pl-10 max-w-[300px] pt-5  mr-5'>
                            <div className='flex flex-col gap-y-2 PX-5'>
                                <input type="password" placeholder='Enter new Password' className='
                                pl-2 pt-2 pb-1 rounded-md outline-none  bg-gray-800 text-[14px]'
                                />
                            </div>
                            <div className='flex flex-col gap-y-2'>
                                <input type="password" placeholder='Confirm Password' className='
                                pl-2 pt-2 pb-1 rounded-md outline-none  bg-gray-800 text-[14px]'
                                />                         </div>
                            <div>
                                <button className='bg-blue-600 text-sm w-fit h-fit py-1 px-2 rounded-md'>Change Password</button>
                            </div>
                        </div>
                    </div >
                }

                {/* container for block list-- */}
                {
                    accountSecOption === 'Block List' &&
                    <div className='md:basis-6/12  md:block  w-screen md:border-r border-gray-700 h-full overflow-x-auto'>

                        <div className='pl-3 pt-3 text-sm text-gray-500 fixed'>
                            <span className='cursor-pointer' onClick={() => {
                                if (accountSecOption) {
                                    setAccountsecOption('')
                                }
                                setMoreOption('')
                            }}
                            >More</span>
                            &nbsp;
                            &gt;
                            &nbsp;
                            <span className='cursor-pointer' onClick={() => setAccountsecOption('')}>Security</span>
                            &nbsp;
                            &gt;
                            &nbsp;
                            <span className='cursor-pointer' >Block List</span>
                        </div>
                        <h1 className='ml-10  mt-16 text-2xl font-semibold mb-4'>{accountSecOption}</h1>


                        {/* breadcrumps-- */}

                        {/* breadcrumps end here--- */}

                        <div className='flex flex-col gap-y-5 pl-10 max-w-full pt-5  mr-5 md:max-h-[550px] max-h-[480px] overflow-y-scroll no-scrollbar'>
                            {
                                Array(10).fill().map((_, index) => (

                                    <div className='flex items-center  justify-between '>
                                        <div className='flex gap-x-2 items-center basis-2/3'>
                                            <div className='shrink-0'>
                                                <FaCircleUser className='size-12' />
                                            </div>
                                            <h1 className='text-[16px] font-semibold'>User</h1>
                                        </div>
                                        <div className='basis-1/3'>
                                            <button className='h-fit w-fit py-1 px-3 bg-red-600 rounded-md'>UnBlock</button>
                                        </div>

                                    </div>
                                ))
                            }
                        </div>
                    </div >
                }

                {/* container for verify account -- */}
                {moreOption === 'Verify Account'
                    &&
                    <div className='md:basis-6/12  md:block  w-screen md:border-r border-gray-700 h-full overflow-x-auto'>

                        <div className='pl-3 pt-3 text-sm text-gray-500 fixed'>
                            <span className='cursor-pointer' onClick={() => {
                                setMoreOption('')
                            }}
                            >More</span>
                            &nbsp;
                            &gt;
                            &nbsp;
                            <span className='cursor-pointer' onClick={() => setAccountsecOption('')}>Verify</span>
                        </div>
                        <h1 className='ml-10 mt-10 text-2xl font-semibold'>Verify Account</h1>
                        <div className='flex flex-col gap-y-5 pl-10 pt-5'>
                            <div className='flex flex-col gap-y-2'>
                                <label htmlFor="doc">Provide Your Adhaar or Driving licence Image For Verification</label>
                                <div className='flex gap-x-1 items-center'>
                                    <IoDocumentSharp className='size-6' onClick={() => imgRef.current.click()}
                                    />
                                    {doc && (
                                        <div className='text-xs py-1 px-1 flex items-center gap-x-2'>
                                            <p className='w-[150px] py-1 pl-1 bg-gray-800 overflow-hidden text-ellipsis whitespace-nowrap'>
                                                {URL.createObjectURL(doc)}
                                            </p>
                                            <div className='h-fit'><IoClose className='size-5 cursor-pointer' onClick={() => setDoc(null)} /></div>
                                        </div>
                                    )}
                                </div>

                                <input type="file" accept='image/*' ref={imgRef} className='hidden' name='doc' onChange={e => setDoc(e.target.files[0])} />
                            </div>
                            <div>
                                <button className='bg-blue-600 text-sm w-fit h-fit py-1 px-2 rounded-md'>Request Verification</button>
                            </div>
                        </div>
                    </div >

                }


            </div>
        </>
    )
}

export default More