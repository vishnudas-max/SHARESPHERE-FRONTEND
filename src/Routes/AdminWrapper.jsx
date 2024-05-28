import React from 'react'
import { Routes, Route } from 'react-router-dom'
import AdminLogin from '../Components/Pages/Admiside/AdminLogin';
import AdminHome from '../Components/Pages/Admiside/AdminHome';
import AdminPrivotRoute from '../Components/Wrappers/AdminPrivotRoute';
import AdminAuthChecker from '../Components/Wrappers/AdminAuthChecker';
import UserMangement from '../Components/Pages/Admiside/UserMangement';
function UserWrapper() {
    return (
        <Routes>

            <Route path='/*' element={
                <AdminAuthChecker><AdminLogin /></AdminAuthChecker>
            }
            />
            <Route path='dashboard/' element={ <AdminPrivotRoute><AdminHome /></AdminPrivotRoute> }/>
            <Route path='usermanagement/' element={ <AdminPrivotRoute><UserMangement /></AdminPrivotRoute> }/>
        </Routes>
    )
}

export default UserWrapper