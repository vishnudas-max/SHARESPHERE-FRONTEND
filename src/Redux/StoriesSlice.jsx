import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from '../Config'


export const fetchStory = createAsyncThunk('get/stories/', async () => {
    let access = localStorage.getItem('access')
    const response = await api.get('user/story/', {
        headers: {
            Authorization: `Bearer ${access}`
        }
    });
    return response.data;
})

const StorySlice = createSlice({
    name: 'stories',
    initialState: {
        stories: [],
        status: 'idle',
        error: null
    },
    reducers: {
        delStories: (state, action) => {
            state.status = 'idle'
        },
        addUsertoViewdUser: (state, action) => {
            const { storyID, userID, username } = action.payload;
            const viewer = { username };

            state.stories.forEach(user => {
                if (user.id === userID) {
                    user.stories.forEach(story => {
                        if (story.id === storyID) {
                            story.viewed_users.push(viewer);
                        }
                    });
                }
            })

        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchStory.pending, state => {
                state.status = 'loading'
            })
            .addCase(fetchStory.fulfilled, (state, action) => {
                state.status = 'success'
                state.stories = action.payload
            })
            .addCase(fetchStory.rejected, (state, action) => {
                state.status = 'failed'
                state.error = action.error.message
            })
    }
})

export const { delStories,addUsertoViewdUser } = StorySlice.actions
export default StorySlice.reducer