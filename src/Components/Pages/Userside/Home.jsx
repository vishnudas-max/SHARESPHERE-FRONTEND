import React, { useState, useEffect, CSSProperties } from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { AiOutlineSearch, AiOutlineArrowRight, AiFillPlusCircle, AiFillHeart, AiFillMessage } from 'react-icons/ai'
import { GiSaveArrow } from "react-icons/gi";
import messi from '../../../media/images/messi.webp'
import MobileTop from './HelperComponents/MobileTop'
import TextToggle from './HelperComponents/TextToggle'
import Commets from './HelperComponents/Commets'
import Navbar from './HelperComponents/Navbar'
import { useDispatch } from 'react-redux'
import { fetchPosts, addLike, removeLike } from '../../../Redux/PostSlice'
import api from '../../../Config'
import PrivetRoute from '../../Wrappers/PrivetRoute';


function Home() {
  const dispatch = useDispatch()
  const posts = useSelector((state) => state.posts.posts);
  const status = useSelector((state) => state.posts.status);
  const error = useSelector((state) => state.posts.error);
  const username = useSelector(state => state.authInfo.username)
  const [viewComment, setViewCommet] = useState({ "index": null, "view": false })
  const [likedPosts, setLikedPosts] = useState([])
  let access = localStorage.getItem('access')

  useEffect(() => {
    api.get('get/user/liked/posts/', {
      headers: {
        Authorization: `Bearer ${access}`
      }
    }).then(res => {
      let likedposts = res.data.flat(Infinity)
      setLikedPosts(likedposts)
    }).catch(err => {
      console.log(err)
    })

    if (status === 'idle') {
      dispatch(fetchPosts())
    }
  },
    [dispatch, status, setLikedPosts])




  // handling-coment-view--
  const handleView = (index) => {
    let data = {
      "index": index,
      "view": !viewComment.view
    }
    setViewCommet(data)
  }
  // handling-comment-view-end-here---

  // postlike-code--
  const handlelike = async (postid) => {
    try {
      const access = localStorage.getItem('access')
      const res = await api.post(`postlike/${postid}/toggle-like/`, {}, {
        headers: {
          Authorization: `Bearer ${access}`
        }
      })
      if (res.status === 204) {
        dispatch(removeLike(postid))
        setLikedPosts(likedPosts.filter(id => id !== postid));


      } else {
        dispatch(addLike(postid))
        setLikedPosts([...likedPosts, postid]);
      }
    }
    catch (error) {
      console.log(error)
    }
  }
  // post-like-code-end---

  return (
    <>
      <Navbar />

      <div className='text-white md:ml-[320px] max-w-full grid grid-cols-10'>
        <div className='col-span-12 md:col-span-6 border-r border-gray-700  '>
          <MobileTop />
          {
            status === 'loading' && <h1 className='text-[30px]'>Loading......</h1>
          }
          <div>
            {/* story-- */}
            <div className='flex border-b border-gray-700 px-2 py-1'>
              <div className="flex-shrink-0 py-2 flex-col pl-4">
                <img src={messi} alt="" className="md:size-20 size-16 rounded-full border-[3px] border-gray-200 mx-auto add-plus" />
                <p className='text-xs w-fit mx-auto flex items-center gap-x-2'>Your story<AiFillPlusCircle className='md:size-4' /></p>
              </div>

              <div className="flex w-full overflow-x-scroll no-scrollbar py-2 ">
                {Array(12).fill().map((_, index) => (
                  <div key={index} className="flex-shrink-0 flex-col ml-7">
                    <img src={messi} alt="" className="md:size-20 size-16 rounded-full border-[3px]  border-green-500" />
                    <p className='text-xs w-fit mx-auto'>_John_</p>
                  </div>
                ))}
              </div>

            </div>
            {/* story-end-- */}


            {/* feed-selection-- */}
            <div className='grid grid-cols-2'>
              <div className='col-span-1 h-8 text-center bg-gray-900'>All</div>
              <div className='col-span-1 h-8 text-center'>Following</div>
            </div>
            {/* feed-selectionend-here--- */}


            {/* feed-start-here--- */}
            {status === 'success' &&

              posts.map((post, index) => {
                return (
                  <div className='px-2 pt-3' key={index}>

                    {/* post-start-here-- */}

                    <div className='mt-4 relative' key={index}>
                      {/* post-header-- */}
                      <div className='flex justify-between px-3 items-center'>
                        <div className='flex gap-x-1 items-center'>
                          <img src={messi} alt="" className='size-8 rounded-full' />
                          <p className='font-thin text-[13px]'>_John</p>
                        </div>
                        <button className='text-[11px] px-5 h-fit py-[2px] rounded-md border border-gray-400'>Follow</button>
                      </div>
                      {/* post-header-end-here--- */}

                      {/* post-conted-start-here-- */}
                      <Link to={`/home/post/${post.id}`}>
                        <div className='px-4 py-3'>
                          { post.contend ?
                            <img src={post.contend} alt="post" className='border border-gray-400 mx-auto' />
                            :
                            <div className='w-full h-[300px] bg-gray-700'></div>
                          }
                        </div>
                      </Link>
                      {/* post-cotent-end-here--- */}
                      {/* post bottom-- */}
                      <div className='flex justify-between px-4'>
                        <div className='flex gap-x-2'>
                          <AiFillHeart onClick={() => handlelike(post.id)} style={{ color: likedPosts.includes(post.id) ? 'red' : 'white' }} />
                          <AiFillMessage />
                        </div>
                        <GiSaveArrow />
                      </div>
                      {/* {post.likes_count > 2 ? (
                        <p className='md:text-xs text-[11px] px-3 text-gray-400'>
                          {post.liked_users[0].userID.username} and {post.likes_count - 1} Others liked this post
                        </p>
                      ) : post.likes_count > 1 ? (
                        <p className='md:text-xs text-[11px] px-3 text-gray-400'>
                          {post.liked_users[0].userID.username} and {post.liked_users[1].userID.username} Liked this post
                        </p>
                      ) : post.likes_count === 1 ? (
                        <p className='md:text-xs text-[11px] px-3 text-gray-400'>
                          {post.liked_users[0].userID.username} Liked this post
                        </p>
                      ) :
                        <p className='md:text-xs text-[11px] px-3 text-gray-400'>
                          {post.likes_count} Likes
                        </p>
                      } */}
                      <p className='md:text-xs text-[11px] px-3 text-gray-400'>
                        {post.likes_count} Likes
                      </p>

                      <TextToggle
                        text={post.caption} />
                      <p className='md:text-xs text-[11px] mx-3 text-gray-500 cursor-pointer' onClick={() => handleView(index)}>View all 10 comments</p>

                      {/* comments--- */}
                      {index === viewComment.index &&
                        <PrivetRoute>
                          <Commets view={viewComment.view} postID={post.id} />
                        </PrivetRoute>
                      }
                      {/* commens-end-here-- */}

                      {/* post-bottom-end-here-- */}
                    </div>
                    {/* post-end-here-- */}

                  </div>
                )
              })
            }
            {status === 'laoding' | status === 'failed' &&
              Array(3).fill().map((_, index) => (
                <div className='grid grid-cols-10 z-50 px-2 py-0 mt-2' key={index}>
                  <div className='col-span-10  rounded-sm h-fit grid grid-cols-2 p-3 gap-3'>
                    <div className='col-span-1 h-[50px] rounded-md animate-pulse px-2 py-1 flex items-center gap-x-2'>
                      <div className='size-12 bg-gray-700 rounded-full'></div>
                      <div className='w-28 h-5 bg-gray-700 rounded-xl'></div>
                    </div>
                    <div className='col-span-1 h-[50px] rounded-md animate-pulse flex justify-end items-center'>
                      <button className='h-8 rounded-md w-20 bg-gray-700 mr-3'></button>
                    </div>
                    <div className='col-span-2 bg-gray-700 h-[350px] animate-pulse rounded-md'></div>
                    <div className='col-span-1 h-[80px] rounded-md animate-pulse'>
                      <div className='w-48 h-4 bg-gray-700 rounded-md '></div>
                      <div className='w-56 h-4 bg-gray-700 rounded-md mt-2'></div>
                      <div className='w-40 h-4 bg-gray-700 rounded-md mt-2'></div>
                    </div>
                    <div className='col-span-1 h-[80px] rounded-md animate-pulse flex justify-end'>
                      <button className='h-4 rounded-md w-6 bg-gray-700 mr-3'></button>
                    </div>
                  </div>
                </div>
              ))
            }


          </div>
        </div>


        {/* right side-- */}
        <div className='col-span-4  py-5 hidden md:block'>
          <div className='w-fit mx-auto h-fit sticky top-5 flex items-center'>
            <input type="text" placeholder='Search' className='bg-gray-900 md:px-3 pl-2 pr-7 py-1 md:py-3 rounded-3xl  m-auto max-w-[340px]' />
            <AiOutlineSearch className='absolute right-2 size-4 md:size-6' />
          </div>

          <div className='border border-gray-700 sticky top-[70px] md:top-[100px] py-2 md:py-4 px-1 md:px-2 mx-auto max-w-[280px] rounded-md'>
            <h1 className='text-xs md:text-xl font-semibold text-center border-b border-gray-700'>WHO TO FOLLOW</h1>

            <div className='max-w-[250px] mx-auto px-2 py-3'>

              <div className='flex items-center justify-between mb-3'>
                <div className='flex items-center gap-x-2'>
                  <img src={messi} alt="" className='size-8 rounded-full' />
                  <h3 className='font-sans text-[13px]'>@John_02</h3>
                </div>
                <button className='border border-gray-500 text-xs px-3 py-1 rounded-md'>Follow</button>
              </div>

              <div className='flex items-center justify-between mb-3'>
                <div className='flex items-center gap-x-2'>
                  <img src={messi} alt="" className='size-8 rounded-full' />
                  <h3 className='font-sans text-[13px]'>@John_02</h3>
                </div>
                <button className='border border-gray-500 text-xs px-3 py-1 rounded-md'>Follow</button>
              </div>

              <div className='flex items-center justify-between mb-3'>
                <div className='flex items-center gap-x-2'>
                  <img src={messi} alt="" className='size-8 rounded-full' />
                  <h3 className='font-sans text-[13px]'>@John_02</h3>
                </div>
                <button className='border border-gray-500 text-xs px-3 py-1 rounded-md'>Follow</button>
              </div>
              <div className='flex items-center justify-between mb-3'>
                <div className='flex items-center gap-x-2'>
                  <img src={messi} alt="" className='size-8 rounded-full' />
                  <h3 className='font-sans text-[13px]'>@John_02</h3>
                </div>
                <button className='border border-gray-500 text-xs px-3 py-1 rounded-md'>Follow</button>
              </div>
              <div className='flex items-center justify-between mb-3'>
                <div className='flex items-center gap-x-2'>
                  <img src={messi} alt="" className='size-8 rounded-full' />
                  <h3 className='font-sans text-[13px]'>@John_02</h3>
                </div>
                <button className='border border-gray-500 text-xs px-3 py-1 rounded-md'>Follow</button>
              </div>

            </div>
            <Link >
              <div className='text-[13px] ml-5 flex items-end gap-x-1'>
                more<AiOutlineArrowRight size={12} />
              </div>
            </Link>

          </div>
        </div>
      </div>
    </>
  )
}

export default Home