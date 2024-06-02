import React, { act, useEffect, useState } from 'react'
import AdminNavbar from './HelperComponents.jsx/AdminNavbar'
import { Link } from 'react-router-dom'
import { MdOutlinePersonSearch } from "react-icons/md";
import { debounce } from 'lodash'
import api from '../../../Config'
import { GrFormNextLink, GrFormPreviousLink } from "react-icons/gr";

function UserMangement() {
    const [searchQuery, setSearchQuery] = useState('');
    const access = localStorage.getItem('access');
    const [users, setUsers] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [next, setNext] = useState(null)
    const [prev, setPrev] = useState(null)

    const fetchUsers = async () => {
        try {
            const response = await api.get(`admin/users/?search=${searchQuery}&page=${currentPage}`, {
                headers: {
                    Authorization: `Bearer ${access}`
                }
            });
            setUsers(response.data.results);
            setNext(response.data.next)
            setPrev(response.data.previous)

        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, [searchQuery, currentPage]); // Add currentPage to the dependency array

    const handleSearch = debounce((value) => {
        setSearchQuery(value);
        setCurrentPage(1)
    }, 500);

    const handlePageChange = (action) => {
        if (action == 'n') {
            setCurrentPage(currentPage => currentPage + 1);
        } else {
            setCurrentPage(currentPage => currentPage - 1)
        }

    };

    const handleDelete =async (userID) =>{
        try {
            const response = await api.delete(`admin/users/${userID}/`, {
                headers: {
                    Authorization: `Bearer ${access}`
                }
            });
            fetchUsers()
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <>
            <AdminNavbar />
            <div className='text-white md:ml-[320px] max-w-full grid grid-cols-12 '>
                {/* header-- */}
                <div className='col-span-12 px-4 py-3 md:py-5 border-b border-gray-500 fixed w-full bg-[#000300]'>
                    <nav className="flex " aria-label="Breadcrumb">
                        <ol className="inline-flex items-center space-x-1 md:space-x-2 rtl:space-x-reverse">
                            <li className="inline-flex items-center">
                                <Link to={'/admin/dashboard/'} className="inline-flex items-center md:text-sm text-xs font-medium text-gray-700 hover:text-blue-600 dark:text-gray-400 dark:hover:text-white">
                                    <svg className="w-3 h-3 me-2.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                                    </svg>
                                    Admin
                                </Link>
                            </li>
                            <li>
                                <div className="flex items-center">
                                    <svg className="rtl:rotate-180 w-3 h-3 text-gray-400 mx-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 9 4-4-4-4" />
                                    </svg>
                                    <Link to={'/admin/dashboard/'} className="ms-1 md:text-sm text-xs font-medium text-gray-700 hover:text-blue-600 md:ms-2 dark:text-gray-400 dark:hover:text-white">Dashboard</Link>
                                </div>
                            </li>
                        </ol>
                    </nav>
                </div>
                {/* header-end-- */}

                {/* search-area--- */}
                <div className='col-span-12 mt-20 px-4'>
                    <h1 className='font-bold text-xl'>USERS</h1>
                    <div className='flex gap-x-2 items-center mt-4'>
                        <MdOutlinePersonSearch size={27} />
                        <input type="text" placeholder='Search here...' className='text-white border-b border-gray-600 outline-none bg-transparent' onChange={(e) => handleSearch(e.target.value)} />
                    </div>
                </div>
                {/* search area end here--- */}


                <div class="relative col-span-12 px-4 py-4 overflow-x-auto shadow-md sm:rounded-lg">
                    <table class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                        <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                            <tr>
                                <th scope="col" class="px-6 py-3">
                                    Username
                                </th>
                                <th scope="col" class="px-6 py-3">
                                    Profile Pic
                                </th>
                                <th scope="col" class="px-6 py-3">
                                    Total Posts
                                </th>
                                <th scope="col" class="px-6 py-3">
                                    Status
                                </th>
                                <th scope="col" class="px-6 py-3">
                                    Action
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {users && users.map((user, index) => (
                                <tr key={user.id} class="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                                    <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                        {user.username}
                                    </th>
                                    <td class="px-6 py-4">
                                        {user.profile_pic ?
                                          <img src={user.profile_pic} alt={user.username} className="h-10 w-10 rounded-full" />
                                        :
                                        'No Profile Pic'}
                                    </td>
                                    <td class="px-6 py-4 text-left pl-6">
                                        {user.post_count}
                                    </td>
                                    <td class="px-6 py-4">
                                        {user.is_active?
                                        <span className='text-black bg-green-500 px-4 font-semibold h-fit py-[1px] rounded-full'>Active</span>
                                        :
                                        <span className='text-black bg-red-500 px-3 font-semibold h-fit py-[1px] rounded-full' >Inactive</span>}
                                    </td>
                                    <td class="px-6 py-4 ">
                                        <a href="#" class="font-medium text-red-600 dark:text-red-500 hover:underline" onClick={()=>handleDelete(user.id)}>Delete</a>
                                    </td>
                                </tr>
                            ))
                            }
                            
                        </tbody>
                    </table>
                </div>

                <div className='col-span-12 px-2 mb-14'>
                    {/* pagination-- */}
                    <div className="flex justify-center mt-4 gap-x-3 items-center">
                        {prev &&
                            <GrFormPreviousLink onClick={() => handlePageChange('p')} className='size-6 md:size-9 text-gray-500 hover:text-white' />
                        }
                        <p className='text-sm md:text-xl  font-bold text-gray-500'>{currentPage}</p>
                        {next &&
                            <GrFormNextLink onClick={() => handlePageChange('n')} className='size-6 md:size-9 text-gray-500 hover:text-white' />
                        }
                    </div>
                    {/* pagination end here--- */}
                </div>
            </div>
        </>
    );
}

export default UserMangement