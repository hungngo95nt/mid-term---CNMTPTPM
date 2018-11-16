import {
    axios
} from '../Config/config'


export const GetDrivers = () => axios.get('/drivers')
export const UpdateLocation = (location, id) => axios.put(`/users/location/${id}`, {
    location
})
export const Pair = (payload, id) => axios.put(`/drivers/pair/${id}`, {
    payload
})
export const UpdateGeocode = (payload, id) => axios.put(`/locates/location/${id}`, {
    location: payload
})