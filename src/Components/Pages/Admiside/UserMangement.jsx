import React from 'react'
import AdminNavbar from './HelperComponents.jsx/AdminNavbar'
import { Link } from 'react-router-dom'

function UserMangement() {
    return (

        <>
            <AdminNavbar />
            <div className='text-white md:ml-[320px] max-w-full grid grid-cols-12 '>
                <div className='col-span-12 px-4 py-3 md:py-5 border-b border-gray-500 fixed w-full bg-[#000300]'>
                    <nav class="flex " aria-label="Breadcrumb">
                        <ol class="inline-flex items-center space-x-1 md:space-x-2 rtl:space-x-reverse">
                            <li class="inline-flex items-center">
                                <Link to={'/admin/dashboard/'} class="inline-flex items-center md:text-sm text-xs font-medium text-gray-700 hover:text-blue-600 dark:text-gray-400 dark:hover:text-white">
                                    <svg class="w-3 h-3 me-2.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                                    </svg>
                                    Admin
                                </Link>
                            </li>
                            <li>
                                <div class="flex items-center">
                                    <svg class="rtl:rotate-180 w-3 h-3 text-gray-400 mx-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 9 4-4-4-4" />
                                    </svg>
                                    <Link to={'/admin/dashboard/'} class="ms-1 md:text-sm text-xs font-medium text-gray-700 hover:text-blue-600 md:ms-2 dark:text-gray-400 dark:hover:text-white">Dashboard</Link>
                                </div>
                            </li>
                        </ol>
                    </nav>
                </div>
            </div>

        </>
    )
}

export default UserMangement