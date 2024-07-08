import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import api from '../Config'

export const fetchNotifications = createAsyncThunk('get/notifications/', async () => {
    let access = localStorage.getItem('access')
    const response = await api.get('user/notifications/', {
        headers: {
            Authorization: `Bearer ${access}`
        }
    }
    );
    return response.data;
});

const NotificationSlice = createSlice({
    name: 'notifications',
    initialState: {
        notifications: [],
        status: 'idle',
        error: null
    },
    reducers: {
        followback: (state, action) => {
            const { date, idx } = action.payload;
            if (state.notifications[date] && state.notifications[date][idx]) {
                state.notifications[date][idx].is_following = true;
            }
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchNotifications.pending, (state) => {
                state.status = 'loading'
            })
            .addCase(fetchNotifications.fulfilled, (state, action) => {
                state.status = 'success'
                state.notifications = action.payload
            })
            .addCase(fetchNotifications.rejected, (state, action) => {
                state.status = 'failed'
                state.error = action.error.message
            });
    }
})

export const { followback } = NotificationSlice.actions
export default NotificationSlice.reducer