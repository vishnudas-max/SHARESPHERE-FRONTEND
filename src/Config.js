import axios from 'axios'
import { delAuth } from './Redux/UserdataSlice';
import { useDispatch } from 'react-redux';

const axiosInstance = axios.create({
  baseURL: 'http://127.0.0.1:8000/api/'
});



  axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;

      // If the error is 401 (Unauthorized), try to refresh the token
      if (error.response.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;

        try {
          const refreshToken = localStorage.getItem('refresh');
          const response = await axios.post('http://127.0.0.1:8000/api/token/refresh/', {
            refresh: refreshToken,
          });

          // Store the new access token
          localStorage.setItem('access', response.data.access);

          // Update the Authorization header in the original request and retry it
          originalRequest.headers['Authorization'] = `Bearer ${response.data.access}`;
          return axiosInstance(originalRequest);

        } catch (refreshError) {
          const dispatch = useDispatch()
          console.error('Token refresh failed:', refreshError);
          dispatch(delAuth())
          localStorage.clear()
        }
      }

      return Promise.reject(error);
    }
  );


  export default axiosInstance;


export const baseURL = 'http://127.0.0.1:8000'