import {configureStore} from '@reduxjs/toolkit'
import UserdataSlice from './UserdataSlice'
import Posts from './PostSlice'
import Stories from './StoriesSlice'
import Notification from './NotificationSlice'

const store =configureStore({
    reducer:{
        authInfo:UserdataSlice,
        posts:Posts,
        stories:Stories,
        notifications:Notification
    }
})

export default store