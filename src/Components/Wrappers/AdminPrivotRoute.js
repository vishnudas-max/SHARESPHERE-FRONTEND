import React, { useEffect,useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setAuth, delAuth } from '../../Redux/UserdataSlice'
import IsAuth from './IsAuth';
import Loading from '../Pages/Userside/HelperComponents/Loading'


function AdminPrivotRoute({ children }) {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [isLoading, setLoading] = useState(true);
    const isAuthenticated = useSelector(state => state.authInfo.is_authenticated)
    const isAdmin = useSelector(state => state.authInfo.is_admin)
    useEffect(() => {
        const fetchdata = async () => {
            const authInfo = await IsAuth()
            if (authInfo === false) {
                localStorage.clear()
                dispatch(delAuth())
                setLoading(false)
            } else {
                dispatch(setAuth(authInfo))
                setLoading(false)
            }
        }
       fetchdata()
    },
    [dispatch])
    if(isLoading){
        return <Loading />
    }
    if(!isAuthenticated){
        return <Navigate to={'/'} />
    }
    if(!isAdmin){
        return <Navigate to={'/home/'} />
    }
    return children;
}

export default AdminPrivotRoute;
