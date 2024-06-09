import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { baseURL } from '../../../Config'
import { FaCircleUser } from "react-icons/fa6";
import { IoClose } from "react-icons/io5";

function UserStoryView({ userID, closeStory }) {
    const UserWithStories = useSelector(state => state.stories.stories)
    const currentUserStories = UserWithStories.find(user => user.id === Number(userID))
    const storyCount = currentUserStories ? currentUserStories.stories.length : 0
    const [currentStory, setCurrentStory] = useState(0)

    useEffect(() => {
        if (storyCount === 0) return

        const interval = setInterval(() => {
            setCurrentStory(prevStory => {
                if (prevStory + 1 >= storyCount) {
                    closeStory()
                    return prevStory
                }
                return prevStory + 1
            })
        }, 2000)

        return () => clearInterval(interval)
    }, [storyCount, closeStory])

    if (!currentUserStories) return null
   
    return (
        <div className="fixed max-w-full h-screen bg-[#000300] left-0 right-0 z-40">
            <IoClose color='white' className='absolute top-16 right-32 size-9' onClick={()=>closeStory()}/>
            <div className='px-3 py-5 flex gap-x-2'>
                <div>
                    {currentUserStories.profile_pic ?
                        <img src={currentUserStories.profile_pic} alt='Profile' />
                        :
                        <FaCircleUser className='size-8 md:size-9' />
                    }
                </div>
                <div className='w-full pr-10'>
                    <h1 className='font-sans font-semibold text-sm'>{currentUserStories.username}</h1>
                    <div className='w-full h-1 flex gap-x-1'>
                        {
                            Array(storyCount).fill().map((_, index) => (
                                <div key={index} className={`w-full ${index <= currentStory ? 'bg-white' : 'bg-gray-500'}`}></div>
                            ))
                        }
                    </div>
                </div>
            </div>
            <div className='p-5 flex'>
                <div className='w-full h-full flex justify-center' onClick={() => {
                    setCurrentStory(prevStory => {
                        if (prevStory + 1 >= storyCount) {
                            closeStory()
                            return prevStory
                        }
                        return prevStory + 1
                    })
                }}>
                    <img src={baseURL + currentUserStories.stories[currentStory].content} alt="story" className='max-h-[600px]' />
                </div>
            </div>
        </div>
    )
}
export default UserStoryView