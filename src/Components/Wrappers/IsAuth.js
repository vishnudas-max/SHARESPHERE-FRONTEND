import { jwtDecode } from "jwt-decode";
import api from '../../Config'

const getRefresh = async (refresh) => {
    try {
        const response = await api.post('token/refresh/', { refresh })
        return response.data.access
    }
    catch (error) {
        return false
    }
}

const IsAuth = async () => {
    const access = localStorage.getItem('access')
    const refresh = localStorage.getItem('refresh')
    if (!access) {
        return false
    } else {
        try {
            const decodeToken = jwtDecode(access)
            const currentTime = Date.now() / 1000;
            if (decodeToken.exp < currentTime) {
                if (refresh) {
                    try {
                        const access = await getRefresh(refresh)
                        localStorage.setItem('access', access)
                        return {
                            username: decodeToken.username,
                            is_admin: decodeToken.is_admin,
                            userID: decodeToken.user_id
                        }
                    }
                    catch (error) {
                        return false
                    }
                } else {
                   
                    return false
                }
            } else {
                return {
                    username: decodeToken.username,
                    is_admin: decodeToken.is_admin,
                    userID: decodeToken.user_id
                }
            }
        }
        catch (error) {

        }
    }
}

export default IsAuth