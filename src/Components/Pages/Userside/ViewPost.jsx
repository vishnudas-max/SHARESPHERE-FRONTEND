import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import messi from '../../../media/images/messi.webp'
import { AiOutlineMore } from 'react-icons/ai'
import PostOptions from './HelperComponents/PostOptions'

function ViewPost() {
  const { id } = useParams()
  const navigate = useNavigate()
  const posts = useSelector(state => state.posts.posts)
  const userID = useSelector(state => state.authInfo.userID)
  const [optionson, setOptions] = useState(false)

  useEffect(() => {
    if (posts.length === 0) {
      navigate('/home/');
    }
  }, [posts, navigate])

  const post = posts.find(post => post.id === Number(id))
  const comments = [
    { comment: 'This is a great post!', time: '12:45:53' },
    { comment: 'Thanks for sharing!', time: '13:15:23' },
    { comment: 'I totally agree with you.', time: '14:30:45' },
    { comment: 'This is another comment for a different post.', time: '15:45:53' },
    { comment: 'Interesting perspective!', time: '16:05:13' },
    { comment: 'I learned something new today.', time: '17:20:33' },
    { comment: 'Nice photo!', time: '18:35:43' },
    { comment: 'Where was this taken?', time: '19:50:53' },
    { comment: 'Amazing!', time: '20:10:03' },
    { comment: 'Great shot!', time: '21:25:13' },
    { comment: 'I love this!', time: '22:40:23' },
    { comment: 'Wonderful post.', time: '23:55:33' },
    { comment: 'Very informative.', time: '00:10:43' },
    { comment: 'I enjoyed reading this.', time: '01:25:53' },
    { comment: 'Excellent content!', time: '02:41:03' },
    { comment: 'This is very helpful.', time: '03:56:13' },
    { comment: 'I appreciate this post.', time: '05:11:23' },
    { comment: 'Thanks for the insight.', time: '06:26:33' },
    { comment: 'I found this useful.', time: '07:41:43' },
    { comment: 'Great information!', time: '08:56:53' }
  ]


  // Check if post is found
  if (!post) {
    return <div>Post not found</div>;
  }

  // Convert the uploadDate to a JavaScript Date object and format it
  const uploadDate = new Date(post.uploadDate).toLocaleDateString();

  return (
    <div className='select-none'>
      {posts.length !== 0 &&
        <div className="grid grid-cols-3 gap-1 h-screen">

          <div className="col-span-3 md:col-span-2 max-w-[800px] md:h-[screen] mx-auto my-auto px-5 ">
            <img src={post.contend} alt="Post" className='max-w-[500px] max-h-[700px]' />
          </div>

          <div className='col-span-3 md:col-span-1 bg-zinc-900 px-2 pt-3 text-white flex-col h-screen sticky top-14  overflow-hidden '>

            <div className='border-b border-gray-400 md:py-4 py-2'>
              <div className='w-full flex justify-between'>
                <div className='flex gap-x-2 items-center'>
                  <img src={messi} alt="profilepic" className='rounded-full size-12' />
                  <h1 className='font-semibold text-xl'>{post.userID.username}</h1>
                </div>
                {userID === post.userID.id &&
                  <AiOutlineMore color='white' className='size-8 cursor-pointer' onClick={()=>setOptions(o => !o)} />
                      
                }
                {
                  optionson &&
                  <PostOptions animate={true} id={post.id}/>
                }
                   

              </div>

              <div className='mt-3'>
                <p className='md:text-[15px] text-[13px] text-gray-200'>{post.caption}</p>
                <p className='md:text-[15px] text-[13px] text-gray-400 font-semibold mt-3'>{uploadDate}</p>
              </div>
            </div>

            <div className='mt-3 grid grid-cols-5 py-3 border-b border-gray-400'>
              <div className='col-span-3 py-3 flex items-center'>
                <input type="text" placeholder='Add comment..' className='px-1 text-[14px] bg-transparent outline-none border-b border-gray-600' />
              </div>
              <div className='col-span-2 flex items-center justify-end '>
                <button className='mr-3 md:px-4 px-3 py-1 text-[13px] md:text-[14px] border h-fit rounded-md hover:text-black hover:bg-gray-200 font-semibold '>Post</button>
              </div>
            </div>

            {/* conmments-- */}
            <div className='flex-col h-full overflow-y-scroll no-scrollbar '>
              {
                comments.map((comment, index) => (
                  <div className='mt-3 p-2 flex gap-y-2 items-center' key={index}>
                    <img src={messi} alt="" className='size-10 rounded-full' />
                    <div className='flex-col justify-between gap-x-2'>
                      <p className='font-semibold text-gray-300'>@Vishnu</p>
                      <p className='ml-2 font-thin md:text-[14px] text-[13px]'>{comment.comment}</p>
                      <p className='text-xs ml-2 text-gray-400'>{comment.time}</p>
                    </div>
                  </div>
                ))
              }
            </div>
            {/* comments-end-- */}


          </div>
        </div>
      }
    </div>
  )
}

export default ViewPost
