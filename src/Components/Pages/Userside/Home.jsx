import { useState, useEffect, useRef, useCallback } from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { AiOutlineArrowRight, AiFillPlusCircle, AiFillHeart, AiFillMessage, AiOutlineClose } from 'react-icons/ai'
import { GiSaveArrow } from "react-icons/gi";
import messi from '../../../media/images/messi.webp'
import MobileTop from './HelperComponents/MobileTop'
import TextToggle from './HelperComponents/TextToggle'
import Commets from './HelperComponents/Commets'
import Navbar from './HelperComponents/Navbar'
import { useDispatch } from 'react-redux'
import { fetchPosts, addLike, removeLike, Toggle_is_following } from '../../../Redux/PostSlice'
import api from '../../../Config'
import PrivetRoute from '../../Wrappers/PrivetRoute';
import { Image, Shimmer } from 'react-shimmer'
import { BsFileImageFill } from "react-icons/bs";
import { ToastContainer, toast } from 'react-toastify';
import { fetchStory } from '../../../Redux/StoriesSlice';
import { FaCircleUser } from "react-icons/fa6";
import UserStoryView from './UserStoryView';
import { IoMdMore } from "react-icons/io";
import { BASE_URL } from '../../../secrets';
import InfiniteScroll from 'react-infinite-scroll-component';
import Loader from './HelperComponents/Loader';
import IncomingCall from './HelperComponents/IncomingCall';
import CallSocketProvider from '../../../Contexts/CallSocketProvider';


