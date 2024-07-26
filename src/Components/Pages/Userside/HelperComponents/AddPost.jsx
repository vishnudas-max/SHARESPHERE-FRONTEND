import React, { useState, useRef, useEffect } from 'react'
import { FaImage } from "react-icons/fa6";
import { IoClose } from "react-icons/io5";
import api from '../../../../Config'
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { delPost } from '../../../../Redux/PostSlice';
import { ToastContainer, toast } from 'react-toastify';
import { FaCircleUser } from "react-icons/fa6";



function AddPost({ setAddPost }) {
    const dispatch = useDispatch()
    const [caption, setCaption] = useState('')
    const [contend, setConted] = useState(null)
    const userID = useSelector(state => state.authInfo.userID)
    const [contentError,setContentError] = useState('')
    const username = useSelector(state => state.authInfo.username)
    const [userData,setUserData] = useState(null)
    const access = localStorage.getItem('access')

    const imgref = useRef()

    const fetchProfile = async () => {
        try {
            const response = await api.get(`user/profile/detailes/${userID}/`, {
                headers: {
                    Authorization: `Bearer ${access}`
                }
            })
            setUserData(response.data)

        }
        catch (error) {
            console.log(error)
        }
    }

    const handleClose = () => {
        setAddPost(false)
    }

    const handlepostconted = (event) => {
        const file = event.target.files[0];
        if (file) {
          const allowedFormats = ['image/jpeg', 'image/jpg', 'image/webp'];
          if (allowedFormats.includes(file.type)) {
            setConted(file);
          } else {
            setContentError('Unsupported image format. Please upload a valid image file.');
            setTimeout(() => {
              setContentError('')
            }, [2000])
    
          }
        }
      };

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

    useEffect(()=>{
        if(userData === null)
        fetchProfile()
    })
    return (
        <div className='w-screen flex h-screen fixed  backdrop-blur-md z-30 justify-center px-10'>
             <ToastContainer />
            <IoClose color='white' className='size-9 md:size-10 absolute right-3 top-3' onClick={handleClose} />
            <div className='max-w-[340px] md:max-w-[900px] bg-gray-900 h-fit text-white p-4 rounded-md mt-20 md:mt-21'>
                <h1 className='w-full border-b border-gray-400 text-[16px] font-semibold md:text-3xl py-2'>Create Post</h1>
                <div className='flex gap-x-2 py-2 items-center text-[12px] md:text-[14px]'>
                    {
                        userData && userData.profile_pic ?
                        <div>
                            <img src={userData.profile_pic} alt="profile_pic" className='size-9 rounded-full border border-gray-400'/>
                        </div>
                        :
                        <div>
                            <FaCircleUser className='size-9'/>
                        </div>
                    }
                    <p>{username}</p>
                </div>
                <form action="" className='max:w-[340px] md:max:w-[700px] relative'>
                    <input type="text" placeholder="What's happening...." className='bg-transparent border-b border-gray-500 outline-none w-[300px] md:w-[700px] '
                        onChange={e => setCaption(e.target.value)} value={caption} />

                    <input type="file" accept="image/*" class="w-full text-sm text-slate-500 mt-3  hidden"
                        onChange={e =>handlepostconted(e)}
                        ref={imgref}
                    />
                    <div>
                    <FaImage color='blue' className='mt-3 md:size-9 size-6' onClick={() => imgref.current.click()} />
                    {contentError && <p className='text-red-600'>{contentError}</p>}
                    </div>
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