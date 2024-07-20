import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
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
import VideoCall from '../Components/Pages/Userside/VideoCall';
import More from '../Components/Pages/Userside/More';
import ForgotPassword from '../Components/Pages/Userside/ForgotPassword';
import ChangePassword from '../Components/Pages/Userside/ChangePassword';
import ProfileEdit from '../Components/Pages/Userside/ProfileEdit';
import CallSocketProvider from '../Contexts/CallSocketProvider';
import ForgotPasswordContextProvider from '../Contexts/ForgotPasswordContextProvider'
import Explore from '../Components/Pages/Userside/Explore';

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

      <Route path='/forgot/password/' element={
        <ForgotPasswordContextProvider>
          <AuthChecker>
            <ForgotPassword />
          </AuthChecker>
        </ForgotPasswordContextProvider>
      } />

      <Route path='/forgot/password/update/' element={
        <ForgotPasswordContextProvider>
          <AuthChecker>
            <ChangePassword />
          </AuthChecker>
        </ForgotPasswordContextProvider>
      } />

      <Route path='home/' element={
        <PrivetRoute>
          <CallSocketProvider>
            <Home />
          </CallSocketProvider>
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
          <CallSocketProvider>
            <Chat />
          </CallSocketProvider>
        </PrivetRoute>
      } />

      <Route path='home/notification/' element={
        <PrivetRoute>
          <Notification />
        </PrivetRoute>
      } />

      <Route path='home/chat/videocall/:username' element={
        <PrivetRoute>
          <CallSocketProvider>
            <VideoCall />
          </CallSocketProvider>

        </PrivetRoute>
      } />

      <Route path='home/profile/edit/' element={
        <PrivetRoute>
          <ProfileEdit />
        </PrivetRoute>
      } />

      <Route path='home/profile/more/' element={
        <PrivetRoute>
          <More />
        </PrivetRoute>
      } />

      <Route path='home/Explore/' element={
        <PrivetRoute>
          <Explore />
        </PrivetRoute>
      } />

      <Route path="*" element={<Navigate to="/" />} />

    </Routes>
  )
}

export default UserWrapper