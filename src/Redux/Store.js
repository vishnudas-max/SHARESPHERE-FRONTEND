import {configureStore} from '@reduxjs/toolkit'
import UserdataSlice from './UserdataSlice'
import Posts from './PostSlice'
const store =configureStore({
    reducer:{
        authInfo:UserdataSlice,
        posts:Posts
    }
})

export default store