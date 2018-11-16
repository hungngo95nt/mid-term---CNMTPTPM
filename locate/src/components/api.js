import {
    axios
} from './Config/config'
export const GetMe = (accesstoken) => axios.get('/users/me?role=locate', {
    headers: {
        'x-accesstoken': accesstoken
    }
})