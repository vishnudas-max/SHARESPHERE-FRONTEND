import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import api from '../Config'
import { BASE_URL } from '../secrets';

export const fetchPosts = createAsyncThunk('posts/fetchPosts', async (page) => {
    let access = localStorage.getItem('access')
    const response = await api.get(`posts/?page=${page}`, {
        headers: {
            Authorization: `Bearer ${access}`
        }
    });
    return response.data;
});

const PostSlice = createSlice({
    name: 'posts',
    initialState: {
        posts: [],
        status: 'idle',
        error: null,
        nextPage: 1,
        hasMore: true
    },
    reducers: {
        delPost: (state, action) => {
            state.posts = []
            state.status = 'idle'
            state.error = null
            state.nextPage = 1
            state.hasMore = true
        },
        addLike: (state, action) => {
            state.posts.filter(post => {
                if (post.id === action.payload) {
                     post.likes_count = post.likes_count + 1
                }
            })
         },
        removeLike: (state, action) => {
            state.posts.filter(post => {
                if (post.id === action.payload) {
                    return post.likes_count = post.likes_count - 1
                }
            })
         },
        Toggle_is_following: (state, action) => {
            state.posts.filter(post => {
                if (post.userID.username === action.payload) {
                    post.is_following = !post.is_following
                }
            })
         },
         addComment_count: (state, action) => {
            state.posts.filter(post => {
                if (post.id === action.payload) {
                    return post.comment_count = post.comment_count + 1
                }
            })
         },
         edit_post: (state, action) => {
            const {id, caption, contend} = action.payload
            state.posts.filter(post => {
                if (post.id === id) {
                    post.caption = caption
                    post.contend = BASE_URL+contend
                }
            })
         }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchPosts.pending, (state) => {
                state.status = 'loading'
            })
            .addCase(fetchPosts.fulfilled, (state, action) => {
                state.status = 'success'
                state.posts = [...state.posts, ...action.payload.results]
                state.nextPage += 1
                state.hasMore = !!action.payload.next
            })
            .addCase(fetchPosts.rejected, (state, action) => {
                state.status = 'failed'
                state.error = action.error.message
            });
    }
})

export const { delPost, addLike, removeLike, Toggle_is_following, addComment_count,edit_post } = PostSlice.actions
export default PostSlice.reducer