function Home() {
  const dispatch = useDispatch()
  const { posts, status, nextPage, hasMore } = useSelector(state => state.posts);
  const storyStatus = useSelector(state => state.stories.status)
  const allStories = useSelector(state => state.stories.stories)
  const error = useSelector((state) => state.posts.error);
  const currentUsername = useSelector(state => state.authInfo.username)
  const userID = useSelector(state => state.authInfo.userID)
  const [viewComment, setViewCommet] = useState({ "index": null, "view": false })
  const [likedPosts, setLikedPosts] = useState([])
  const [userSuggetions, setUserSuggetions] = useState(null)
  const [showAddStory, ToogleShowAddStory] = useState(false)
  let access = localStorage.getItem('access')
  const [addStoryImg, setStoryImg] = useState(null)
  const imgRef = useRef()
  const [viewStory, setViewStory] = useState(null)
  const currentUserStories = allStories.find(story => story.id == userID)
  const [showMore, toggleShowmore] = useState(null)
  const [showReports, toggleShowReports] = useState(null)
  const [report_reason, SetReportOption] = useState('')
  const [reportError, setReportError] = useState('')
  const [reportSucces, setReportSucess] = useState('')

  const closeStory = useCallback(() => {
    setViewStory(null)
  },
    [viewStory])

  console.log(report_reason)
  // adding story--
  const AddStory = async () => {
    if (!addStoryImg) {
      toast.error('Select a image to share !', {
        position: "top-right",
        autoClose: 1000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        style: { backgroundColor: 'red', color: 'black' },
      })
    }
    let data = {
      content: addStoryImg,
      userID: userID
    }
    try {
      const response = await api.post('user/story/', data, {
        headers: {
          Authorization: `Bearer ${access}`,
          "Content-Type": 'multipart/form-data'
        }
      })
      setStoryImg(null)
      dispatch(fetchStory())
      ToogleShowAddStory(false);

    }
    catch (error) {
      console.log(error)
    }
  }
  // adding story closed---

  // fetching suggested users---
  const fetchuserSuggetions = async () => {
    try {
      const response = await api.get('suggested/users/', {
        headers: {
          Authorization: `Bearer ${access}`
        }
      })
      setUserSuggetions(response.data)
    } catch (error) {
      console.log(error)
    }
  }
  // fetching suggested users end here--

  useEffect(() => {
    if (userSuggetions === null) {
      fetchuserSuggetions()
    }
  },
    [userSuggetions])

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
      dispatch(fetchPosts(1))
    }
    if (storyStatus === 'idle') {
      dispatch(fetchStory())
    }

  },
    [dispatch, status, setLikedPosts, storyStatus])

  const fetchMoreData = () => {
    if (hasMore) {
      dispatch(fetchPosts(nextPage));
    }
  };

  // handling-coment-view--
  const handleView = (index) => {
    if (index === viewComment.index) {
      setViewCommet({ "index": null, "view": false })
    }
    else {
      let data = {
        "index": index,
        "view": !viewComment.view
      }
      setViewCommet(data)
    }


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


  const followUser = async (username) => {
    try {
      const response = await api.post(`follow/${username}`, {}, {
        headers: {
          Authorization: `Bearer ${access}`
        }
      });
      dispatch(Toggle_is_following(username))
      let data = userSuggetions.map((user) => {
        if (user.username === username) {
          return { ...user, is_following: response.data.following_Status };
        } else {
          return user;
        }
      });
      console.log(response.data)
      setUserSuggetions(data);
    }
    catch (error) {
      console.log(error)
    }
  }

  const reportPost = async (postID) => {
    if (!report_reason) {
      setReportError('You cannnot report a post without a valid reason !')
      setTimeout(() => {
        setReportError('')
      }, 2000);
      return false
    }
    try {
      let data = {
        "reported_post": postID,
        "report_reason": report_reason
      }
      const response = await api.post('report/post/', data, {
        headers: {
          Authorization: `Bearer ${access}`
        }
      })
      setReportSucess('Reported')
      setTimeout(() => (
        setReportSucess('')
      ), 2000)
      setTimeout(() => (
        toggleShowReports(null)
      ), 1000)
    } catch (error) {
      setReportError('Something went wrong ! Try again later..')
      setTimeout(() => {
        setReportError('')
      }, 2000);
    }
  }

  // Function to check if the current user has viewed all stories of a specific user
  const hasViewedAllStories = (userID) => {
    const currentStories = allStories.find(user => user.id === userID);
    if (!currentStories || !currentStories.stories) return false;
    console.log(currentStories)
    let is_viewed = currentStories.stories.every(story => story.viewed_users.some(user => user.username === currentUsername));
    console.log(`user viwed the ${is_viewed}`)
    return is_viewed
  };

  return (
    <>
      <Navbar />
      <ToastContainer />
      <CallSocketProvider>
        <IncomingCall />
      </CallSocketProvider>

      <div className='text-white md:ml-[320px] max-w-full grid grid-cols-10'>

        <div className='col-span-12 md:col-span-6 border-r border-gray-700  relative'>
          {/* continer to add story-- */}
          <div className={`absolute z-20 w-full h-[400px] bg-[#000300] mt-12 md:mt-0 transition-all ease-in-out delay-70000 shadow-lg shadow-gray-900 ${showAddStory ? 'top-0 scale-100 opacity-100' : 'top-[-420px] scale-0 opacity-0'}`}>
            <ToastContainer />
            <div className='px-3 py-2'>
              <div className='flex justify-between pr-1 items-center'>
                <div className='flex items-center gap-x-2 p-5'>
                  <BsFileImageFill className='text-blue-500 size-9' />
                  <div onClick={() => imgRef.current.click()} className='cursor-pointer'>
                    <span className='text-sm text-gray-400'>Upload Image here</span>
                  </div>
                  <input type="file" hidden ref={imgRef} accept="image/*" onChange={e => setStoryImg(e.target.files[0])} />
                </div>
                <button className='border border-gray-300 h-fit px-4 rounded-md md:text-sm md:py-1 md:px-5 hover:bg-gray-200 hover:text-black' onClick={AddStory}>Post</button>

                <AiOutlineClose className='text-gray-300 cursor-pointer' size={24} onClick={() => ToogleShowAddStory(false)} />
              </div>
            </div>
            <div className='w-full p-6 flex justify-center h-60'>
              {addStoryImg && <img src={URL.createObjectURL(addStoryImg)} className='max-h-full' alt="Story" />}
            </div>
          </div>
          {/* container to add story end -here-- */}


          <MobileTop />
          {/* {
            status === 'loading' && <Loader />
          } */}
          <div>
            {/* story-- */}

            {/* story-view-component-- */}
            {
              viewStory &&
              <UserStoryView userID={viewStory.userID} closeStory={closeStory} />
            }
            {/* story-view-comeponent-end-here-- */}
            <div className='flex border-b border-gray-700 px-2 py-1'>
              {/* current -user -story-- */}
              <div className="flex-shrink-0 py-2 flex-col pl-4">
                {storyStatus === 'success' && currentUserStories.profile_pic ?
                  <img
                    src={BASE_URL + currentUserStories.profile_pic}
                    alt=""
                    className="md:size-20 size-16 rounded-full border-[3px] border-gray-500"
                    onClick={currentUserStories && currentUserStories.stories.length > 0 ? () => setViewStory({ 'userID': currentUserStories.id }) : undefined}
                  />
                  :
                  <FaCircleUser className='md:size-20 size-16 border-[3px] border-gray-400 rounded-full' onClick={currentUserStories && currentUserStories.stories.length > 0 ? () => setViewStory({ 'userID': currentUserStories.id }) : undefined} />
                }
                <p className='text-xs w-fit mx-auto flex items-center gap-x-2'>Your story<AiFillPlusCircle className='md:size-4' onClick={() => ToogleShowAddStory(!showAddStory)} /></p>
              </div>
              {/* current -user-story -end -here- */}


              {/* stories start here-- */}
              {storyStatus === 'success' | storyStatus === 'failed' ?
                <div className="flex w-full overflow-x-scroll no-scrollbar py-2 ">
                  {allStories.map((story, index) => {
                    if (story.id !== userID) {
                      const borderColor = hasViewedAllStories(story.id) ? 'border-gray-500' : 'border-green-500';
                      return (
                        <div key={story.id} className="flex-shrink-0 flex-col ml-7">
                          {story.profile_pic ?
                            <img src={BASE_URL + story.profile_pic} alt="" className={`'md:size-20 size-16 border-[3px]  rounded-full md:size-20 ' ${borderColor}`} onClick={() => setViewStory({ 'userID': story.id })} />
                            : <FaCircleUser className={`'md:size-20 size-16 border-[3px]  rounded-full md:size-20 ' ${borderColor}`} onClick={() => setViewStory({ 'userID': story.id })} />
                          }
                          <p className='text-xs w-fit mx-auto'>{story.username}</p>
                        </div>
                      )
                    }

                  })}
                </div>
                :
                <div className="flex w-full overflow-x-scroll no-scrollbar py-2 ">
                  {Array(12).fill().map((_, index) => (
                    <div key={index} className="flex-shrink-0 flex-col ml-7">

                      <div className='md:size-20 size-16 bg-gray-700 rounded-full'></div>
                      <p className='h-3 mt-1 rounded-xl w-16 mx-auto bg-gray-700'></p>
                    </div>
                  ))}
                </div>
              }

            </div>
            {/* story-end-- */}
            {/* feed-selection-- */}
            <div className='grid grid-cols-2'>
              <div className='col-span-1 h-8 text-center bg-gray-900'>All</div>
              <div className='col-span-1 h-8 text-center'>Following</div>
            </div>
            {/* feed-selectionend-here--- */}


            {/* feed-start-here--- */}
            {status === 'success' ? (

              <InfiniteScroll
                dataLength={posts.length}
                next={fetchMoreData}
                hasMore={hasMore}
                loader={<Loader />}
                endMessage={<div className='w-full text-xl text-gray-500 text-center'>No more Posts</div>}
              >
                {
                  posts.map((post, index) => {
                    return (
                      <div className='px-2 pt-3' key={index}>

                        {/* post-start-here-- */}

                        <div className='mt-4 relative' key={index}>
                          {/* post-header-- */}
                          <div className='flex justify-between px-3 items-center'>
                            {/* postuserprofile_pic and usernme-- */}
                            <div className='flex gap-x-1 items-center w-fit'>
                              {post.userID.profile_pic ?
                                <img src={post.userID.profile_pic} alt="user" className='size-8 rounded-full border-[1px] border-gray-400' />
                                :
                                <FaCircleUser className='md:size-9 size-7' />
                              }

                              <Link to={currentUsername !== post.userID.username ? `/home/user/profile/${post.userID.id}` : `/home/profile/`}>
                                <p className='md:text-sm text-xs font-normal'>{post.userID.username}</p>
                              </Link>

                            </div>
                            {/* postuser profile pic and username end-- */}

                            {/* post head right side-- */}
                            <div className='flex gap-x-2 relative px-'>
                              {post.is_following === false && <button className='text-[11px] px-5 h-fit py-[2px] rounded-md border border-gray-400' onClick={() => followUser(post.userID.username)}>Follow</button>}
                              <div><IoMdMore className='size-5 cursor-pointer' onClick={() => {
                                if (showReports) {
                                  toggleShowReports(null)
                                }
                                if (showMore) {
                                  if (showMore.postID !== post.id) {
                                    toggleShowmore({ postID: post.id })
                                  } else {
                                    toggleShowmore(null)
                                  }
                                } else {
                                  toggleShowmore({ postID: post.id })
                                }


                              }} /></div>

                              <div className={`' bg-gray-900  transition-all ease-in-out delay-100
                           absolute select-none right-5 px-3 py-2 md:py-3 md:px-5 rounded-tl-md rounded-bl-md rounded-br-md'
                          ${showMore && showMore.postID === post.id ? 'scale-100' : 'scale-0'}`}>
                                <p className='text-red-600 cursor-pointer text-xs md:text-sm' onClick={() => {
                                  if (showReports) {
                                    toggleShowReports(null)
                                  } else {
                                    toggleShowReports({ postID: post.id })
                                  }
                                }}
                                >Report</p>


                              </div>

                              <div className={`'absolute absolute transition-all delay-100 ease-in-out  bg-gray-900 right-5 md:top-14 top-10
                           px-2 md:px-4 py-3 rounded-tl-md rounded-bl-md rounded-br-md w-fit'
                          ${showReports && showReports.postID === post.id ? 'scale-100' : 'scale-0'}`}>

                                <div className='flex px-2 gap-x-2 items-center'>
                                  <label className='flex items-center gap-x-2'>
                                    <input onChange={(e) => SetReportOption(e.target.value)} type='radio' name='post-report' value="it's a spam" className='w-2.5 h-2.5 md:w-3 md:h-3' />
                                    <p className='whitespace-nowrap font-thin md:text-sm text-xs'>It's a spam</p>
                                  </label>
                                </div>
                                <div className='flex gap-x-2 items-center mt-2 px-2'>
                                  <label className='flex items-center gap-x-2'>
                                    <input onChange={(e) => SetReportOption(e.target.value)} type='radio' name='post-report' value='Hate of speech or symboles' className='w-2.5 h-2.5 md:w-3 md:h-3' />
                                    <p className='whitespace-nowrap font-thin text-xs md:text-sm'>Hate of speech or symboles</p>
                                  </label>
                                </div>
                                <div className='flex gap-x-2 items-center mt-2 px-2'>
                                  <label className='flex items-center gap-x-2'>
                                    <input onChange={(e) => SetReportOption(e.target.value)} type='radio' name='post-report' value='false information' className='w-2.5 h-2.5 md:w-3 md:h-3' />
                                    <p className='whitespace-nowrap font-thin md:text-sm text-xs'>False Information</p>
                                  </label>
                                </div>
                                <div className='flex gap-x-2 items-center mt-2 px-2'>
                                  <label className='flex items-center gap-x-2'>
                                    <input onChange={(e) => SetReportOption(e.target.value)} type='radio' name='post-report' value='Nudity or Sexual activity' className='w-2.5 h-2.5 md:w-3 md:h-3' />
                                    <p className='whitespace-nowrap font-thin md:text-sm text-xs'>Nudity or sexual activity</p>
                                  </label>
                                </div>
                                <div className='flex gap-x-2 items-center mt-2 px-2'>
                                  <label className='flex items-center gap-x-2'>
                                    <input onChange={(e) => SetReportOption(e.target.value)} type='radio' name='post-report' value='Drugs' className='w-2.5 h-2.5 md:w-3 md:h-3' />
                                    <p className='whitespace-nowrap font-thin md:text-sm text-xs'>Drugs</p>
                                  </label>
                                </div>

                                <div className='flex flex-col items-center'>
                                  {!reportSucces && <button className='bg-red-600 text-sm px-3 py-1 mt-3 rounded-md' onClick={() => reportPost(post.id)}>Report</button>}
                                  {reportError && <p className='text-red-600 text-xs text-center'>{reportError}</p>}
                                  <p className={`' text-black px-4 py-1 mt-2 rounded-sm text-xs text-center transition-all delay-100 ease-in-out'
                                ${reportSucces ? 'scale-x-100  bg-green-600' : 'scale-x-0'}`}>{reportSucces}</p>
                                </div>
                              </div>

                            </div>
                            {/* post head right side end here-------- */}

                          </div>
                          {/* post-header-end-here--- */}

                          {/* post-conted-start-here-- */}
                          <Link to={`/home/post/${post.id}`}>
                            <div className='px-4 py-3 flex justify-center select-none'>
                              <Image src={post.contend} className='border border-gray-400 mx-auto select-none'
                                fallback={<Shimmer width={660} height={300} />}
                              />
                            </div>
                          </Link>
                          {/* post-cotent-end-here--- */}
                          {/* post bottom-- */}
                          <div className='flex justify-between px-4'>
                            <div className='flex gap-x-2'>
                              <AiFillHeart onClick={() => handlelike(post.id)} className='cursor-pointer md:size-6 size-4' style={{ color: likedPosts.includes(post.id) ? 'red' : 'white' }} />
                              <AiFillMessage onClick={() => handleView(index)} className='cursor-pointer md:size-6 size-4' />
                            </div>
                            <GiSaveArrow />
                          </div>

                          <p className='md:text-xs text-[11px] px-3 text-gray-400'>
                            {post.likes_count} Likes
                          </p>

                          <TextToggle
                            text={post.caption} />
                          <p className='md:text-xs text-[11px] mx-3 text-gray-500 cursor-pointer select-none' onClick={() => handleView(index)}>{post.comment_count > 0 ? `View ${post.comment_count} Comments` : 'No Comments'}</p>
                          {/* comments--- */}
                          {index === viewComment.index &&
                            <div className={`${viewComment.index === index ? 'max-h-[160px]' : 'h-[0px]'} 'mb-0'`}>
                              <PrivetRoute>
                                <Commets view={viewComment.view} postID={post.id} />
                              </PrivetRoute>
                            </div>

                          }
                          {/* commens-end-here-- */}

                          {/* post-bottom-end-here-- */}
                        </div>
                        {/* post-end-here-- */}

                      </div>
                    )
                  })

                }

              </InfiniteScroll>
            ) :

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
          {/* <div className='w-fit mx-auto h-fit sticky top-5 flex items-center'>
            <input type="text" placeholder='Search' className='bg-gray-900 md:px-3 pl-2 pr-7 py-1 md:py-3 rounded-3xl  m-auto max-w-[340px]' />
            <AiOutlineSearch className='absolute right-2 size-4 md:size-6' />
          </div> */}

          <div className='border border-gray-700 sticky top-[70px] md:top-[100px] py-2 md:py-4 px-1 md:px-2 mx-auto max-w-[280px] rounded-md'>
            <h1 className='text-xs md:text-xl font-semibold text-center border-b border-gray-700'>WHO TO FOLLOW</h1>

            <div className='max-w-[250px] mx-auto px-2 py-3'>
              {
                userSuggetions ?
                  userSuggetions.map((user, index) => (

                    <div className='flex items-center justify-between mb-3 select-none' key={user.id}>
                      <Link to={`/home/user/profile/${user.id}`}><div className='flex items-center gap-x-2'>
                        {user.profile_pic ?
                          <img src={user.profile_pic} alt="" className='size-8 rounded-full border-gray-500 border-[1px]' />
                          :
                          <FaCircleUser className='size-8 rounded-full' />
                        }
                        <h3 className='font-sans text-[13px]'>{user.username}</h3>
                      </div>
                      </Link>
                      {user.is_following ?
                        <p className='text-xs' onClick={() => followUser(user.username)}>Following</p>
                        :
                        <button className='border border-gray-500 text-xs px-3 py-1 rounded-md' onClick={() => followUser(user.username)}>Follow</button>}
                    </div>
                  ))
                  :


                  Array(5).fill().map((_, index) => (
                    <div className='flex items-center justify-between mb-3' key={index}>
                      <div className='flex items-center gap-x-2' >
                        <div className='size-9 bg-gray-700 rounded-full'></div>
                        <div className='bg-gray-700 w-24 h-5 rounded-full'></div>
                      </div>
                      <div className='w-14 h-6 rounded-md bg-gray-700'></div>
                    </div>
                  ))
              }

            </div>
            <Link >
              <div className='text-[13px] ml-5 flex items-end gap-x-1'>
                more<AiOutlineArrowRight size={12} />
              </div>
            </Link>
          </div>
        </div>
      </div >
    </>
  )
}

export default Home