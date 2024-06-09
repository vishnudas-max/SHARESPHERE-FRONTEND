import React, { useEffect, useState, useSyncExternalStore } from 'react'
import api from '../../../../Config'
import Loader from './Loader'
import { FaCircleUser } from "react-icons/fa6";
import { useSelector } from 'react-redux';
import { IoSend } from "react-icons/io5";
import { addComment_count } from '../../../../Redux/PostSlice';
import { useDispatch } from 'react-redux';

function Commets({ view, postID }) {
    const dispatch = useDispatch()
    const profile_pic = useSelector(state => state.authInfo.profile_pic)
    const username = useSelector(state => state.authInfo.username)
    const [comments, setComments] = useState(null)
    const access = localStorage.getItem('access')
    const [showReply, setShowReply] = useState({})
    const [comment, AddComment] = useState('')
    const userID = useSelector(state => state.authInfo.userID)
    const [replycomment, setreplycomment] = useState('')
    


    // function to fetchcomment-
    const fetchComment = async () => {
        try {
            const response = await api.get(`post/comment/${postID}/`, {
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

    //   function end here-

    useEffect(() => {
        fetchComment()
    },
        [])


    const handleReplyView = (id, username) => {
        if (showReply.id) {
            setShowReply({})
        }
        else {
            setShowReply({ 'id': id, 'username': username })
        }
    }
    
    // adding Comment-
    const postComment = async e => {
        e.preventDefault()
        if(!userID){
          alert(userID)
        }
        let data = {
          "userID": userID,
          "postID": postID,
          "comment": comment
        }
        try {
          const response = await api.post(`post/comment/${postID}/`, data, {
            headers: {
              Authorization: `Bearer ${access}`
            }
          })
          AddComment('')
          dispatch(addComment_count(postID))
          fetchComment()
        }
        catch (error) {
          console.log(error)
        }
      }
    //   adding comment end--

    // adding reply commment-
    const postCommentReply = async () => {
        // Ensure replycomment is a string
    
        let comment = `@${showReply.username} ${replycomment}`;
        let data = {
          "userID": userID, // Ensure userID is a valid string or number
          "postID": postID, // Ensure id is a valid string or number
          "comment": comment,
          "parent_comment": showReply.id // Ensure commentID is a valid string or number
        };
    
        try {
          const response = await api.post(`post/comment/${postID}/`, data, {
            headers: {
              Authorization: `Bearer ${access}` // Ensure access is a valid string
            }
          });
          fetchComment();
          dispatch(addComment_count(postID))
          setreplycomment('')
        } catch (error) {
          console.error(error);
        }
      };
    // addinG reply comment end--

    return ( 
        <div className={`bg-gray-900 max-w-full md:w-[350px] h-[150px]  ml-3 mr-4 md:mr-7 mt-2 mb-[50px] rounded-md border border-gray-300 px-2 overflow-y-scroll no-scrollbar transition duration-800 ease-in-out absolute z-10 ${view ? 'scale-100' : 'scale-0'
            }`}>

            <div className='flex sticky top-0 justify-between items-center bg-gray-900 pt-2'>
                <div className='flex gap-x-2 '>
                    { profile_pic ?
                        <img src={profile_pic} alt="" className='w-7 h-7 rounded-full' />:
                        <FaCircleUser size={32}/>
                    }
                    <input type="text" placeholder='Type something' className='text-xs w-full text-white bg-transparent border-b border-gray-700 outline-none' value={comment} onChange={e=>AddComment(e.target.value)}/> 
                    <IoSend size={23} className='text-blue-500 cursor-pointer' onClick={postComment}/>
                </div>
              
                </div>
            {
                comments ?
                    comments.map((comment, index) => (

                        <div key={index} className="flex-col gap-x-2 items-center mt-3">
                            {/* // comment start here--- */}
                            <div className='flex gap-x-2 items-center mt-3'>
                                <div>
                                    {comment.userID.profile_pic ?
                                        <img src={comment.userID.profile_pic} alt="" className="size-5 rounded-full" />
                                        :
                                        <FaCircleUser size={23} />
                                    }
                                </div>

                                <div>
                                    <div className="flex items-start">
                                        <p className="text-xs">{comment.userID.username}</p>
                                        <p className="text-[10px] ml-1 font-thin text-gray-400">{comment.comment_time}</p>
                                    </div>
                                    <p className="text-xs font-thin cursor-pointer" onClick={() => handleReplyView(comment.id, comment.userID.username)}>{comment.comment}</p>
                                </div>

                            </div>
                            {/* main-comment-end-- */}

                            {/* Comment Replies */}
                            {comment.replies && showReply['id'] === comment.id && (
                                <div className="ml-10 mt-3 p-2 flex flex-col gap-y-2">
                                    <div className='flex items-end border-b border-gray-600 w-full pb-2 justify-between'>
                                        <div className='flex gap-x-1'>
                                            <span className='text-xs'>@{showReply['username']}</span>
                                         <input type="text" placeholder='reply' className='bg-transparent outline-none text-xs' value={replycomment}
                                         onChange={e=>setreplycomment(e.target.value)}/>
                                        </div>
                                         <IoSend size={18} className='text-blue-500 cursor-pointer' onClick={postCommentReply}/>
                                    </div>
                                   
                                    {comment.replies.map((reply, replyIndex) => (
                                        <div key={replyIndex} className="flex gap-x-2 items-center ">
                                            <div className=''>
                                                {reply.userID.profile_pic ? (
                                                    <img src={reply.userID.profile_pic} alt="" className="size-5 rounded-full" />
                                                ) : (
                                                    <FaCircleUser size={23} />
                                                )}
                                            </div>

                                            <div>
                                                <div className="flex items-start">
                                                    <p className="text-xs">{reply.userID.username}</p>
                                                    <p className="text-[10px] ml-1 font-thin text-gray-400">{reply.comment_time}</p>
                                                </div>
                                                <p className="text-xs font-thin cursor-pointer">{reply.comment}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))
                    :
                    <Loader />

            }
        </div>
    )
}

export default Commets