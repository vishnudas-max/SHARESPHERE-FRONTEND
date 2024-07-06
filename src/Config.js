import axios from 'axios'
import { delAuth } from './Redux/UserdataSlice';
import { useDispatch } from 'react-redux';

export const baseURL = 'http://127.0.0.1:8000'



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
        let url =baseURL+'/api/token/refresh/'
        console.log(url)

        const response = await axios.post(url, {
          refresh: refreshToken,
        });

        // Store the new access token
        localStorage.setItem('access', response.data.access);

        // Update the Authorization header in the original request and retry it
        originalRequest.headers['Authorization'] = `Bearer ${response.data.access}`;
        return axiosInstance(originalRequest);
      } catch (error) {

        localStorage.clear(); // Clear local storage or perform other logout actions
        return Promise.reject(error);
      } 
    }

    return Promise.reject(error);
  }
);

// function handleTokenRefreshFailure() {

//   dispatch(delAuth()); // Dispatch your action to clear authentication state
//   localStorage.clear(); // Clear local storage or take appropriate logout actions
// }

export default axiosInstance;


