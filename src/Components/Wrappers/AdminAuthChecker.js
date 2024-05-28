import { useNavigate } from 'react-router-dom'
import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'

function AdminAuthChecker({ children }) {
    const navigate = useNavigate()
    let access = localStorage.getItem('access')
    let refresh = localStorage.getItem('refresh')
    useEffect(() => {
        if (access && refresh) {
            navigate('/admin/dashboard/')
        }
    },
    [access,refresh,navigate])
    return children
}

export default AdminAuthChecker