import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {jwtDecode} from 'jwt-decode'
import { useSelector } from 'react-redux'

function AuthChecker({ children }) {
    const navigate = useNavigate()
    let access = localStorage.getItem('access')
    let refresh = localStorage.getItem('refresh')

    useEffect(() => {
        if (access && refresh) {
            const decoded = jwtDecode(access)
            if (decoded && decoded.is_admin) {
                navigate('/admin/dashboard/')
            } else {
                navigate('/home/')
            }
        }
    }, [access, refresh, navigate])

    return children
}

export default AuthChecker
