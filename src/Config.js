import axios from 'axios'
// import { BASE_URL } from './secrets';

const BASE_URL = process.env.REACT_APP_BASE_URL

  


const axiosInstance = axios.create({
  baseURL: `${BASE_URL}/api/`
});


axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response.data.status === false && !originalRequest._retry && error.response.status === 401) {
      originalRequest._retry = true;
      return Promise.reject(error);
    }

    if(error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshToken = localStorage.getItem('refresh');
        let url =BASE_URL+'/api/token/refresh/'
        console.log(url)

        const response = await axios.post(url, {
          refresh: refreshToken,
        });

        // Store the new access token
        localStorage.setItem('access', response.data.access);
        console.log('access token updated')
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



export default axiosInstance;


