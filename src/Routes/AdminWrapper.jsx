import React from 'react'
import { Routes, Route } from 'react-router-dom'
import AdminHome from '../Components/Pages/Admiside/AdminHome';
import AdminPrivotRoute from '../Components/Wrappers/AdminPrivotRoute';
import UserMangement from '../Components/Pages/Admiside/UserMangement';
import PostManagement from '../Components/Pages/Admiside/PostManagement';
function UserWrapper() {
    return (
        <Routes>
            <Route path='dashboard/' element={ <AdminPrivotRoute><AdminHome /></AdminPrivotRoute> }/>
            <Route path='usermanagement/' element={ <AdminPrivotRoute><UserMangement /></AdminPrivotRoute> }/>
            <Route path='postmanagement/' element={ <AdminPrivotRoute><PostManagement /></AdminPrivotRoute> }/>
        </Routes>
    )
}

export default UserWrapper