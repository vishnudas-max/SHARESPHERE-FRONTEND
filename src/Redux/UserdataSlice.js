import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    "username" : "",
    "is_authenticated" :false,
    "is_admin":false,
    "userID":null
}

const userDataSlice = createSlice({
    name:'userData',
    initialState,
    reducers:{
        setAuth(state,action){
            state.username = action.payload.username
            state.is_authenticated = true
            state.is_admin = action.payload.is_admin
            state.userID = action.payload.userID
        },
        delAuth(state){
            state.username =""
            state.is_admin = false
            state.is_authenticated = false
            state.userID = null
        }
    }
}
)

export const { setAuth,delAuth} = userDataSlice.actions
export default userDataSlice.reducer