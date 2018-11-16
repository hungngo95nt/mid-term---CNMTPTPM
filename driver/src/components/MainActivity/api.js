import {
    axios
} from '../Config/config'


export const GetDrivers = () => axios.get('/drivers')
export const UpdateLocation = (location, id) =>
    axios.put(`/users/location/${id}`, {
        location
    })
export const UpdateStatus = (id, data) =>
    axios.put(`/locates/status/${id}`, {
        ...data
    })