import React, { useEffect, useState, useCallback } from 'react';
import Navbar from './HelperComponents/Navbar';
import IncomingCall from './HelperComponents/IncomingCall';
import CallSocketProvider from '../../../Contexts/CallSocketProvider';
import InfiniteScroll from 'react-infinite-scroll-component';
import { IoIosSearch } from "react-icons/io";
import { ToastContainer } from 'react-toastify';
import api from '../../../Config';
import { Link } from 'react-router-dom';
import debounce from 'lodash/debounce';
import { FaCircleUser } from "react-icons/fa6";
import { useSelector } from 'react-redux';


function Explore() {
    const [explore, setExplore] = useState([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const access = localStorage.getItem('access');
    const [searchQuery, setSearchQuery] = useState('')
    const [users, Setusers] = useState(null)
    const currentUsername = useSelector(state => state.authInfo.username)

    const fetchExplore = async (page) => {
        if (hasMore) {
            try {
                const response = await api.get(`explore/?page=${page}`, {
                    headers: {
                        Authorization: `Bearer ${access}`
                    }
                });
                console.log(response.data.results);
                setExplore(prevExplore => [...prevExplore, ...response.data.results]);
                setHasMore(response.data.next !== null); // Adjust this based on your API response
            } catch (error) {
                console.log(error);
            }
        }
    };

    useEffect(() => {
        fetchExplore(page);
    }, [page]);

    const fetchMoreData = () => {
        setPage(prevPage => prevPage + 1);
    };

    // handling serachQuery using debouncing --
    const handleSearchQuery = useCallback(debounce((query) => {
        setSearchQuery(query);
    }, 300), []);

    // fetching users'for seaaching--
    const fetchUsers = async (search) => {
        try {
            const response = await api.get(`exploreusers/?search=${search}`, {
                headers: {
                    Authorization: `Bearer ${access}`
                }
            })
            console.log(response)
            Setusers(response.data)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        if (searchQuery !== '') {
            fetchUsers(searchQuery)
        } else {
            if (users) {
                Setusers(null)
            }
        }
    },
        [searchQuery])

    return (
        <>
            <Navbar />
            <ToastContainer />
            <CallSocketProvider>
                <IncomingCall />
            </CallSocketProvider>

            <div className='text-white md:ml-[320px] max-w-full flex flex-col relative'>
                <div className='bg-gray-950 h-16 border-b border-gray-700 flex items-center sticky top-0'>
                    <div className='flex items-center gap-2 ml-5 border-b w-fit'>
                        <div><IoIosSearch className='md:size-6 size-5' /></div>
                        <input type="text" placeholder='Search' className='bg-transparent md:w-[300px] md:text-[16px] text-sm w-[200px] pb-1 pt-2 outline-none' onChange={e => handleSearchQuery(e.target.value)} />
                    </div>
                </div>
                {users &&

                    <div className='md:w-[400px] w-[300px] bg-gray-900 fixed ml-1 pb-5 max-h-[500px] top-16 pt-3  rounded-bl-xl rounded-br-xl '>
                        <div className='w-full max-h-[470px] overflow-y-scroll no-scrollbar'>
                            {
                                users.map((user, index) => (
                                    <Link to={currentUsername !== user.username ? `/home/user/profile/${user.id}` : `/home/profile/`}>
                                    <div className='flex gap-x-2 items-center mt-5 ml-10 '>
                                        {user.profile_pic ?
                                            <div>
                                                <img src={user.profile_pic} alt="profile" className='md:size-9 size-8 rounded-full border border-gray-300' />
                                            </div>
                                            :
                                            <div>
                                                <FaCircleUser className='md:size-8 size-8' />
                                            </div>}
                                        <p className='text-md'>{user.username}</p>
                                    </div>
                                    </Link>
                                ))
                            }
                        </div>
                    </div>}
                {/* explore posts */}
                <InfiniteScroll
                    dataLength={explore.length}
                    next={fetchMoreData}
                    hasMore={hasMore}
                    loader={''}
                    endMessage={
                        <div className='w-full flex justify-center h-fit'>
                            <p className='text-xl text-gray-600'>
                                No more data
                            </p>
                        </div>
                    }
                    className='flex flex-wrap w-full h-screen'
                >
                    <div className='col-span-12 grid md:grid-cols-3 grid-cols-2 pt-3 gap-2'>
                        {explore.map((post, index) => (
                            <div key={index} className='col-span-1 flex items-start justify-center'>
                                <Link to={`/home/post/${post.id}`}><img src={post.contend} alt="post" className='w-full h-full object-cover' /></Link>
                            </div>
                        ))}
                    </div>



                </InfiniteScroll>
            </div>
        </>
    );
}

export default Explore;
