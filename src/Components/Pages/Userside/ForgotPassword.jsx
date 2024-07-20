import React, { useState, useEffect, useContext } from 'react'
import { ReactTyped } from "react-typed";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import api from '../../../Config'
import { ForgotPasswordContext } from '../../../Contexts/ForgotPasswordContextProvider';
import { useNavigate } from 'react-router-dom';


function ForgotPassword() {
    const [email, setEmail] = useState('')
    const {setForgotpasswordData} = useContext(ForgotPasswordContext)
    const navigate = useNavigate()



    const VerifyEmail = async () => {
        let data = {
            "email": email
        }
        try {
            const response = await api.post('forgot/password/verification/', data)
            toast.success('otp send', {
                position: "top-right",
                autoClose: 1000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: false,
                draggable: true,
                style: { backgroundColor: 'green', color: 'black' },
            })
            setForgotpasswordData(email)
            navigate('/forgot/password/update/')
         
        } catch (error) {
            console.log(error)
            if (error.response.data.message) {
                toast.error(error.response.data.message, {
                    position: "top-right",
                    autoClose: 1000,
                    hideProgressBar: true,
                    closeOnClick: true,
                    pauseOnHover: false,
                    draggable: true,
                    style: { backgroundColor: 'red', color: 'black' },
                })
            }
        }

    }

    return (
        <>

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
                        <div className='max-w-[500px] mx-auto md:ms-2 mt-3 backdrop-opacity-10 bg-black/80
                    flex flex-col py-7 h-fit px-5 rounded-lg text-white '>
                            <h1 className=' font-sans font-bold py-2 text-xl sm:tex-2xl md:text-3xl mx-auto'>Fogot Password</h1>

                            <input type="text" placeholder='*Enter Your Email' className='w-[300px]
                                    md:w-[450px]  bg-zinc-900 rounded-2xl px-5 py-2 md:py-3 font-thin mb-3 outline-none'
                                onChange={e => setEmail(e.target.value)} value={email}
                            />

                            {/* <div className='flex items-center w-fit relative h-fit mb-3'>
                                    <input type={isvisible ? 'text' : 'password'} placeholder='*Password' className='w-[300px]
                         md:w-[450px] bg-zinc-900 rounded-2xl pl-5 pr-9 py-2 md:py-3 font-thin  '
                                        onChange={e => handlepassword(e)} value={password} />
                                    {isvisible ?
                                        <AiOutlineEye className='absolute right-2 cursor-pointer' size={18} onClick={() => changeVisible(!isvisible)} /> :
                                        <AiOutlineEyeInvisible className='absolute right-2 cursor-pointer' size={18} onClick={() => changeVisible(!isvisible)} />
                                    }
                                </div> */}

                            <button className='bg-blue-600 mx-auto px-5 py-1 md:px-8 md:py-2 rounded-md text-black font-medium ' onClick={VerifyEmail}>Verify</button>

                        </div>
                    </div>
                </div>
            </div>
        </>

    )
}

export default ForgotPassword