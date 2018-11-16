import {
    axios
} from './Config/config'
export const GetMe = (accesstoken) => axios.get('/users/me?role=phone', {
    headers: {
        'x-accesstoken': accesstoken
    }
})