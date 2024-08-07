import React, { useState, useRef, useEffect } from 'react'
import { FaImage } from 'react-icons/fa'
import { useSelector, useDispatch } from 'react-redux'
import api from '../../../Config'
import { useParams, useNavigate } from 'react-router-dom'
import { edit_post } from '../../../Redux/PostSlice'
import CallSocketProvider from '../../../Contexts/CallSocketProvider'
import IncomingCall from './HelperComponents/IncomingCall'
import { FaCircleUser } from "react-icons/fa6";


function EditPost() {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [caption, setCaption] = useState('')
    const [contend, setConted] = useState(null)
    const username = useSelector(state => state.authInfo.username)
    const userID = useSelector(state => state.authInfo.userID)
    const { id } = useParams()
    const access = localStorage.getItem('access')
    const imgref = useRef()
    const [userData,setUserData] = useState(null)
    const [contentError,setContentError] = useState('')
    const [error,SetError] = useState('')

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

    const handelPost = async (e) => {
        e.preventDefault()
        const formData = new FormData()
        formData.append('id', id)
        if (caption) {
            formData.append('caption', caption)
        }
        if (contend) {
            formData.append('contend', contend)
        }


        try {
            const res = await api.patch('post/', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${access}`,
                },
            })
            console.log(res.data)
            let id = res.data.id
            let caption = res.data.caption
            let contend = res.data.contend
            dispatch(edit_post({ id, caption, contend }))
            navigate(-1,{replace:true})
        }
        catch (error) {
            if(error.response.data.message){
                SetError(error.response.data.message)
                setTimeout(() => {
                    SetError('')
                }, 2000);
            }
            console.log(error.response)
        }

    }

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
    useEffect(()=>{
        if(userData === null){
            fetchProfile()
        }
    },[])

    return (
        <>
            <CallSocketProvider>
                <IncomingCall />
            </CallSocketProvider>
            <div className='w-screen flex h-screen fixed  backdrop-blur-md z-30 justify-center px-10'>
                {/* <IoClose color='white' className='size-9 md:size-10 absolute right-3 top-3' onClick={handleClose} /> */}
                <div className='max-w-[340px] md:max-w-[900px] bg-gray-900 h-fit text-white p-4 rounded-md mt-20 md:mt-21'>
                    <h1 className='w-full border-b border-gray-400 text-[16px] font-semibold md:text-3xl py-2'>Edit Post</h1>
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
                            onChange={e => handlepostconted(e)}
                            ref={imgref}
                        />
                        <div className='flex gap-2 items-center'>
                        <FaImage color='blue' className='mt-3 md:size-9 size-6' onClick={() => imgref.current.click()} />
                        {contentError && <p className='text-red-600 '>{contentError}</p>}
                        </div>
                        {error && <p className='text-red-600 text-xs'>{error}</p>}
                        <div className='w-[340px] md:w-[700px]'>
                            <button onClick={handelPost} className='text-[13px] md:text-[15px] font-semibold  mt-4 px-3 rounded-md border md:py-1 md:px-5 hover:text-black hover:bg-slate-300 border-gray-300 mb-3'>POST</button>
                            <img src={contend ? URL.createObjectURL(contend) : ''} alt="" className='h-[150px] md:h-[200px]' />
                        </div>
                    </form>
                </div>

            </div>
        </>
    )
}

export default EditPost