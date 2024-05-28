import React, { useState, useRef } from 'react'
import messi from '../../../../media/images/messi.webp'
import { FaImage } from "react-icons/fa6";
import { IoClose } from "react-icons/io5";
import api from '../../../../Config'
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { delPost } from '../../../../Redux/PostSlice';
import { ToastContainer, toast } from 'react-toastify';


function AddPost({ setAddPost }) {
    const dispatch = useDispatch()
    const [caption, setCaption] = useState('')
    const [contend, setConted] = useState(null)
    const userID = useSelector(state => state.authInfo.userID)

    const imgref = useRef()

    const handleClose = () => {
        setAddPost(false)
    }

    const handelPost =async(e) => {
        e.preventDefault()
        const access = localStorage.getItem('access')
        const formData = new FormData();
        if(!caption){
            toast.error('Caption cannot be empty !', {
                position: "top-right",
                autoClose: 1000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: false,
                draggable: true,
                style: { backgroundColor: 'red', color: 'black' },
            })
            return
        }
        if(!contend){
            toast.error('Provide Post image', {
                position: "top-right",
                autoClose: 1000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: false,
                draggable: true,
                style: { backgroundColor: 'red', color: 'black' },
            })
            return
        }
        formData.append("userID", userID)
        formData.append("caption", caption)
        formData.append("contend", contend)
        console.log(formData)
        try{
            const response =await api.post('post/', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                Authorization: `Bearer ${access}`,
            },
        })
        setAddPost(false)
        dispatch(delPost())
        // navigate(`/home/`)
        }
        catch(error){
            console.log('failed to create post',error)
        }


    }
    return (
        <div className='w-screen flex h-screen fixed  backdrop-blur-md z-30 justify-center px-10'>
             <ToastContainer />
            <IoClose color='white' className='size-9 md:size-10 absolute right-3 top-3' onClick={handleClose} />
            <div className='max-w-[340px] md:max-w-[900px] bg-gray-900 h-fit text-white p-4 rounded-md mt-20 md:mt-21'>
                <h1 className='w-full border-b border-gray-400 text-[16px] font-semibold md:text-3xl py-2'>Create Post</h1>
                <div className='flex gap-x-2 py-2 items-center text-[12px] md:text-[14px]'>
                    <img src={messi} alt="profilepic" className='size-7 rounded-full md:size-10' />
                    <p>_John02</p>
                </div>
                <form action="" className='max:w-[340px] md:max:w-[700px] relative'>
                    <input type="text" placeholder="What's happening...." className='bg-transparent border-b border-gray-500 outline-none w-[300px] md:w-[700px] '
                        onChange={e => setCaption(e.target.value)} value={caption} />

                    <input type="file" accept="image/*" class="w-full text-sm text-slate-500 mt-3  hidden"
                        onChange={e => setConted(e.target.files[0])}
                        ref={imgref}
                    />
                    <FaImage color='blue' className='mt-3 md:size-9 size-6' onClick={() => imgref.current.click()} />
                    <div className='w-[340px] md:w-[700px]'>
                        <button onClick={handelPost} className='text-[13px] md:text-[15px] font-semibold  mt-4 px-3 rounded-md border md:py-1 md:px-5 hover:text-black hover:bg-slate-300 border-gray-300 mb-3'>POST</button>
                        {contend &&
                            <img src={URL.createObjectURL(contend)} alt="" className='max-w-[300px] md:max-w-[700px] md:max-h-[350px] max-h-[250px]' />
                        }
                    </div>
                </form>
            </div>

        </div>
    )
}

export default AddPost