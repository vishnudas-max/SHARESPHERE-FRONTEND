import React, { useState, useCallback } from 'react'
import { FaUsersCog } from "react-icons/fa";
import { AiFillDashboard } from 'react-icons/ai'
import { delAuth } from '../../../../Redux/UserdataSlice'
import { useDispatch } from 'react-redux'
import { BsFillFileImageFill } from "react-icons/bs";
import { MdReport,MdVerified  } from "react-icons/md";
import { BiLogOutCircle } from "react-icons/bi";
import { Link } from 'react-router-dom';

function AdminNavbar() {
    const dispatch = useDispatch()
    const handleLogout = () => {
        localStorage.clear()
        dispatch(delAuth())

    }
    return (
        <div className='text-white '>
            <nav className='border-r border-gray-700  w-[320px] h-screen hidden  md:block fixed top-0 bg-[#000300]'>
                <div className='max-w-[200px] mx-auto pt-9'>
                    <h1 className='text-white text-2xl font-semibold'><span className='text-3xl font-bold'>S</span>HARESPHERE</h1>
                </div>
                <div className='max-w-[200px] mx-auto mt-4'>
                    <ul className='flex-col'>
                        <Link to={'/admin/dashboard/'}><li className='flex gap-x-2 py-2 mt-3 cursor-pointer hover:bg-gray-900 rounded-md px-1 md:text-[18px] font-semibold'><span><AiFillDashboard size={24} /></span>Dashboard</li></Link>
                        <Link to={'/admin/usermanagement/'}><li className='flex gap-x-2 py-2 mt-3 cursor-pointer hover:bg-gray-900 rounded-md px-1 md:text-[18px] font-semibold'><span><FaUsersCog size={24} /></span>User Management</li></Link>
                        <Link to={'/admin/postmanagement/'}><li className='flex gap-x-2 py-2 mt-3 cursor-pointer hover:bg-gray-900 rounded-md px-1 md:text-[18px] font-semibold'><span><BsFillFileImageFill size={24} /></span>Post Management</li></Link>
                        {/* <li className='flex gap-x-2 py-2 mt-3 cursor-pointer hover:bg-gray-900 rounded-md px-1 md:text-[18px] font-semibold'><span><MdReport size={24} /></span>Reports</li> */}
                        <Link to={'/admin/verifications/'}><li className='flex gap-x-2 py-2 mt-3 cursor-pointer hover:bg-gray-900 rounded-md px-1 md:text-[18px] font-semibold' ><span><MdVerified  size={24} /></span>Verifications</li></Link>

                    </ul>
                </div>
                <p className='text-red-600 font-semibold absolute bottom-10 left-14 cursor-pointer flex gap-x-2 items-center' onClick={handleLogout}><BiLogOutCircle size={24}/>LOGOUT</p>
            </nav>

            <nav className='border-t border-gray-700 fixed  flex p-1 w-screen bottom-0 md:bottom-[-100%] transition-all ease-in-out delay-700 bg-[#000300] z-40'>
                <ul className='flex justify-between px-5 w-full items-center p-1'>
                <Link to={'/admin/dashboard/'}><li className='flex gap-x-2 p-1 cursor-pointer hover:bg-gray-900 rounded-md px-2 md:text-xl'><span><AiFillDashboard size={20} /></span></li></Link>
                <Link to={'/admin/usermanagement/'}><li className='flex gap-x-2 p-1 cursor-pointer hover:bg-gray-900 rounded-md px-2 md:text-xl'><span><FaUsersCog size={20} /></span></li></Link>
                <Link to={'/admin/postmanagement/'}> <li className='flex gap-x-2 p-1 cursor-pointer hover:bg-gray-900 rounded-md px-2 md:text-xl'><span><BsFillFileImageFill size={20} /></span></li></Link>
                <Link to={'/admin/verifications/'}>   <li className='flex gap-x-2 p-1 cursor-pointer hover:bg-gray-900 rounded-md px-2 md:text-xl'><span><MdVerified  size={20} /></span></li></Link>
                 <li className='flex gap-x-2 p-1 cursor-pointer hover:bg-gray-900 rounded-md px-2 md:text-xl' onClick={handleLogout}><span><BiLogOutCircle size={24} className='text-red-600'/></span></li>
                </ul>
            </nav>
        </div>

    )
}

export default AdminNavbar