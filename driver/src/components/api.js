import {
    axios
} from './Config/config'
export const GetMe = (accesstoken) => axios.get('/users/me?role=driver', {
    headers: {
        'x-accesstoken': accesstoken
    }
})