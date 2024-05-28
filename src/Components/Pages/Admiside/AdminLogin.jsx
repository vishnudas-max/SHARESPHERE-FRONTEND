import React, { useState, useContext } from 'react'
import { ReactTyped } from "react-typed";
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import api from '../../../Config'
import { Link, useNavigate } from 'react-router-dom'
import { jwtDecode } from 'jwt-decode';
import { useDispatch } from 'react-redux';
import { setAuth } from '../../../Redux/UserdataSlice';

function AdminLogin() {
    const dispatch = useDispatch()
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [isvisible, changeVisible] = useState(false)
    const navigate = useNavigate()

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
        api.post("token/", data)
            .then(res => {
                console.log(res)
                localStorage.setItem('access',res.data.access)
                localStorage.setItem('refresh',res.data.refresh)
                const decodeToken =jwtDecode(res.data.access)
                dispatch(setAuth({
                    "username":decodeToken.username,
                    "is_admin":decodeToken.is_admin,
                    "userID" :decodeToken.user_id
                }))
                navigate('/admin/dashboard/')
            })
            .catch(err => {
                toast.error('Invalid credentials !', {
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
    return (
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

                        <input type="text" placeholder='*Username' className='w-[300px]
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
                    </form>
                </div>
            </div>
        </div>

    )
}

export default AdminLogin