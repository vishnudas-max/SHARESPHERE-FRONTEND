import React, { useState, useContext, useEffect } from 'react'
import { ReactTyped } from "react-typed";
import api from '../../../Config'
import { RegisterContext } from '../../../Contexts/RegisterContextProvider';
import { ToastContainer, toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

function Register() {
    const { email, SaveEmail } = useContext(RegisterContext)
    const navigate = useNavigate()
    const [otp, setOtp] = useState(Array(4).fill(''));
    const [showResend, setShowResend] = useState(false);
    const [seconds, setSeconds] = useState(60);
    const handleChange = (e, index) => {
        const value = e.target.value;

        // Ensure only one digit is entered
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
    const handleVerification = (e) => {
        e.preventDefault()
        const otpNumber = otp.join('');
        console.log(otpNumber)
        let data = {
            "otp": otpNumber,
            "email": email
        }
        api.post('register/confirm/', data)
            .then(res => {
                navigate('/')
            })
            .catch(error => {
                toast.error(error.response.data.message, {
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
    const handleResentOtp = () => {

        console.log('hello')
        let data = {
            "email": email
        }
        api.post('register/resendotp/', data)
            .then(res => {
                console.log(res)
                toast.success(res.data.message, {
                    position: "top-right",
                    autoClose: 1000,
                    hideProgressBar: true,
                    closeOnClick: true,
                    pauseOnHover: false,
                    draggable: true,
                    style: { backgroundColor: 'green', color: 'black' },
                }
                )
                setSeconds(60); 
                setShowResend(false); 
            })
            .catch(res => {
                toast.warning(res.response.data.message, {
                    position: "top-right",
                    autoClose: 1000,
                    hideProgressBar: true,
                    closeOnClick: true,
                    pauseOnHover: false,
                    draggable: true,
                    style: { backgroundColor: 'red', color: 'black' },
                }
                );
                setTimeout(() => {
                    navigate('/register/');
                }, 1000);


            }
            )

    }

    useEffect(() => {
        if (email === null) {
            navigate('/register/')
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

        // Clear timeout on unmount or when seconds reach 0
        return () => clearTimeout(timer);
    }, [seconds]);

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
                    <form action="" className='max-w-[600px] mx-auto mt-3 backdrop-opacity-10 bg-black/80
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

                    </form>
                </div>
            </div >
        </div >

    )
}

export default Register