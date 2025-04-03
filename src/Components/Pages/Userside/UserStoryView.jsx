import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { FaCircleUser } from "react-icons/fa6";
import { IoClose } from "react-icons/io5";
import api from '../../../Config'
import { addUsertoViewdUser } from '../../../Redux/StoriesSlice';
import { useDispatch } from 'react-redux';
import ProgressBar from './HelperComponents/StoryProgressBar';

const BASE_URL= process.env.REACT_APP_BASE_URL

function UserStoryView({ userID, closeStory }) {
    const UserWithStories = useSelector(state => state.stories.stories)
    const currentUserStories = UserWithStories.find(user => user.id === Number(userID))
    const storyCount = currentUserStories ? currentUserStories.stories.length : 0
    const [currentStory, setCurrentStory] = useState(0)
    const access = localStorage.getItem('access')
    const dispatch = useDispatch()
    const username = useSelector(state => state.authInfo.username)
    const [width, setWidth] = useState(0);

    const AddViewedUser = async (storyID) => {
        try {
            const response =await api.post(`add/user/tostory/view/${storyID}/`, {}, {
                headers: {
                    Authorization: `Bearer ${access}`
                }
            })
            dispatch(addUsertoViewdUser({ storyID, userID, username }))

        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        if (currentUserStories && currentUserStories.stories[currentStory]) {
            const story = currentUserStories.stories[currentStory];
            if (!story.viewed_users.some(user => user.username === username)) {
                AddViewedUser(story.id);
            }
        }
    }, [currentStory]);

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
        }, 5000)

        return () => clearInterval(interval)
    }, [storyCount, closeStory])

    
    if (!currentUserStories) return null

    return (
        <div className="fixed max-w-full h-screen bg-[#000300] left-0 right-0 z-40 select-none">
            <IoClose color='white' className='absolute top-16 right-32 size-9' onClick={() => closeStory()} />
            <div className='px-3 py-5 flex gap-x-2'>
                <div>
                    {currentUserStories.profile_pic ?
                        <img src={currentUserStories.profile_pic} alt='Profile' className='rounded-full size-9' />
                        :
                        <FaCircleUser className='size-8 md:size-9' />
                    }
                </div>
                <div className='w-full pr-10'>
                    <h1 className='font-sans font-semibold text-sm'>{currentUserStories.username}</h1>
                    <div className='w-full h-1 flex gap-x-1'>
                        {
                            Array(storyCount).fill().map((_, index) => (
                                <div key={index} className={`w-full relative ${index < currentStory ? 'bg-blue-700' : 'bg-gray-500'}`}>
                                    {index === currentStory && <ProgressBar />}
                                </div>
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
                    <img src={currentUserStories.stories[currentStory].content} alt="story" className='max-h-[600px]' />
                </div>
            </div>
        </div>
    )
}
export default UserStoryView