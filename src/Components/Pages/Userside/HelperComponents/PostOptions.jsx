import React,{useState} from 'react'
import { Link } from 'react-router-dom'
import api from './../../../../Config'
import { useDispatch } from 'react-redux'
import { delPost } from '../../../../Redux/PostSlice'
import { useNavigate } from 'react-router-dom'


function PostOptions({ animate, id }) {
    const navigate = useNavigate()
    const [isLoading,setLoading] = useState(false)
    const access = localStorage.getItem('access')
    const dispatch = useDispatch()
    const handleDelete = async () => {
        setLoading(true)
        try {
            const response =await api.delete(`posts/${id}/`,
                {
                    headers: {
                        Authorization: `Bearer ${access}`
                    }
                }
            )
            dispatch(delPost())
            setLoading(false)
            navigate('/home/')
        }
        catch(error){
            setLoading(false)
            console.log('Something went wrong')
        }
    }
    return (
        <div className={`absolute top-7 right-7 bg-[#000300] px-4 md:px-6 py-3 h-fit transition-all ease-in-out delay-800${animate ? 'scale-100 ' : 'scale-0'} rounded-md flex justify-center w-fit `}>
            <ul className='text-xs md:text-[15px]'>
                <Link to={`/home/post/edit/${id}`}><li className='text-yellow-500 select-none'>Edit</li></Link>
               {isLoading ?
                <li className='text-red-600 mt-1 md:mt-3 select-none cursor-pointer animate-pulse'>
                    Delete
                </li>
               :<li className='text-red-600 mt-1 md:mt-3 select-none cursor-pointer' onClick={handleDelete}>Delete</li>}
            </ul>
            
        </div>
    )
}

export default PostOptions