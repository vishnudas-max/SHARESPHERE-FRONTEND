import {configureStore} from '@reduxjs/toolkit'
import UserdataSlice from './UserdataSlice'
import Posts from './PostSlice'
import Stories from './StoriesSlice'
const store =configureStore({
    reducer:{
        authInfo:UserdataSlice,
        posts:Posts,
        stories:Stories
    }
})

export default store