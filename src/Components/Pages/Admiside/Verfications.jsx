
import React, { useEffect, useState } from 'react'
import AdminNavbar from './HelperComponents.jsx/AdminNavbar'
import api from '../../../Config'
import { GrFormNextLink, GrFormPreviousLink } from "react-icons/gr";
import { TiTick } from "react-icons/ti";
import { IoClose } from "react-icons/io5";

function Verfications() {

    const access = localStorage.getItem('access');
    const [verificationsRequests, setVerifications] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [next, setNext] = useState(null)
    const [prev, setPrev] = useState(null)
    const [reports, setReports] = useState(null)
    const [showReports, toggleShowReport] = useState(null)
    const [postFilter, setpostFilter] = useState(false)
    const [zoomContend, toggleZoomcontend] = useState(null)
    const [accepted, toggleAccepted] = useState(false)
    const [rejected, toggleRejected] = useState(false)



    const fetchVerificationRequests = async () => {
        try {
            const response = await api.get(`admin/verifications/?page=${currentPage}&accepted=${accepted}&rejected=${rejected}`, {
                headers: {
                    Authorization: `Bearer ${access}`
                }
            });
            console.log(response.data.results)
            setVerifications(response.data.results);
            setNext(response.data.next)
            setPrev(response.data.previous)

        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        fetchVerificationRequests();
    }, [currentPage, accepted, rejected]);


    const handlePageChange = (action) => {
        if (action === 'n') {
            setCurrentPage(currentPage => currentPage + 1);
        } else {
            setCurrentPage(currentPage => currentPage - 1)
        }

    };

    const acceptRequest = async (id) => {
        try {
            const response = await api.post(`admin/verifications/${id}/accept/`, {}, {
                headers: {
                    Authorization: `Bearer ${access}`
                }
            })
            fetchVerificationRequests()
        } catch (error) {
            console.log(error)
        }
    }

    const rejectRequest = async (id) => {
        try {
            const response = await api.post(`admin/verifications/${id}/reject/`, {}, {
                headers: {
                    Authorization: `Bearer ${access}`
                }
            })
            fetchVerificationRequests()
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
                                    <p className="ms-1 md:text-sm text-xs font-medium text-gray-700 hover:text-blue-600 md:ms-2 dark:text-gray-400 dark:hover:text-white">Verfications</p>
                                </div>
                            </li>
                        </ol>
                    </nav>
                </div>
                {/* header-end-- */}

                {zoomContend
                    &&
                    <div className='absolute h-fit pt-8 pb-2 px-3 md:left-[320px] left-0 top-[160px] backdrop-blur-xl backdrop-brightness-50 z-20 right-0'>
                        <div className='max-w-[700px] mx-auto px-3 py-2 h-fit bg-gray-900'>
                            <img src={verificationsRequests[zoomContend.index].document} alt="Zoomed Content" />
                            <button
                                className='w-fit mt-2 flex items-center gap-x-1 rounded-md bg-red-600 px-2 py-1'
                                onClick={() => toggleZoomcontend(null)}
                            >
                                <IoClose className='size-6' />Close
                            </button>
                        </div>
                    </div>
                }


                <div class="relative col-span-12 px-4 py-4 overflow-x-auto shadow-md sm:rounded-lg mt-20">
                    <div className='text-white clear-start flex gap-x-4'>
                        <h1 className={`text-xl pr-2  font-semibold cursor-pointer mb-3 border-r ${(!accepted && !rejected) ? 'text-white' : 'text-gray-600'}`} onClick={() => {
                            toggleAccepted(false)
                            toggleRejected(false)
                        }}>Pending</h1>
                        <h1 className={`text-xl font-semibold cursor-pointer  mb-3 border-r pr-2 ${accepted ? 'text-white' : 'text-gray-600'}`} onClick={() => {
                            if (rejected) {
                                toggleRejected(false)
                            }
                            toggleAccepted(true)
                        }}>Accepted</h1>
                        <h1 className={`text-xl cursor-pointer font-semibold mb-3 ${rejected ? 'text-white' : 'text-gray-600'}`} onClick={() => {
                            if (accepted) {
                                toggleAccepted(false)
                            }
                            toggleRejected(true)
                        }}>Rjected</h1>
                    </div>
                    {verificationsRequests && verificationsRequests.length < 1 ?
                        <h1 className='text-3xl font-bold text-center mt-52 text-gray-600'>{(!accepted && !rejected) ? 'No pending Requests' :
                            (accepted ? 'No accepted Request' : (rejected && 'No rejected Request'))}</h1>
                        :
                        <table class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                            <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                                <tr>
                                    <th scope="col" class="px-6 py-3">
                                        ID
                                    </th>
                                    <th scope="col" class="px-6 py-3">
                                        Username
                                    </th>
                                    <th scope="col" class="px-6 py-3">
                                        Document Type
                                    </th>
                                    <th scope="col" class="px-6 py-3">
                                        Document Number
                                    </th>
                                    {!accepted && !rejected && (
                                        <>
                                            <th scope="col" className="px-6 py-3">
                                                Accept
                                            </th>
                                            <th scope="col" className="px-6 py-3">
                                                Reject
                                            </th>
                                        </>
                                    )}
                                </tr>
                            </thead>
                            <tbody>
                                {verificationsRequests && verificationsRequests.map((request, index) => (
                                    <tr key={index} class="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                                        <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                            {request.id}
                                        </th>
                                        <th scope="row" class="px-6 py-4 font-thin text-gray-900 whitespace-nowrap dark:text-white">
                                            {request.userID}
                                        </th>
                                        <th scope="row" class="px-6 py-4 font-thin text-gray-900 whitespace-nowrap dark:text-white">
                                           {request.document_type}
                                        </th>
                                        <th scope="row" class="px-6 py-4 font-thin text-gray-900 whitespace-nowrap dark:text-white">
                                           {request.document_number}
                                        </th>
                                        {!accepted && !rejected &&
                                            <>
                                                <td class="px-6 py-4">
                                                    <TiTick className='text-green-600 size-9 cursor-pointer' onClick={() => acceptRequest(request.id)} />
                                                </td>
                                                <td class="px-6 py-4 text-left pl-6">
                                                    <IoClose className='text-red-600 size-9 cursor-pointer' onClick={() => rejectRequest(request.id)} />
                                                </td>
                                            </>
                                        }
                                    </tr>
                                ))
                                }

                            </tbody>
                        </table>
                    }
                </div>

                <div className='col-span-12 px-2 mb-14'>
                    {/* pagination-- */}
                    {verificationsRequests && verificationsRequests.length >= 1 && <div className="flex justify-center mt-4 gap-x-3 items-center">
                        {prev &&
                            <GrFormPreviousLink onClick={() => handlePageChange('p')} className='size-6 md:size-9 text-gray-500 hover:text-white' />
                        }
                        <p className='text-sm md:text-xl  font-bold text-gray-500'>{currentPage}</p>
                        {next &&
                            <GrFormNextLink onClick={() => handlePageChange('n')} className='size-6 md:size-9 text-gray-500 hover:text-white' />
                        }
                    </div>}
                    {/* pagination end here--- */}
                </div>
            </div>
        </>
    );
}

export default Verfications