import { useNavigate } from 'react-router-dom'
import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'

function AuthChecker({ children }) {
    const navigate = useNavigate()
    let access = localStorage.getItem('access')
    let refresh = localStorage.getItem('refresh')
    useEffect(() => {
        if (access && refresh) {
            navigate('/home/')
        }
    },
    [access,refresh,navigate])
    return children
}

export default AuthChecker