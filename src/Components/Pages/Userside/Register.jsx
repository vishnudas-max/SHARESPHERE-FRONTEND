import React, { useState, useContext } from 'react'
import { ReactTyped } from "react-typed";
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import api from '../../../Config'
import { useNavigate, Link } from 'react-router-dom'
import { RegisterContext } from '../../../Contexts/RegisterContextProvider';


function Register() {

    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirm, setConfirm] = useState('')
    const [firstname, setFirstname] = useState('')
    const [lastname, setLastname] = useState('')
    const [phonenumber, setPhonnumber] = useState('')
    const [isvisible, changeVisible] = useState(false)
    const [confirmisvisible, changeconfirmVisible] = useState(false)
    const navigate = useNavigate()
    const { setRegdata } = useContext(RegisterContext)
    const [errors, setErrors] = useState({
        username: '',
        email: '',
        password: '',
        confirm: '',
        firstname: '',
        lastname: '',
        phonenumber: ''

    })
    const handlefirstname = (e) => {

        if (e.target.value === '') {
            let obj = { ...errors, firstname: 'firstname cannot be empty' }
            setErrors(obj)
            setFirstname(e.target.value)
            return false
        }
        else if (e.target.value.startsWith(' ')) {
            let obj = { ...errors, firstname: 'First name cannot start with a space' };
            setErrors(obj);
            setFirstname(e.target.value);
            return false;
        }
        else if (e.target.value.length < 3) {
            let obj = { ...errors, firstname: 'firstname should be atleast three letters' }
            setErrors(obj)
            setFirstname(e.target.value)
            return false
        } else {
            let obj = { ...errors, firstname: '' }
            setErrors(obj)
            setFirstname(e.target.value)
            return true
        }

    }
    const handleusername = (e) => {

        if (e.target.value.length < 3) {
            let obj = { ...errors, username: 'Username should be atleast 3 letter size!' }
            setErrors(obj)
            setUsername(e.target.value)
            return false
        }
        else {
            let obj = { ...errors, username: '' }
            setErrors(obj)
            setUsername(e.target.value)
            return true
        }

    }
    const handlelastname = (e) => {
        setLastname(e.target.value)
    }
    const handlephonenumber = (e) => {

        if (e.target.value.length < 10) {
            let obj = { ...errors, phonenumber: 'Invalid mobile number !' }
            setErrors(obj)
            setPhonnumber(e.target.value)
            return false
        }
        else {
            let obj = { ...errors, phonenumber: '' }
            setErrors(obj)
            setPhonnumber(e.target.value)
            return true
        }

    }

    const handlemail = (e) => {
        var re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        let test_result = re.test(e.target.value)
        if (test_result) {
            let obj = { ...errors, email: '' }
            setEmail(e.target.value)
            setErrors(obj)
            return true
        } else {
            let obj = { ...errors, email: 'Invalid Email' }
            setErrors(obj)
            setEmail(e.target.value)
            return false
        }
    }

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

    const handlesubmit = (e) => {
        e.preventDefault()
        let hasErrors = false;
        Object.keys(errors).forEach(key => {
            console.log(errors[key])
            if (errors[key] !== '') {
                hasErrors = true
            }
        })
        if (hasErrors) {
            return; // Exit the function if there are errors
        }
        if (!username || !email || !password || !firstname || !phonenumber || !confirm) {
            toast('Fields cannnot be empty!', {
                position: "top-right",
                autoClose: 1000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: false,
                draggable: true,
                style: { backgroundColor: 'red', color: 'black' },
            })
            return false
        }
        let data = {
            "first_name" :firstname,
            "last_name":lastname,
            "phone_number":phonenumber,
            "username": username,
            "email": email,
            "password": password
        }
        api.post('register/', data)
            .then(data => {
                console.log(data.data)
                setRegdata({email:data.data.email,phonenumber:data.data.phone_number})
                navigate('/register/otp/')
            })
            .catch(errors => {
                console.log(errors)
                toast.error(errors.response.data.errors.non_field_errors[0], {
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
                        <h1 className=' font-sans font-bold py-2 text-xl sm:tex-2xl md:text-3xl mx-auto'>SIGN UP</h1>

                        {errors.firstname &&
                            <p className='text-red-500 font-light text-xs ms-2 md:text-sm'>{errors.firstname}</p>
                        }
                        <input type="text" placeholder='*First Name' className='w-[300px]
                         md:w-[450px]  bg-zinc-900 rounded-2xl px-5 py-2 md:py-3 font-thin mb-3'
                            onChange={e => handlefirstname(e)} value={firstname}
                        />
                        {errors.lastname &&
                            <p className='text-red-500 font-light text-xs ms-2 md:text-sm'>{errors.lastname}</p>
                        }
                        <input type="text" placeholder='*Last Name' className='w-[300px]
                         md:w-[450px]  bg-zinc-900 rounded-2xl px-5 py-2 md:py-3 font-thin mb-3'
                            onChange={e => handlelastname(e)} value={lastname}
                        />
                        {errors.username &&
                            <p className='text-red-500 font-light text-xs ms-2 md:text-sm'>{errors.username}</p>
                        }
                        <input type="text" placeholder='*Username' className='w-[300px]
                         md:w-[450px]  bg-zinc-900 rounded-2xl px-5 py-2 md:py-3 font-thin mb-3'
                            onChange={e => handleusername(e)} value={username}
                        />

                        {errors.email &&
                            <p className='text-red-500 font-light text-xs ms-2 md:text-sm'>{errors.email}</p>
                        }
                        <input type="text" placeholder='*Email' className='w-[300px]
                         md:w-[450px] bg-zinc-900 rounded-2xl px-5 py-2 md:py-3 font-thin mb-3'
                            onChange={e => handlemail(e)} value={email} />

                        {errors.phonenumber &&
                            <p className='text-red-500 font-light text-xs ms-2 md:text-sm'>{errors.phonenumber}</p>
                        }
                        <input
                            type="number"
                            placeholder="*Phone Number"
                            className="w-[300px] md:w-[450px] bg-zinc-900 rounded-2xl px-5 py-2 md:py-3 font-thin mb-3 no-spinner"
                            onChange={e => handlephonenumber(e)}
                            value={phonenumber}
                            maxLength={10}
                            onInput={(e) => {
                                e.target.value = e.target.value.slice(0, 10); // Ensure max length
                            }}
                    
                        />



                        {errors.password &&
                            <p className='text-red-500 font-light text-xs ms-2 md:text-sm'>{errors.password}</p>
                        }
                        <div className='flex items-center w-fit relative h-fit mb-3'>
                            <input type={confirmisvisible ? 'text' : 'password'} placeholder='*Password' className='w-[300px]
                         md:w-[450px] bg-zinc-900 rounded-2xl pl-5 pr-9 py-2 md:py-3 font-thin  '
                                onChange={e => handlepassword(e)} value={password} />
                            {confirmisvisible ?
                                <AiOutlineEye className='absolute right-2 cursor-pointer' size={18} onClick={() => changeconfirmVisible(!confirmisvisible)} /> :
                                <AiOutlineEyeInvisible className='absolute right-2 cursor-pointer' size={18} onClick={() => changeconfirmVisible(!confirmisvisible)} />
                            }
                        </div>
                        {errors.confirm &&
                            <p className='text-red-500 font-light text-xs ms-2 md:text-sm'>{errors.confirm}</p>
                        }
                        <div className='flex items-center w-fit relative h-fit mb-3'>
                            <input type={isvisible ? 'text' : 'password'}
                                placeholder='*Confirm Password' className='w-[300px]
                                md:w-[450px] bg-zinc-900 rounded-2xl py-2 pl-5 pr-9 md:py-3 font-thin '
                                onChange={e => handleconfirm(e)} value={confirm} />
                            {isvisible ?
                                <AiOutlineEye className='absolute right-2 cursor-pointer ' size={18} onClick={() => changeVisible(!isvisible)} /> :
                                <AiOutlineEyeInvisible className='absolute right-2 cursor-pointer' size={18} onClick={() => changeVisible(!isvisible)} />
                            }

                        </div>

                        <button className='bg-blue-600 mx-auto px-5 py-1 md:px-8 md:py-2 rounded-md text-black font-medium ' onClick={handlesubmit}>SIGN UP</button>
                        <p className='text-xs font-bold tracking-wide mt-3'>Already have an Account ?<Link to={'/'}><span className='text-blue-700 ms-2 cursor-pointer'>click here</span></Link></p>


                    </form>
                </div>
            </div>
        </div>

    )
}

export default Register