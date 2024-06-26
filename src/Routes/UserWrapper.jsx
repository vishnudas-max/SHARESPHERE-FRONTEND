import React from 'react'
import { Routes,Route} from 'react-router-dom'
import Register from '../Components/Pages/Userside/Register';
import RegisterOtp from '../Components/Pages/Userside/RegisterOTP'
import RegisterContextProvider from '../Contexts/RegisterContextProvider'
import Login from '../Components/Pages/Userside/Login'
import Home from '../Components/Pages/Userside/Home';
import PrivetRoute from '../Components/Wrappers/PrivetRoute';
import AuthChecker from '../Components//Wrappers/AuthChecker';
import ViewPost from '../Components/Pages/Userside/ViewPost';
import EditPost from '../Components/Pages/Userside/EditPost';
import UserProfile from '../Components/Pages/Userside/UserProfile';
import Profile from '../Components/Pages/Userside/Profile';
import Chat from '../Components/Pages/Userside/Chat';
import Notification from '../Components/Pages/Userside/Notification';

function UserWrapper() {
  return (
    <Routes>

        <Route path='register/' element={
          <RegisterContextProvider>
            <AuthChecker>
              <Register />
            </AuthChecker>
          </RegisterContextProvider>}
        />

        <Route path='register/otp/' element={
          <RegisterContextProvider>
            <AuthChecker>
              <RegisterOtp />
            </AuthChecker>
          </RegisterContextProvider>} />

        <Route path='/' element={
          <AuthChecker>
            <Login />
          </AuthChecker>
        } />

        <Route path='home/' element={
          <PrivetRoute>
            <Home />
          </PrivetRoute>
        } />

        <Route path='home/post/:id' element={
          <PrivetRoute>
            <ViewPost />
          </PrivetRoute>
        } />

        <Route path='home/post/edit/:id' element={
          <PrivetRoute>
            <EditPost />
          </PrivetRoute>
        } />

        <Route path='home/user/profile/:id' element={
          <PrivetRoute>
            <UserProfile />
          </PrivetRoute>
        } />

       
        <Route path='home/profile/' element={
          <PrivetRoute>
            <Profile />
          </PrivetRoute>
        } />

        <Route path='home/message/' element={
          <PrivetRoute>
            <Chat />
          </PrivetRoute>
        } />

        <Route path='home/notification/' element={
          <PrivetRoute>
            <Notification />
          </PrivetRoute>
        } />

    </Routes>
  )
}

export default UserWrapper