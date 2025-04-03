import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { AiOutlineMore, } from 'react-icons/ai'
import PostOptions from './HelperComponents/PostOptions'
import api from '../../../Config'
import Loader from '../Userside/HelperComponents/Loader'
import { FaCircleUser } from "react-icons/fa6";
import { IoSend } from "react-icons/io5";
import { useDispatch } from 'react-redux'
import { addComment_count } from '../../../Redux/PostSlice'
import { MdReport, MdMoreVert } from "react-icons/md";
import Navbar from './HelperComponents/Navbar'
import { IoClose } from "react-icons/io5";
import IncomingCall from './HelperComponents/IncomingCall'
import CallSocketProvider from '../../../Contexts/CallSocketProvider'
import { MdVerified } from "react-icons/md";

const BASE_URL = process.env.REACT_APP_BASE_URL


function ViewPost() {
  const { id } = useParams()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const posts = useSelector(state => state.posts.posts)
  const userID = useSelector(state => state.authInfo.userID)
  const [optionson, setOptions] = useState(false)
  const [comments, setComments] = useState(null)
  let access = localStorage.getItem('access')
  const [showReply, setShowReply] = useState({})
  const [comment, AddComment] = useState('')
  const [replycomment, setreplycomment] = useState('')
  const [currentpost, setPost] = useState(null)
  const [report_option, SetReportOption] = useState('')
  const [showreport, toggleshowreport] = useState(false)
  const [reportError, setReportError] = useState('')
  const [reportSucces, setReportSucess] = useState('')
  const [commentOptionIsOpen, toogleCommentoption] = useState(null)
  const [editcomment, setEditcomment] = useState(null)
  const [editreply, seteditReply] = useState(null)

  console.log(comments)
  const fetchComment = async () => {
    try {
      const response = await api.get(`post/comment/${id}/`, {
        headers: {
          Authorization: `Bearer ${access}`
        }
      })
      setComments(response.data)
    }
    catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await api.get(`posts/${id}/`, {
          headers: {
            Authorization: `Bearer ${access}`
          }
        })
        setPost(response.data)
        console.log(response.data)
      }
      catch (error) {
        console.log(error)
      }
    }
    if (currentpost === null) {
      fetchPost()
    }

  },
    [])


  useEffect(() => {
    fetchComment()

  }, [])



  const postComment = async e => {
    e.preventDefault()
    if (!userID) {
      alert(userID)
    }
    let data = {
      "userID": userID,
      "postID": id,
      "comment": comment
    }
    try {
      const response = await api.post(`post/comment/${id}/`, data, {
        headers: {
          Authorization: `Bearer ${access}`
        }
      })
      dispatch(addComment_count(id))
      AddComment('')
      fetchComment()
    }
    catch (error) {
      console.log(error)
    }
  }

  const edituserComment = async e => {
    e.preventDefault()
    let data = {
      "comment": editcomment.comment
    }
    try {
      const response = await api.patch(`post/comment/${editcomment.id}/`, data, {
        headers: {
          Authorization: `Bearer ${access}`
        }
      })
      // dispatch(addComment_count(id))
      setEditcomment(null)
      fetchComment()
    }
    catch (error) {
      console.log(error)
    }
  }
  const editCommentReply = async e => {
    e.preventDefault()
    let data = {
      "comment": editreply.comment
    }
    try {
      const response = await api.patch(`post/comment/${editreply.id}/`, data, {
        headers: {
          Authorization: `Bearer ${access}`
        }
      })
      // dispatch(addComment_count(id))
      seteditReply(null)
      fetchComment()
    }
    catch (error) {
      console.log(error)
    }
  }

  const postCommentReply = async () => {
    // Ensure replycomment is a string


    let data = {
      "userID": userID, // Ensure userID is a valid string or number
      "postID": id, // Ensure id is a valid string or number
      "comment": replycomment,
      "parent_comment": showReply.id // Ensure commentID is a valid string or number
    };

    try {
      const response = await api.post(`post/comment/${id}/`, data, {
        headers: {
          Authorization: `Bearer ${access}` // Ensure access is a valid string
        }
      });
      fetchComment();
      setreplycomment('')
      dispatch(addComment_count(id))
    } catch (error) {
      console.error(error);
    }
  };



  const handleRepliesView = (id, username) => {
    console.log(id, username)
    if (showReply.id) {
      setShowReply({})
    } else {
      setShowReply({ 'id': id, 'username': username })
    }
  }


  const deletecomment = async (id) => {
    let access = localStorage.getItem('access')
    try {
      const response = await api.delete(`post/comment/${id}/`, {
        headers: {
          Authorization: `Bearer ${access}`
        }
      })
      if (response.status === 204) {
        let data = comments.filter(comment => {
          // Check if the comment is not the one being deleted
          if (comment.id !== id) {
            // If the comment has replies, filter out the deleted reply
            if (comment.replies) {
              comment.replies = comment.replies.filter(reply => reply.id !== id);
            }
            return true; // Keep the comment
          } else {

            return false; // Remove the comment
          }
        });
        setComments(data);
        console.log('Comment deleted');
      }
    }
    catch (error) {
      console.log(error)
    }
  }

  const reportpost = async () => {
    if (!report_option) {
      setReportError('You cannot report post without a valid reason!')
      setTimeout(() => {
        setReportError('')
      }, 2000);
      return false
    }
    try {
      let data = {
        report_reason: report_option,
        reported_post: id
      }
      const reponse = await api.post('report/post/', data, {
        headers: {
          Authorization: `Bearer ${access}`
        }
      })
      setReportSucess('Reported')
      setTimeout(() => (
        setReportSucess('')
      ), 2000)
      setTimeout(() => (
        toggleshowreport(null)
      ), 1000)

    } catch (error) {
      if (error.response.data.detail) {
        setReportError(error.response.data.detail)
        setTimeout(() => {
          setReportError('')
        }, 2000);
      } else {
        setReportError('something wenet wrong ! try again later')
        setTimeout(() => {
          setReportError('')
        }, 2000);
      }
    }
  }

  const handleEditcomment = e => {
    let data = { ...editcomment, comment: e.target.value }
    setEditcomment(data)
  }
  const handleEditReply = e => {
    let data = { ...editreply, comment: e.target.value }
    seteditReply(data)
  }

  return (
    <>
      <CallSocketProvider>
        <IncomingCall />
      </CallSocketProvider>
      <div className='select-none'>
        <IoClose className='absolute text-white right-4 top-3 size-6' onClick={() => navigate(-1)} />
        {currentpost &&
          <div className="grid grid-cols-3 gap-1 h-screen">
            <div className='block md:hidden'>
              <Navbar />
            </div>
            <div className="col-span-3 md:col-span-2 md:max-w-[800px] max-w-full md:h-[screen] mx-auto my-auto px-5 ">
              <img src={currentpost.contend} alt="Post" className='md:max-w-[500px] max-w-full max-h-[700px]' />
            </div>

            <div className='col-span-3 md:col-span-1 bg-zinc-900 px-2 pt-3 text-white flex-col h-screen sticky top-14  overflow-hidden '>

              <div className='border-b border-gray-400 md:py-4 py-2'>
                <div className='w-full flex justify-between'>
                  <div className='flex gap-x-2 items-center'>
                    {currentpost.userID.profile_pic ?
                      <div className='shrink-0'>
                        <img src={currentpost.userID.profile_pic} alt="profilepic" className='rounded-full border-[1px] border-gray-400 size-12' />
                      </div>
                      :
                      <FaCircleUser className='md:size-14 size-10 ' />
                    }
                    <div className='flex gap-1 items-center'>
                      <h1 className='font-semibold text-xl'>{currentpost.userID.username}</h1>
                      {currentpost.userID.is_verified &&
                        <div ><MdVerified className='md:size-6 text-blue-600' /></div>}
                    </div>
                  </div>
                  {userID === currentpost.userID.id &&
                    <AiOutlineMore color='white' className='size-8 cursor-pointer' onClick={() => setOptions(o => !o)} />

                  }
                  {
                    optionson &&
                    <PostOptions animate={true} id={currentpost.id} />
                  }


                </div>


                <div className='mt-3'>
                  <p className='md:text-[15px] text-[13px] text-gray-200'>{currentpost.caption}</p>
                  <div className='flex justify-between pr-6 items-baseline'>
                    <p className='md:text-[15px] text-[13px] text-gray-400 font-semibold mt-3'>{currentpost.formatted_uploadDate}</p>
                    {currentpost.userID.id !== userID &&
                      <MdReport className='size-6 text-red-600' onClick={() => toggleshowreport(prev => !prev)} />}
                  </div>
                </div>
              </div>

              {/* report container--- */}
              <div className={`'bg-gray-900 bg-gray-900 w-full mx-auto  px-5 py-2 transition-all ease-in-out delay-100'${showreport ? 'scale-y-100 block' : ' scale-y-0 absolute'}`}>
                <h1 className='text-center  text-xl'>Report</h1>
                <div className='w-full h-[.2px] mt-2 mb-2 bg-white'></div>
                <div className='flex px-2 gap-x-2 items-center'>
                  <label className='flex items-center gap-x-2'>
                    <input onChange={(e) => SetReportOption(e.target.value)} type='radio' name='post-report' value="it's a spam" className='w-2.5 h-2.5 md:w-3 md:h-3' />
                    <p className='whitespace-nowrap font-thin text-md'>It's a spam</p>
                  </label>
                </div>
                <div className='flex gap-x-2 items-center mt-2 px-2'>
                  <label className='flex items-center gap-x-2'>
                    <input onChange={(e) => SetReportOption(e.target.value)} type='radio' name='post-report' value='Hate of speech or symboles' className='w-2.5 h-2.5 md:w-3 md:h-3' />
                    <p className='whitespace-nowrap font-thin text-md'>Hate of speech or symboles</p>
                  </label>
                </div>
                <div className='flex gap-x-2 items-center mt-2 px-2'>
                  <label className='flex items-center gap-x-2'>
                    <input onChange={(e) => SetReportOption(e.target.value)} type='radio' name='post-report' value='false information' className='w-2.5 h-2.5 md:w-3 md:h-3' />
                    <p className='whitespace-nowrap font-thin text-md'>False Information</p>
                  </label>
                </div>
                <div className='flex gap-x-2 items-center mt-2 px-2'>
                  <label className='flex items-center gap-x-2'>
                    <input onChange={(e) => SetReportOption(e.target.value)} type='radio' name='post-report' value='Nudity or Sexual activity' className='w-2.5 h-2.5 md:w-3 md:h-3' />
                    <p className='whitespace-nowrap font-thin text-md'>Nudity or sexual activity</p>
                  </label>
                </div>
                <div className='flex gap-x-2 items-center mt-2 px-2'>
                  <label className='flex items-center gap-x-2'>
                    <input onChange={(e) => SetReportOption(e.target.value)} type='radio' name='post-report' value='Drugs' className='w-2.5 h-2.5 md:w-3 md:h-3' />
                    <p className='whitespace-nowrap font-thin text-md'>Drugs</p>
                  </label>
                </div>
                <div className='flex flex-col items-center mt-3'>
                  {!reportSucces && <button className='bg-red-700 px-4 py-1 rounded-md flex gap-x-1 items-center' onClick={reportpost}><MdReport className='size-5' />Report</button>}
                  {reportError && <p className='text-red-600 text-xs text-center'>{reportError}</p>}
                  <p className={`' text-black px-4 py-1 mt-2 rounded-sm text-xs text-center transition-all delay-100 ease-in-out'
                                ${reportSucces ? 'scale-x-100  bg-green-600' : 'scale-x-0'}`}>{reportSucces}</p>

                </div>

              </div>


              {/* reprot container end here---- */}
              {editcomment === null ?
                // add comment--
                <div className='mt-3 grid grid-cols-5 py-3 border-b border-gray-400'>
                  <div className='col-span-3 py-3 flex items-center'>
                    <input type="text" placeholder='Add comment..' className='px-1 text-[14px] bg-transparent outline-none border-b border-gray-600' value={comment} onChange={e => AddComment(e.target.value)} />
                  </div>
                  <button onClick={postComment} className='cursor-pointer px-3 h-fit py-1 rounded-md ml-5 bg-blue-600 text-black' >Post</button>
                  <div>
                  </div>
                </div>
                :
                //  editcomment--
                <div className='mt-3 grid grid-cols-5 py-3 border-b border-gray-400'>
                  <div className='col-span-3 py-3 flex items-center'>
                    <input type="text" placeholder='Add comment..' className='px-1 text-[14px] bg-transparent outline-none border-b border-gray-600' value={editcomment.comment} onChange={e => handleEditcomment(e)} />
                  </div>
                  <div>
                    <div className='flex gap-x-2 items-center'>
                      <button onClick={edituserComment} className='cursor-pointer px-3 h-fit py-1 rounded-md ml-5 bg-blue-600 text-black'>Edit </button>
                      <IoClose className='size-8 cursor-pointer' onClick={() => setEditcomment(null)} />
                    </div>
                  </div>

                  <div>
                  </div>
                </div>
              }

              {/* conmments-- */}
              <div className='h-full'>
                <div className='flex-col overflow-y-scroll no-scrollbar h-[450px]'>
                  {comments ? (
                    comments.map((comment, index) => (
                      <div className='mt-3 p-2 relative' key={index}>

                        <div className='flex justify-between'>
                          <div className='flex gap-y-2 items-center '>
                            {comment.userID.profile_pic ? (
                              <div className='shrink-0'>
                                <img src={comment.userID.profile_pic} alt="" className='border-[1px] border-gray-400 size-10 rounded-full' />
                              </div>
                            ) : (
                              <FaCircleUser className='md:size-10 size-7' />
                            )}
                            <div className='flex-col justify-between'>
                              <div className='flex  gap-x-2 items-center'>
                                <p className='font-semibold text-gray-300 text-[14px] ml-2'>{comment.userID.username}</p>
                                <p className='text-xs text-gray-400'>{comment.time_ago}</p>

                              </div>
                              <p className='ml-2 font-thin md:text-[14px] text-[13px] cursor-pointer' onClick={() => handleRepliesView(comment.id, comment.userID.username)}>{comment.comment}</p>

                            </div>

                          </div>
                          {
                            comment.userID.id === userID && <div className='relative cursor-pointer'>
                              <MdMoreVert onClick={() => {
                                if (commentOptionIsOpen) {
                                  if (commentOptionIsOpen.id !== comment.id) {
                                    toogleCommentoption({ id: comment.id })
                                  } else {
                                    toogleCommentoption(null)
                                  }
                                } else {
                                  toogleCommentoption({ id: comment.id })
                                }
                              }} />

                              {commentOptionIsOpen && commentOptionIsOpen.id === comment.id && <div className='absolute right-4 bg-gray-700 rounded-sm px-3 py-[1px]'>
                                <p className='text-xs font-thin text-gray-200 cursor-pointer' onClick={() => setEditcomment({ id: comment.id, comment: comment.comment })} >edit</p>
                                <p className='text-xs font-thin text-gray-200 cursor-pointer' onClick={() => deletecomment(comment.id)} >delete</p>
                              </div>}
                            </div>}

                        </div>

                        {/* input field for adding reply-- */}
                        {showReply['id'] === comment.id &&

                          (editreply ?
                            <div className='flex gap-x-3 mt-2'>
                              <div className='flex border-b border-gray-600 gap-x-1'>
                                <span className='whitespace-nowrap'>@{showReply['username']}</span>
                                <input type="text" placeholder='Edit reply....' className='w-full h-fit bg-transparent outline-none ' value={editreply.comment}
                                  onChange={e => handleEditReply(e)} />
                                <div className='flex gap-x-1'>
                                  <button onClick={editCommentReply} className='cursor-pointer h-fit px-3  text-black bg-blue-700 rounded-md' >Edit</button>
                                  <div>
                                    <IoClose className='size-6 cursor-pointer' onClick={() => seteditReply(null)} />
                                  </div>
                                </div>
                              </div>
                            </div>
                            :
                            <div className='flex gap-x-3 mt-2'>
                              <div className='flex border-b border-gray-600 gap-x-1'>
                                <span className='whitespace-nowrap'>@{showReply['username']}</span>
                                <input type="text" placeholder='Add reply....' className='w-full h-fit bg-transparent outline-none ' value={replycomment}
                                  onChange={e => setreplycomment(e.target.value)} />
                                <IoSend onClick={postCommentReply} className='cursor-pointer size-9 ml-5 text-blue-500' />
                              </div>
                            </div>
                          )
                        }

                        {/* input field for adding reply end here-- */}

                        {/* Mapping through replies */}
                        {comment.replies && showReply['id'] === comment.id && comment.replies.map((reply, replyIndex) => (
                          <div className='flex justify-between pr-3 items-center'>
                            <div className='ml-10 mt-3 p-2 flex gap-y-2 items-center right-0' key={replyIndex}>
                              {reply.userID.profile_pic ? (
                                <div className='shrink-0'>
                                  <img src={reply.userID.profile_pic} alt="profilepic" className='border-[1px] border-gray-400 size-10 rounded-full' />
                                </div>
                              ) : (
                                <FaCircleUser className='md:size-10 size-7' />
                              )}
                              <div className='flex-col justify-between gap-x-2 select-text'>
                                <div className='flex items-center'>
                                  <p className='font-semibold text-gray-300 ml-2'>{reply.userID.username}</p>
                                  <p className='text-[11px] ml-1 text-gray-400'>{reply.time_ago}</p>
                                </div>
                                <p className='ml-2 font-thin md:text-[14px] text-[13px] flex gap-1'><p className='text-blue-700'>@{reply.reply_to}</p>{reply.comment}</p>
                              </div>
                            </div>
                            {
                              reply.userID.id === userID && <div className='relative cursor-pointer'>
                                <MdMoreVert onClick={() => {
                                  if (commentOptionIsOpen) {
                                    if (commentOptionIsOpen.id !== reply.id) {
                                      toogleCommentoption({ id: reply.id })
                                    } else {
                                      toogleCommentoption(null)
                                    }
                                  } else {
                                    toogleCommentoption({ id: reply.id })
                                  }
                                }} />

                                {commentOptionIsOpen && commentOptionIsOpen.id === reply.id && <div className='absolute right-4 bg-gray-700 rounded-sm px-3 py-[1px]'>
                                  <p className='text-xs font-thin text-gray-200 cursor-pointer' onClick={() => seteditReply({ id: reply.id, comment: reply.comment })} >edit</p>
                                  <p className='text-xs font-thin text-gray-200 cursor-pointer' onClick={() => deletecomment(reply.id)} >delete</p>
                                </div>}
                              </div>}
                          </div>

                        ))}

                      </div>
                    ))
                  ) : (
                    <Loader />
                  )}

                </div>
                {/* comments-end-- */}
              </div>
            </div>
          </div>
        }
      </div>
    </>
  )
}

export default ViewPost
