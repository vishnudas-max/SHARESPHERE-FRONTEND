import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setAuth, delAuth } from '../../Redux/UserdataSlice';
import IsAuth from './IsAuth';
import Loading from '../Pages/Userside/HelperComponents/Loading';

function PrivateRoute({ children }) {
  const dispatch = useDispatch();
  const [isLoading, setLoading] = useState(true);
  const isAuthenticated = useSelector(state => state.authInfo.is_authenticated);
  const isAdmin = useSelector(state => state.authInfo.is_admin);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const authInfo = await IsAuth();
        if (authInfo === false) {
          localStorage.clear();
          dispatch(delAuth());
        } else {
          dispatch(setAuth(authInfo));
        }
      } catch (error) {
        console.error('Error checking authentication:', error);
        localStorage.clear();
        dispatch(delAuth());
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [dispatch]);

  if (isLoading) {
    return <Loading />;
  }
  if (!isAuthenticated) {
    return <Navigate to='/' />;
  }
  if (isAdmin) {
    return <Navigate to='/admin/dashboard/' />;
  }
  return children;
}

export default PrivateRoute;
