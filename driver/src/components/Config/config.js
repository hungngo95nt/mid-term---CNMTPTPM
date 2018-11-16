import axios from 'axios'
const Locate = {
    PAIR: "pair_driver_with_locate",
    DIRECT_PAIR:"direct_pair"
}
const Phone = {
    NEW_ADDRESS: "phone_new",
}
const Driver = {
    DRIVER_MOVE:"driver_move",
    DRIVER_ACCEPT:"drover_accept",
    DRIVER_DENIED:"driver_denied",
    DRIVER_FINISH:"driver_finish",

}
const Point = {

}
const Client = {
    PHONE: "phone",
    DRIVER: "driver",
    POINT: "point",
    LOCATE: "locate"
}
const Socket = {
    Driver,
    Point,
    Locate,
    Phone
}
const serverURL = "http://localhost:8080"
const socketURL = "http://localhost:8000"
axios.defaults.baseURL = serverURL
export {
    Client,
    socketURL,
    serverURL,
    axios,
    Socket

}