import React, { useState, useContext, useEffect } from 'react'
import { ReactTyped } from "react-typed";
import api from '../../../Config'
import { ForgotPasswordContext } from '../../../Contexts/ForgotPasswordContextProvider';
import { ToastContainer, toast } from 'react-toastify';
import {  useNavigate } from 'react-router-dom';

function Register() {
    const { forgotpasswordData, setForgotpasswordData } = useContext(ForgotPasswordContext)
    const navigate = useNavigate()
    const [otp, setOtp] = useState(Array(4).fill(''));
    const [showResend, setShowResend] = useState(false);
    const [seconds, setSeconds] = useState(60);
    const [otpVerified, ToggleOtpVerified] = useState(false)
    const [password, setPassword] = useState('')
    const [confirm, setConfirm] = useState('')
    const [errors, setErrors] = useState({
        password: '',
        confirm: ''
    })

    const handleChange = (e, index) => {
        const value = e.target.value;

        if (/^[0-9]?$/.test(value)) {
            const newOtp = [...otp];
            newOtp[index] = value;
            setOtp(newOtp);

            // Move to next input field if a digit is entered
            if (value && index < otp.length - 1) {
                document.getElementById(`otp-input-${index + 1}`).focus();
            }
        }
    };
    const handlePaste = (e) => {
        const paste = e.clipboardData.getData('text');
        if (paste.length === otp.length && /^[0-9]+$/.test(paste)) {
            setOtp(paste.split(''));
        }
    };

    const handleVerification = async () => {
        const otpNumber = otp.join('');

        let data = {
            "otp": otpNumber,
            "email": forgotpasswordData
        }
        try {
            const response = await api.post('forgot/password/verification/otp/', data)
            console.log(response)
            ToggleOtpVerified(true)
        }
        catch (error) {
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

    const handleResentOtp = () => {

        let data = {
            "email": forgotpasswordData,
        }
        api.post('forgot/password/verification/otp/resend/', data)
            .then(res => {
                console.log(res)

                if (res.data.message) {
                    toast.success(res.data.message, {
                        position: "top-right",
                        autoClose: 1000,
                        hideProgressBar: true,
                        closeOnClick: true,
                        pauseOnHover: false,
                        draggable: true,
                        style: { backgroundColor: 'green', color: 'black' },
                    })

                }
                setSeconds(60);
                setShowResend(false);
            })
            .catch(res => {
                if (res.response.data.message) {
                    toast.warning(res.response.data.message, {
                        position: "top-right",
                        autoClose: 1000,
                        hideProgressBar: true,
                        closeOnClick: true,
                        pauseOnHover: false,
                        draggable: true,
                        style: { backgroundColor: 'red', color: 'black' },
                    })
                };
                setTimeout(() => {
                    navigate(-1);
                }, 1000);


            }
            )

    }

    useEffect(() => {
        if (forgotpasswordData === null) {
            navigate(-1)
        }
        if (seconds === 0) {
            setShowResend(true);
        }

    },
        [seconds])

    useEffect(() => {
        const timer = setTimeout(() => {
            setSeconds(seconds - 1);
        }, 1000);
        return () => {
            clearTimeout(timer);
        }
    }, [seconds]);


    const handlepassword = e => {
        let re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/
        let test_result = re.test(e.target.value)
        if (test_result) {
            if (confirm !== '') {
                if (confirm !== e.target.value) {
                    let obj = { ...errors, confirm: 'Password does not match !', password: '' }
                    setErrors(obj)
                    setPassword(e.target.value)
                    return false
                } else {
                    let obj = { ...errors, confirm: '' }
                    setErrors(obj)
                    setPassword(e.target.value)
                    return true
                }
            }
            let obj = { ...errors, password: '' }
            setErrors(obj)
            setPassword(e.target.value)
            return true
        }

        else {
            if (e.target.value === '') {
                let obj = { ...errors, password: '' }
                setErrors(obj)
                setPassword(e.target.value)
                return false
            }
            let obj = { ...errors, password: 'password is too week!' }
            setErrors(obj)
            setPassword(e.target.value)
            return false
        }

    }
    const handleconfirm = e => {
        if (password !== e.target.value) {

            let obj = { ...errors, confirm: 'Passord does not match!' }
            setErrors(obj)
            setConfirm(e.target.value)
            return false
        } else {

            let obj = { ...errors, confirm: '' }
            setErrors(obj)
            setConfirm(e.target.value)
            return true
        }
    }

    const ChangePassword = async () => {
        if (errors.password || errors.confirm) {
            return false
        }
        if (password === '' || confirm === '') {
            let obj = { ...errors, confirm: 'This field cannot be empty!', password: 'This field cannot be empty!' }
            setErrors(obj)
            return false
        }
        let data ={
            password:password,
            email:forgotpasswordData
        }
        try {
                const response = await api.patch('forgot/password/verification/otp/', data)
                navigate('/')
        }catch(error){
            alert('Somthing went wrong.Please try again later !')
            console.log(error)

        } 
    }

    return (
        <div className='bg-register-bg bg-cover w-full h-screen bg-center'>
            <ToastContainer />
            <div className='w-full h-[400px] md:h-full grid md:grid-cols-2'>
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
                    {
                        otpVerified ?
                            <div action="" className='max-w-[600px] mx-auto mt-3 backdrop-opacity-10 bg-black/80
                    flex flex-col py-7 h-fit px-5 rounded-lg text-white md:p-12'>
                                <h1 className=' font-sans font-bold py-2 text-xl sm:tex-2xl md:text-3xl mx-auto '>Change Password</h1>
                                {errors.password && <p className='text-red-600 text-xs ml-2 mb-2'>{errors.password}</p>}
                                <input type="password" placeholder='*Enter new Password' className='w-[300px]
                         md:w-[450px]  bg-zinc-900 rounded-2xl px-5 py-2 md:py-3 font-thin mb-3 outline-none'
                                    onChange={e => handlepassword(e)} />
                                {errors.confirm && <p className='text-red-600 text-xs ml-2 mb-2'>{errors.confirm}</p>}
                                <input type="password" placeholder='*Confirm new Password' className='w-[300px]
                         md:w-[450px]  bg-zinc-900 rounded-2xl px-5 py-2 md:py-3 font-thin mb-3 outline-none'
                                    onChange={e => handleconfirm(e)}
                                />

                            <button className='bg-blue-600 mx-auto px-5 py-1 md:px-8 md:py-2 rounded-md text-black font-medium mt-4 ' onClick={ChangePassword}>Change Password</button>

                            </div>
                            :

                            <div action="" className='max-w-[600px] mx-auto mt-3 backdrop-opacity-10 bg-black/80
                    flex flex-col py-7 h-fit px-5 rounded-lg text-white md:p-12'>
                                <h1 className=' font-sans font-bold py-2 text-xl sm:tex-2xl md:text-3xl mx-auto'>OTP</h1>

                                <div className='flex space-x-2'>
                                    {otp.map((digit, index) => (
                                        <input
                                            key={index}
                                            id={`otp-input-${index}`}
                                            type="number"
                                            maxLength={1}
                                            placeholder="0"
                                            className="w-[50px] h-[50px] md:w-[70px] outline-none md:h-[79px] md:p-7 bg-zinc-900 rounded-2xl p-5 font-medium md:text-xl text-center"
                                            value={digit}
                                            onChange={(e) => handleChange(e, index)}
                                            onPaste={handlePaste}
                                        />
                                    ))}
                                </div>
                                {seconds > 0 ? (
                                    <p className='text-gray-400'>OTP Expires in {seconds}</p>
                                ) : (
                                    showResend && <p onClick={handleResentOtp}>Resend OTP</p>
                                )}
                                <button className='bg-blue-600 mx-auto px-5 py-1 md:px-8 md:py-2 rounded-md text-black font-medium mt-4 ' onClick={handleVerification}>VERIFY</button>

                            </div>
                    }
                </div>
            </div >
        </div >

    )
}

export default Register