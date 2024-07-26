import React, { useEffect, useState } from 'react'
import api from '../../../../Config'
import Loader from './Loader'
import { FaCircleUser } from "react-icons/fa6";
import { useSelector } from 'react-redux';
import { IoSend } from "react-icons/io5";
import { addComment_count } from '../../../../Redux/PostSlice';
import { useDispatch } from 'react-redux';
import { MdDelete } from "react-icons/md";




const BASE_URL = process.env.REACT_APP_BASE_URL

function Commets({ view, postID }) {
    const dispatch = useDispatch()
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
            console.log(response.data)
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
        if (!userID) {
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

        
        let data = {
            "userID": userID, // Ensure userID is a valid string or number
            "postID": postID, // Ensure id is a valid string or number
            "comment": replycomment,
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
                        // // If the comment has replies and it is being deleted, delete its replies too
                        // if (comment.replies) {
                        //     comment.replies.forEach(reply => {
                        //         if (reply.id === id) {
                        //             comment.replies = comment.replies.filter(reply => reply.id !== id);
                        //         }
                        //     });
                        // }
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
    return (
        <div className={` w-full max-h-[160px]  px-3 mr-4  mt-2  rounded-md  overflow-y-scroll no-scrollbar transition duration-800 ease-in-out 
            }`}>

            <div className='flex sticky top-0 justify-between items-center bg-[#000300]'>
                <div className='flex gap-x-2 '>
                    <input type="text" placeholder='Type something' className='text-xs md:text-sm w-full text-white bg-transparent border-b border-gray-700 outline-none' value={comment} onChange={e => AddComment(e.target.value)} />
                    <IoSend size={23} className='text-blue-500 cursor-pointer' onClick={postComment} />
                </div>

            </div>
            {
                comments ? (
                    comments.length === 0 ?
                        <div className='w-full px-2'>
                            <p className='text-center text-gray-500'>No comments</p>
                        </div>
                        :
                        comments.map((comment, index) => (
                            <div key={index} className="flex-col gap-x-2 items-center mt-3">
                                {/* // comment start here--- */}
                                <div className='flex gap-x-2 items-center mt-3 w-full'>
                                    <div>
                                        <div className='shrink-0'>
                                            {comment.userID.profile_pic ?
                                            
                                                <img src={BASE_URL+comment.userID.profile_pic} alt="" className="size-5 border-[1px] border-gray-400 md:size-7 rounded-full" />
                                                :
                                                <FaCircleUser className='size-5 md:size-7' />
                                            }
                                        </div>

                                    </div>

                                    <div className='flex justify-between w-full  items-center '>
                                        <div className=''>
                                            <div className="flex items-start">
                                                <p className="text-xs">{comment.userID.username}</p>
                                                <p className="text-[10px] ml-1 font-thin text-gray-400">{comment.time_ago}</p>
                                            </div>

                                            <p className="text-xs font-thin cursor-pointer md:text-sm break-words max-w-[300px] sm:max-w-[350px] md:max-w-[500px]"
                                                onClick={() => handleReplyView(comment.id, comment.userID.username)}>
                                                {comment.comment}
                                            </p>
                                        </div>

                                    </div>
                                    <div>
                                        {userID === comment.userID.id && <MdDelete className='size-4 md:size-5  cursor-pointer text-gray-500 float-right' onClick={() => deletecomment(comment.id)} />}
                                    </div>

                                </div>
                                {/* main-comment-end-- */}

                                {/* Comment Replies */}
                                {comment.replies && showReply['id'] === comment.id && (
                                    <div className="ml-10 mt-3 p-2 flex flex-col gap-y-2">
                                        <div className='flex items-end border-b border-gray-600 w-full pb-2 justify-between'>
                                            <div className='flex gap-x-1 basis-11/12'>
                                                <span className='text-xs md:text-sm'>@{showReply['username']}</span>
                                                <input type="text" placeholder='reply' className='bg-transparent outline-none text-xs md:text-sm w-full pr-2' value={replycomment}
                                                    onChange={e => setreplycomment(e.target.value)} />
                                            </div>
                                            <div className='basis-1/12'>
                                                <IoSend size={18} className='text-blue-500 cursor-pointer' onClick={postCommentReply} />
                                            </div>
                                        </div>

                                        {comment.replies.map((reply, replyIndex) => (
                                            <div key={replyIndex} className="flex gap-x-2 items-center ">
                                                <div className='shrink-0'>
                                                    {reply.userID.profile_pic ? (
                                                        <img src={BASE_URL+reply.userID.profile_pic} alt="" className="size-5 md:size-7 border-[1px] border-gray-400 rounded-full" />
                                                    ) : (
                                                        <FaCircleUser className='size-5 md:size-7' />
                                                    )}
                                                </div>
                                                <div className='flex justify-between w-full'>
                                                    <div>
                                                        <div className="flex items-start">
                                                            <p className="text-xs ">{reply.userID.username}</p>
                                                            <p className="text-[10px] ml-1 font-thin text-gray-400">{reply.time_ago}</p>
                                                        </div>
                                                        <p className="text-xs font-thin cursor-pointer md:text-sm flex gap-x-1"><p className='text-blue-700'>@{reply.reply_to}</p>{reply.comment}</p>
                                                    </div>
                                                </div>
                                                <div className='h-full flex align-middle'>
                                                    {userID === reply.userID.id && <MdDelete className='size-4 md:size-5 cursor-pointer text-gray-500 float-right' onClick={() => deletecomment(reply.id)} />}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )))
                    :
                    <h1>Loading...</h1>
            }
        </div>
    )
}

export default Commets