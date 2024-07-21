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
import { IoDocumentSharp, IoClose } from "react-icons/io5";
import { useNavigate } from 'react-router-dom'
import { BASE_URL, RAZORPAY_KEY_ID, RAZORPAY_SECRET } from '../../../secrets'
import { TiTick } from "react-icons/ti";
import { MdVerified } from "react-icons/md";


function More() {

    const [profile, setUserProfile] = useState(null)
    const access = localStorage.getItem('access')
    const userID = useSelector(state => state.authInfo.userID)
    const [moreOption, setMoreOption] = useState('')
    const dispatch = useDispatch()
    const imgRef = useRef()
    const [doc, setDoc] = useState(null)
    const [accountSecOption, setAccountsecOption] = useState('')
    const [passwrod, setPassword] = useState('')
    const [confirm, setConfirm] = useState('')
    const navigate = useNavigate()
    const [errors, setErrors] = useState({
        password: '',
        confirm: '',
        doc: ''
    })
    const [blockedUsers, setBlockedUsers] = useState(null)

    const plans = [{
        duration: '6 Months',
        price: 999
    }, {
        duration: '1 year',
        price: 1700
    },
    {
        duration: '2 Year',
        price: 3000
    }
    ]

    const [selectedPlan, handlePlanChange] = useState('')

    const handlePassword = (password) => {
        let re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/
        let test_result = re.test(password)
        if (test_result) {
            if (confirm !== '') {
                if (confirm !== password) {
                    let obj = { ...errors, confirm: 'Password does not match !', password: '' }
                    setErrors(obj)
                    setPassword(password)
                    return false
                } else {
                    let obj = { ...errors, confirm: '' }
                    setErrors(obj)
                    setPassword(password)
                    return true
                }
            }
            let obj = { ...errors, password: '' }
            setErrors(obj)
            setPassword(password)
            return true
        } else {
            if (password === '') {
                let obj = { ...errors, password: '' }
                setErrors(obj)
                setPassword(password)
                return false
            }
            let obj = { ...errors, password: 'password is too week!' }
            setErrors(obj)
            setPassword(password)
            return false
        }

    }

    const handleConfirm = (confirm) => {
        if (passwrod !== confirm) {
            let obj = { ...errors, confirm: 'password does not match !' }
            setErrors(obj)
            setConfirm(confirm)
            return false
        } else {
            let obj = { ...errors, confirm: '' }
            setErrors(obj)
            setConfirm(confirm)
            return true
        }
    }


    const handleLogout = () => {
        localStorage.clear()
        dispatch(delAuth())
        dispatch(delStories())
        dispatch(delPost())

    }

    const fetchProfile = async () => {
        try {
            const response = await api.get(`verify/account/`, {
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

    const changePassword = async () => {
        if (errors.password || errors.confirm) {
            return false
        }
        else if (passwrod === '' || confirm === '') {
            return false
        }
        try {
            const formData = new FormData();
            formData.append('password', passwrod)
            const response = await api.patch(`user/account/sercurity/`, formData, {
                headers: {
                    Authorization: `Bearer ${access}`,
                }
            })
            localStorage.clear()
            navigate('/')

        } catch (error) {
            console.log(error)
        }

    }

    const deleteAccount = async () => {
        try {
            const formData = new FormData();
            const response = await api.delete(`user/account/sercurity/`, {
                headers: {
                    Authorization: `Bearer ${access}`,
                }
            })
            localStorage.clear()
            navigate('/')

        } catch (error) {
            console.log(error)
        }
    }

    // request for verification---
    const handleverification = async () => {

        const verficatinData = new FormData();
        if (doc === null) {
            let obj = { ...errors, doc: 'You should provide Either Adhar or License for verification' }
            setErrors(obj)
            setTimeout(() => {
                let obj = { ...errors, doc: '' }
                setErrors(obj)
            }, (3000));
            return false
        }
        if (!userID) {
            return false
        }
        verficatinData.append('document', doc)
        verficatinData.append('userID', userID)
        try {
            const response = await api.post('verify/account/', verficatinData, {
                headers: {
                    Authorization: `Bearer ${access}`,
                    "Content-Type": 'multipart/form-data'
                }
            });
            let obj = { ...profile, is_requested: true }
            setUserProfile(obj)
        } catch (error) {
            console.log(error)
        }
    }
    // getting blocked users---
    const gettingBlockedUsers = async () => {
        try {
            const response = await api.get('block/user/', {
                headers: {
                    Authorization: `Bearer ${access}`
                }
            })
            setBlockedUsers(response.data)
        } catch (error) {
            console.log(error)
        }
    }

    // ulblocking userss---
    const unblockUser = async (userID) => {
        try {
            const response = await api.patch('block/user/', { userID: userID }, {
                headers: {
                    Authorization: `Bearer ${access}`
                }
            })
            gettingBlockedUsers()
        } catch (error) {
            console.log(error)
            alert('Something went wrong!Try again later.')
        }
    }
    useEffect(() => {
        if (profile === null) {
            fetchProfile()
        }
    },
        [])


    // payment code--
    const loadScript = () => {
        return new Promise((resolve) => {
            const script = document.createElement("script");
            script.src = "https://checkout.razorpay.com/v1/checkout.js";
            script.onload = () => resolve(true);
            script.onerror = () => resolve(false);
            document.body.appendChild(script);
        });
    };


    const handlePaymentSuccess = async (amount, plan) => {
        try {
            const data = {
                amount: amount,
                plan: plan
            };
            const response = await api.patch('razorpay/payment/', data, {
                headers: {
                    Authorization: `Bearer ${access}`
                }
            });
            console.log(response);
            fetchProfile()
        } catch (error) {
            alert('Something went wrong. Please try again later.');
        }
    };

    const showRazorpay = async ({ duration, price }) => {
        const res = await loadScript();

        if (!res) {
            alert("Razorpay SDK failed to load. Are you online?");
            return;
        }

        let response;
        try {
            response = await api.post('razorpay/payment/', {
                amount: price * 100,
                plan: duration
            }, {
                headers: {
                    Authorization: `Bearer ${access}`
                }
            });
            console.log(response);
        } catch (error) {
            console.log(error)
            alert("Server Error. Please try again later.");
            return null;
        }

        if (!response || !response.data) {
            return;
        }

        const { order_id, amount, currency, plan } = response.data;

        const options = {
            key: process.env.REACT_APP_RAZORPAY_KEY_ID, // Use key, not key_id
            amount: amount,
            currency: currency,
            name: "Sharesphare",
            description: "Test transaction",
            image: "", // add image URL if needed
            order_id: order_id, // Use the order ID generated by Razorpay
            handler: function (response) {
                handlePaymentSuccess(amount, plan);

            },
            prefill: {
                name: "User's name",
                email: "User's email",
                contact: "User's phone",
            },
            notes: {
                address: "Razorpay Corporate Office",
            },
            theme: {
                color: "#3399cc",
            },
        };

        const rzp1 = new window.Razorpay(options);
        rzp1.open();
    };





    return (
        <>
            <Navbar />
            <CallSocketProvider>
                <IncomingCall />
            </CallSocketProvider>
            <div className='md:ml-[320px] flex text-white mt-0 h-screen select-none'>

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
                                                            <img src={BASE_URL + profile.profile_pic} alt='ProfilePic' className='md:size-16 size-12 rounded-full
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
                            cursor-pointer' onClick={() => {
                                            gettingBlockedUsers()
                                            setAccountsecOption('Block List')
                                        }}>Block List</li>

                                    <li className='font-light w-full py-1 flex justify-center h-fit mt-5 hover:bg-gray-800 rounded-full
                            cursor-pointer' onClick={deleteAccount}>Delete Account</li>

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
                                {errors.password !== '' && <p className='text-red-600 text-xs'>{errors.password}</p>}
                                <input type="password" placeholder='Enter new Password' className='
                                pl-2 pt-2 pb-1 rounded-md outline-none  bg-gray-800 text-[14px]'
                                    onChange={e => handlePassword(e.target.value)} value={passwrod}
                                />
                            </div>
                            <div className='flex flex-col gap-y-2'>
                                {errors.confirm !== '' && <p className='text-red-600 text-xs'>{errors.confirm}</p>}
                                <input type="password" placeholder='Confirm Password' className='
                                pl-2 pt-2 pb-1 rounded-md outline-none  bg-gray-800 text-[14px]'
                                    onChange={e => handleConfirm(e.target.value)} />
                            </div>
                            <div>
                                <button className='bg-blue-600 text-sm w-fit h-fit py-1 px-2 rounded-md'
                                    onClick={changePassword}>Change Password</button>
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
                            {blockedUsers ?
                                (blockedUsers.length >= 1 ?
                                    blockedUsers.map((user, index) => (
                                        <div className='flex items-center  justify-between ' >
                                            <div className='flex gap-x-2 items-center basis-2/3'>
                                                <div className='shrink-0 size-14 rounded-full'>
                                                    {user.profile_pic ?
                                                        <img src={BASE_URL + user.profile_pic} alt="profile_pic" className='rounded-full size-12 border border-gray-400' />
                                                        :
                                                        <div>
                                                            <FaCircleUser className='size-12' />
                                                        </div>
                                                    }
                                                </div>
                                                <h1 className='text-[16px] font-semibold'>{user.username}</h1>
                                            </div>
                                            <div className='basis-1/3'>
                                                <button className='w-fit h-fit py-1 px-3 bg-red-600  rounded-md' onClick={() => unblockUser(user.id)}>Unblock</button>
                                            </div>

                                        </div>
                                    )) :
                                    <div className='text-xl text-gray-500'>No blocked Users</div>
                                )
                                :

                                Array(10).fill().map((_, index) => (

                                    <div className='flex items-center  justify-between '>
                                        <div className='flex gap-x-2 items-center basis-2/3'>
                                            <div className='shrink-0 size-14 bg-gray-800 rounded-full animate-pulse'>
                                            </div>
                                            <h1 className='text-[16px] font-semibold bg-gray-800 w-32 h-4 rounded-xl animate-pulse'></h1>
                                        </div>
                                        <div className='basis-1/3'>
                                            <button className=' py-1 px-3 bg-gray-800 w-28 animate-pulse h-9 rounded-md'></button>
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
                        {(profile.is_verified) ?
                            <div className='text-2xl font-semibold ml-10 mt-10 flex gap-x-2 items-center'>
                                Your Account is Verified
                                <div>
                                    <MdVerified className='text-blue-600 size-10' />
                                </div>
                            </div>
                            : profile.is_requested ?
                                (
                                    <div className='ml-10'>
                                        {

                                            (profile.verification_detailes && profile.verification_detailes.is_accepted) ? (
                                                // UI for accepted request
                                                <div>
                                                    <p className='text-green-500 flex items-center'>
                                                        Verification Accepted <TiTick className='size-9' />
                                                    </p>
                                                    <div className='flex flex-col gap-y-5  pt-5'>
                                                        <div className='flex flex-col gap-y-2'>
                                                            {/* plans showing for verifications--- */}
                                                            <label className='text-xl font-semibold text-gra'>Choose a Plan</label>
                                                            {
                                                                plans.map((plan, index) => {
                                                                    let bg = '';

                                                                    if (plan.duration === '6 Months') {
                                                                        bg = 'bg-[#50481B]';
                                                                    } else if (plan.duration === '1 year') {
                                                                        bg = 'bg-[#9C9C9C]';
                                                                    } else {
                                                                        bg = 'bg-[#D1A50A]';
                                                                    }

                                                                    return (
                                                                        <div
                                                                            key={index}
                                                                            className={`flex justify-between px-5 w-56 py-3 mt-3  ${bg} rounded-full hover:scale-110 cursor-pointer transition-all delay-75 ease-in-out`}
                                                                            onClick={() => showRazorpay(plan)}
                                                                        >
                                                                            <h1 className='text-black font-semibold text-xl font-mono'>{plan.duration}</h1>
                                                                            <h1 className='text-xl text-black font-semibold'>{plan.price} Rs</h1>
                                                                        </div>
                                                                    );
                                                                })
                                                            }

                                                        </div>
                                                        <div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ) : (profile.verification_detailes && profile.verification_detailes.is_rejected) ? (
                                                // UI for rejected request
                                                <div className=' gap-x-2 mt-2'>
                                                    <p className='text-red-500 flex items-center'>
                                                        Verification Rejected <IoClose className='size-9' />
                                                    </p>
                                                    <p>Your verification request has been declined due to certain reasons. You may submit a new request after one month.</p>
                                                </div>
                                            ) : (
                                                // UI for pending request
                                                <div className=''>
                                                    <div className='flex items-center gap-x-2 mt-2'>
                                                        Requested <TiTick className='text-green-500 size-9' />
                                                    </div>
                                                    <p>Response Pending..</p>
                                                </div>
                                            )}
                                    </div>
                                )
                                :
                                // ui if not requested---
                                <div className='flex flex-col gap-y-5 pl-10 pt-5'>
                                    <div className='flex flex-col gap-y-2'>
                                        <label htmlFor="doc">Provide Your Adhaar or Driving licence Image For Verification</label>
                                        {errors.doc && <p className='text-xs text-red-600'>{errors.doc}</p>}
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
                                        <button className='bg-blue-600 text-sm w-fit h-fit py-1 px-2 rounded-md' onClick={handleverification}>Request Verification</button>
                                    </div>
                                </div>
                        }
                    </div >

                }


            </div >
        </>
    )
}

export default More;