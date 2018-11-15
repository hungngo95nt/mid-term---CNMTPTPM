var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);
const {
    Client,
    Locate,
    Phone,
    Driver
} = require("./config.js");
const {
    OfflineDriver,
    OnlineDriver,
    Pair,
    ChangeDriverStatus

} = require('./api')
let Pointers = null
let Drivers = new Map()
let Locaters = new Map()
let Phoners = new Map()
let LocationsQueue = []


io.on('connection', (socket) => {
    //==============Connection=========== 
    socket.on(Client.DRIVER, (client_id) => {
        console.log(`Connected: ${client_id}`)
        OnlineDriver(client_id)
            .then(response => {
                for (let [key, value] of Locaters) {
                    io.to(value.id).emit(Driver.ONLINE, response.data.message)
                }
            })
            .catch(err => console.error(err))
        Drivers.set(client_id, {
            id: socket.id,
            status: "free"
        })
    })
})
server.listen(8000, (err) => {
    if (err) throw err
    console.log("Socket is running")
})