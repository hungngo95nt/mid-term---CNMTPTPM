const axios = require('axios')
const fetch = axios.create({
    baseURL: 'http://localhost:8080',
    timeOut: 10000
})

const OfflineDriver = (email) =>
    fetch.put('/users/offline', {
        email: email
    })

const OnlineDriver = (email) =>
    fetch.put(`/users/online`, {
        email: email
    })
const Pair = (payload, id) =>
    fetch.put(`/drivers/pair/${id}`, {
        payload
    })
const ChangeDriverStatus = (id) =>{
    return fetch.put(`/users/status/${id}`,{
        message:"OK"
    })
}
module.exports = {
    OnlineDriver,
    OfflineDriver,
    Pair,ChangeDriverStatus
}