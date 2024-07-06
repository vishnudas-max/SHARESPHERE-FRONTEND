import { jwtDecode } from "jwt-decode";
import api from '../../Config';

const getRefresh = async (refresh) => {
    try {
        console.log('Getting refresh token');
        const response = await api.post('token/refresh/', { refresh });
        return response.data.access;
    } catch (error) {
        return false;
    }
}

const IsAuth = async () => {
    const access = localStorage.getItem('access');
    const refresh = localStorage.getItem('refresh');

    const decodeToken = (token) => jwtDecode(token);

    const setAccessToken = (token) => {
        localStorage.setItem('access', token);
        const decoded = decodeToken(token);
        return {
            username: decoded.username,
            is_admin: decoded.is_admin,
            userID: decoded.user_id
        }
    }

    if (!access) {
        if (refresh) {
            const newAccess = await getRefresh(refresh);
            if (newAccess) {
                return setAccessToken(newAccess);
            }
        }
        return false;
    } else {
        try {
            const decodedToken = decodeToken(access);
            const currentTime = Date.now() / 1000;

            if (decodedToken.exp < currentTime) {
                if (refresh) {
                    const newAccess = await getRefresh(refresh);
                    if (newAccess) {
                        return setAccessToken(newAccess);
                    }
                    console.log('getting refresh token')
                }
                return false;
            } else {
                return {
                    username: decodedToken.username,
                    is_admin: decodedToken.is_admin,
                    userID: decodedToken.user_id
                }
            }
        } catch (error) {
            return false;
        }
    }
}

export default IsAuth;