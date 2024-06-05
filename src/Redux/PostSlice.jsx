import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import api from '../Config'

export const fetchPosts = createAsyncThunk('get/posts/', async () => {
    let access = localStorage.getItem('access')
    const response = await api.get('posts/', {
        headers: {
            Authorization: `Bearer ${access}`
        }
    }
    );
    return response.data;
});

const PostSlice = createSlice({
    name: 'posts',
    initialState: {
        posts: [],
        status: 'idle',
        error: null
    },
    reducers: {
        AddpostToStore: (state, action) => {
            state.posts.push(action.payload)
        },
        delPost: (state, action) => {
            state.posts = []
            state.status = 'idle'
            state.error = null
        },
        addLike: (state, action) => {
            state.posts.filter(post => {
                if (post.id === action.payload) {
                     post.likes_count = post.likes_count + 1
                }

            })
         },
         removeLike: (state,action) =>{
            state.posts.filter(post=>{
                if(post.id === action.payload){
                    return post.likes_count = post.likes_count - 1
                }
            })
         }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchPosts.pending, (state) => {
                state.status = 'laoding'
            })
            .addCase(fetchPosts.fulfilled, (state, action) => {
                state.status = 'success'
                state.posts = action.payload
            })
            .addCase(fetchPosts.rejected, (state, action) => {
                state.status = 'failed'
                state.error = action.error.message
            });
    }
})

export const { AddpostToStore, delPost, addLike,removeLike } = PostSlice.actions
export default PostSlice.reducer