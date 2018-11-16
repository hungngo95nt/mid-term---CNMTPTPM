import axios from 'axios'
const Point = {

}
const Client = {
    PHONE: "phone",
    DRIVER: "driver",
    POINT: "point",
    LOCATE: "locate"
}
const Socket = {
    Driver: {
        ONLINE: "driver_active",
        OFFLINE: "driver_offline",
        DRIVER_MOVE:"driver_move",
        DRIVER_ACCEPT:"drover_accept",
        DRIVER_DENIED:"driver_denied",
        DRIVER_FINISH:"driver_finish"
    },
    Point:{

    },
    Locate: {
        PAIR: "pair_driver_with_locate",
    },
    Phone: {
        NEW_ADDRESS: "phone_new",
    }
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