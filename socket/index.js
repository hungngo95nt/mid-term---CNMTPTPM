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



server.listen(8000, (err) => {
    if (err) throw err
    console.log("Socket is running")
})