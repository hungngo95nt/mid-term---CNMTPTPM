import {
    axios
} from '../Config/config'
export const PostAddress = (access, form) => axios.post('/locates/address', form, {
    headers: {
        'x-accesstoken': access
    }
})