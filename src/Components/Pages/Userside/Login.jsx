import React, { useState, useEffect } from 'react'
import { ReactTyped } from "react-typed";
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import api from '../../../Config'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { jwtDecode } from 'jwt-decode';
import { useDispatch } from 'react-redux';
import { setAuth } from '../../../Redux/UserdataSlice';
import { FcGoogle } from "react-icons/fc";
import Loader from './HelperComponents/Loader'


function Login() {
    const dispatch = useDispatch()
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [isvisible, changeVisible] = useState(false)
    const navigate = useNavigate()
    const location = useLocation();
    const loadingvalue = localStorage.getItem('loading')
    const [loading, setIsLoading] = useState(loadingvalue)


    const handleusername = (e) => {
        setUsername(e.target.value)
    }
    const handlepassword = e => {
        setPassword(e.target.value)
    }

    const handlesubmit = e => {
        e.preventDefault()
        let data = {
            "username": username,
            "password": password
        }
        api.post("login/", data)
            .then(res => {
                console.log(res)
                localStorage.setItem('access', res.data.access)
                localStorage.setItem('refresh', res.data.refresh)
                const decodeToken = jwtDecode(res.data.access)
                dispatch(setAuth({
                    "username": decodeToken.username,
                    "is_admin": decodeToken.is_admin,
                    "userID": decodeToken.user_id
                }))
                navigate('/home/', { replace: true })

            })
            .catch(err => {
                console.log(err)
                toast.error(err.response.data, {
                    position: "top-right",
                    autoClose: 1000,
                    hideProgressBar: true,
                    closeOnClick: true,
                    pauseOnHover: false,
                    draggable: true,
                    style: { backgroundColor: 'red', color: 'black' },
                })
            })
    }

    // google authentication part start here---
    const onGoogleLoginSuccess = () => {

        localStorage.setItem('loading', true)
        const GOOGLE_AUTH_URL = 'https://accounts.google.com/o/oauth2/v2/auth';
        const REDIRECT_URI = 'api/auth/login/google/';
        const scope = [
            'https://www.googleapis.com/auth/userinfo.email',
            'https://www.googleapis.com/auth/userinfo.profile'
        ].join(' ');

        const params = {
            response_type: 'code',
            client_id: process.env.REACT_APP_GOOGLE_OAUTH2_CLIENT_ID,
            redirect_uri: `${process.env.REACT_APP_BASE_URL}/${REDIRECT_URI}`,
            prompt: 'select_account',
            access_type: 'offline',
            scope
        };
        const urlParams = new URLSearchParams(params).toString();
        window.location = `${GOOGLE_AUTH_URL}?${urlParams}`;
    }

    useEffect(() => {
        const query = new URLSearchParams(location.search);
        const message = query.get('message')
        if (message) {
            toast.error('This account is no longer accessible', {
                position: "top-right",
                autoClose: 1000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: false,
                draggable: true,
                style: { backgroundColor: 'red', color: 'black' },
            })
            setTimeout(() => {
                navigate('/')
            }, 2000);
        }

    }, [location])

    useEffect(() => {
        const query = new URLSearchParams(location.search);
        const access = query.get('access');
        const refresh = query.get('refresh');
        const loading = localStorage.getItem('loading')
        if (access && refresh) {
            // Store tokens in localStorage
            localStorage.setItem('access', access);
            localStorage.setItem('refresh', refresh);

            // Decode the access token to retrieve user information
            const decodeToken = jwtDecode(access);
            dispatch(setAuth({
                "username": decodeToken.username,
                "is_admin": decodeToken.is_admin,
                "userID": decodeToken.user_id
            }));

            navigate('/home/', { replace: true });
        } else {
            if (loading) {
                localStorage.removeItem('loading')
                setIsLoading(null)
            }
        }
        return () => {
            if (loading) {
                localStorage.removeItem('loading');
            }
        }
    }, [location, loading]);

    return (
        <>
            {loading ? <div className='w-screen h-screen flex justify-center items-center'><Loader /> </div> :
                <div className='bg-register-bg bg-cover w-full h-screen bg-center'>
                    <ToastContainer />
                    <div className='w-full h-[400px] md:h-full grid md:grid-cols-2 '>
                        <div className='max-w-[400px] mx-auto'>
                            <h1 className='font-bold mt-5 text-4xl sm:text-5xl md:text-6xl'><span className='text-5xl sm:text-6xl md:text-7xl'>S</span>HARESPHERE</h1>
                            <div className='flex font-bold text-2xl sm:text-3xl md:tex-4xl my-2 ml-4'>
                                <p>STAY ,</p>
                                <ReactTyped
                                    strings={['CONNECTED.', 'INSPIRED.']} typeSpeed={100} backSpeed={100} loop
                                />
                            </div>



                        </div>
                        <div className='w-full h-full flex md:items-center '>

                            <form action="" className='max-w-[500px] mx-auto md:ms-2 mt-3 backdrop-opacity-10 bg-black/80
                    flex flex-col py-7 h-fit px-5 rounded-lg text-white '>
                                <h1 className=' font-sans font-bold py-2 text-xl sm:tex-2xl md:text-3xl mx-auto'>LOG IN</h1>

                                <input type="text" placeholder='*Username or Phone Number' className='w-[300px]
                         md:w-[450px]  bg-zinc-900 rounded-2xl px-5 py-2 md:py-3 font-thin mb-3'
                                    onChange={e => handleusername(e)} value={username}
                                />

                                <div className='flex items-center w-fit relative h-fit mb-3'>
                                    <input type={isvisible ? 'text' : 'password'} placeholder='*Password' className='w-[300px]
                         md:w-[450px] bg-zinc-900 rounded-2xl pl-5 pr-9 py-2 md:py-3 font-thin  '
                                        onChange={e => handlepassword(e)} value={password} />
                                    {isvisible ?
                                        <AiOutlineEye className='absolute right-2 cursor-pointer' size={18} onClick={() => changeVisible(!isvisible)} /> :
                                        <AiOutlineEyeInvisible className='absolute right-2 cursor-pointer' size={18} onClick={() => changeVisible(!isvisible)} />
                                    }
                                </div>

                                <button className='bg-blue-600 mx-auto px-5 py-1 md:px-8 md:py-2 rounded-md text-black font-medium ' onClick={handlesubmit}>LOG IN</button>
                                <p className='text-xs font-bold tracking-wide mt-3'>Forgot Password?<Link to='/forgot/password/'><span className='text-blue-700 ms-2 cursor-pointer'>Click here</span></Link></p>
                                <p className='text-xs font-bold tracking-wide mt-3'>Don't have and account?<Link to='/register/'><span className='text-blue-700 ms-2 cursor-pointer'>Register here</span></Link></p>

                                <div className='w-full border-t border-gray-200 relative mt-5 pt-5 cursor-pointer' onClick={onGoogleLoginSuccess}>
                                    {/* <GoogleButton onClick={onGoogleLoginSuccess} type='dark' label="Sign in with Google" className='' /> */}
                                    <div className='md:w-[240px] w-[200px] bg-blue-500 mx-auto flex overflow-hidden rounded-full'>
                                        <div className='px-2 py-2 bg-white basis-2/12 rounded-full '>
                                            <FcGoogle className='size-6 md:size-7' />
                                        </div>
                                        <div className='basis-10/12 flex'>
                                            <h1 className='text-black md:text-[16px] text-[14px] font-semibold flex items-center mx-auto'>Sign in with Google</h1>
                                        </div>
                                    </div>
                                </div>
                            </form>

                        </div>
                    </div>
                </div>}
        </>

    )
}

export default Login