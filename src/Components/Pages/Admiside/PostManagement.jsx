import React, {  useEffect, useState } from 'react'
import AdminNavbar from './HelperComponents.jsx/AdminNavbar'
import api from '../../../Config'
import { GrFormNextLink, GrFormPreviousLink } from "react-icons/gr";
import { IoCloseSharp } from "react-icons/io5";

function PostManagement() {

    const access = localStorage.getItem('access');
    const [posts, setPosts] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [next, setNext] = useState(null)
    const [prev, setPrev] = useState(null)
    const [reports, setReports] = useState(null)
    const [showReports, toggleShowReport] = useState(null)
    const [postFilter, setpostFilter] = useState(false)
    const [zoomContend, toggleZoomcontend] = useState(null)


    const fetchposts = async () => {
        try {
            const response = await api.get(`admin/posts/?page=${currentPage}&show_deleted=${postFilter}`, {
                headers: {
                    Authorization: `Bearer ${access}`
                }
            });
            console.log(response.data.results)
            setPosts(response.data.results);
            setNext(response.data.next)
            setPrev(response.data.previous)

        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        fetchposts();
    }, [currentPage, postFilter]);


    const handlePageChange = (action) => {
        if (action === 'n') {
            setCurrentPage(currentPage => currentPage + 1);
        } else {
            setCurrentPage(currentPage => currentPage - 1)
        }

    };

    const handleDelete = async (postID) => {
        try {
            const response = await api.delete(`admin/posts/${postID}/`, {
                headers: {
                    Authorization: `Bearer ${access}`
                }
            });
            fetchposts()
        } catch (error) {
            console.log(error);
        }
    }

    const seeReports = async (id, username) => {
        try {
            const response = await api.get(`admin/post/reports/${id}/`, {
                headers: {
                    Authorization: `Bearer ${access}`
                }
            })
            console.log(response.data)
            setReports(response.data)
            toggleShowReport(username)

        } catch (error) {
            console.log(error)
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
                                <p className="inline-flex items-center md:text-sm text-xs font-medium text-gray-700 hover:text-blue-600 dark:text-gray-400 dark:hover:text-white">
                                    <svg className="w-3 h-3 me-2.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                                    </svg>
                                    Admin
                                </p>
                            </li>
                            <li>
                                <div className="flex items-center">
                                    <svg className="rtl:rotate-180 w-3 h-3 text-gray-400 mx-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 9 4-4-4-4" />
                                    </svg>
                                    <p className="ms-1 md:text-sm text-xs font-medium text-gray-700 hover:text-blue-600 md:ms-2 dark:text-gray-400 dark:hover:text-white">Post Management</p>
                                </div>
                            </li>
                        </ol>
                    </nav>
                </div>
                {/* header-end-- */}

                {/* search-area--- */}
                <div className='col-span-12 mt-20 px-4'>
                    <h1 className='font-bold text-xl'>posts</h1>
                    <div className='flex gap-x-3'>
                        <h1 className={`' cursor-pointer h-fit font-bold mt-4 mt-4'${postFilter ? ' text-gray-700' : 'text-white'}`} onClick={() => setpostFilter(false)}>Active posts</h1>
                        <h1 className={`'h-fit cursor-pointer font-bold mt-4 border-l-2 pl-2 '${postFilter ? 'text-white' : ' text-gray-700'}`} onClick={() => setpostFilter(true)}>Deleted posts</h1>
                    </div>


                </div>
                {/* search area end here--- */}

                {/* showing reports in detailes-- */}
                {(showReports || zoomContend) && (
                    <div className='absolute h-fit pt-8 pb-2 px-3 md:left-[320px] left-0 top-[160px] backdrop-blur-xl backdrop-brightness-50 z-20 right-0'>
                        {/* for reports */}
                        {showReports ? (
                            <div className='max-w-[300px] mx-auto px-3 py-2 h-fit bg-gray-900'>
                                <h1 className='text-center'>All Reports against the post owned by {showReports}</h1>
                                <div className='w-full h-[1px] bg-white mt-2 mb-2'></div>
                                {reports && reports.map((report, index) => (
                                    <div key={index} className='flex gap-x-2 mt-2'>
                                        <p>{index + 1}.</p>
                                        <p className='text-sm'>Reported by {report.reported_by} : {report.report_reason}</p>
                                    </div>
                                ))}
                                <button
                                    className='w-fit mt-2 flex items-center gap-x-1 rounded-md bg-red-600 px-2 py-1'
                                    onClick={() => toggleShowReport(null)}
                                >
                                    <IoCloseSharp className='size-6' />Close
                                </button>
                            </div>
                        ) : (
                            // for zoomed image
                            <div className='max-w-[700px] mx-auto px-3 py-2 h-fit bg-gray-900'>
                                <img src={posts[zoomContend.index].contend} alt="Zoomed Content" />
                                <button
                                    className='w-fit mt-2 flex items-center gap-x-1 rounded-md bg-red-600 px-2 py-1'
                                    onClick={() => toggleZoomcontend(null)}
                                >
                                    <IoCloseSharp className='size-6' />Close
                                </button>
                            </div>
                        )}
                    </div>
                )}

                {/* showing reports in detiles end here-- */}

                <div class="relative col-span-12 px-4 py-4 overflow-x-auto shadow-md sm:rounded-lg">

                    <table class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                        <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                            <tr>
                                <th scope="col" class="px-6 py-3">
                                    ID
                                </th>
                                <th scope="col" class="px-6 py-3">
                                    User
                                </th>
                                <th scope="col" class="px-6 py-3">
                                    Caption
                                </th>
                                <th scope="col" class="px-6 py-3">
                                    Contend
                                </th>
                                <th scope="col" class="px-6 py-3">
                                    Total Likes
                                </th>
                                <th scope="col" class="px-6 py-3">
                                    Total Reports
                                </th>
                                {!postFilter &&
                                    <th scope="col" class="px-6 py-3">
                                        Status
                                    </th>}
                                {!postFilter && <th scope="col" class="px-6 py-3">
                                    Action
                                </th>}
                            </tr>
                        </thead>
                        <tbody>
                            {posts && posts.map((post, index) => (
                                <tr key={index} class="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                                    <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                        {post.id}
                                    </th>
                                    <th scope="row" class="px-6 py-4 font-thin text-gray-900 whitespace-nowrap dark:text-white">
                                        {post.username}
                                    </th>
                                    <th scope="row" class="px-6 py-4 font-thin text-gray-900 whitespace-nowrap dark:text-white">
                                        {post.caption}
                                    </th>
                                    <td class="px-6 py-4">
                                        {post.contend ?
                                            <img src={post.contend} alt={post.contend} className="size-9 cursor-pointer"
                                                onClick={() => {
                                                    if (zoomContend) {
                                                        toggleZoomcontend(null)
                                                    }
                                                    toggleZoomcontend({ index: index })
                                                }}
                                            />
                                            :
                                            'No contend'}
                                    </td>
                                    <td class="px-6 py-4 text-left pl-6">
                                        {post.total_likes} likes
                                    </td>
                                    <td class="px-6 py-4 text-left pl-6">
                                        {post.report_count > 0 ?
                                            <p className='cursor-pointer' onClick={() => seeReports(post.id, post.username)}>See all {post.report_count} Reports </p>
                                            : 'No reports'}
                                    </td>
                                    {!postFilter &&
                                        <td class="px-6 py-4">
                                            {post.is_deleted === false &&
                                                <span className='text-black bg-green-500 px-3 font-semibold h-fit py-[1px] rounded-full' >Active</span>}
                                        </td>}
                                    {!postFilter && <td class="px-6 py-4 ">
                                        {post.report_count > 4 && post.is_deleted === false && <a href="#" class="font-medium text-red-600 dark:text-red-500 hover:underline" onClick={() => handleDelete(post.id)}>Delete</a>}
                                    </td>}
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

export default PostManagement