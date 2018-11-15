const express = require('express')
const morgan = require('morgan')
const bodyParser = require('body-parser')
const app = express()
const cors = require('cors')
const phone = require('./routes/phone')
const locate = require('./routes/locate')
const point = require('./routes/point')
const driver = require('./routes/driver')
const user = require('./routes/user')
var MongoClient = require('mongodb').MongoClient;

app.use(cors())
app.use(bodyParser.urlencoded({
    extended: false
}))
app.use(bodyParser.json())
app.use(morgan('dev'))

app.use("/locates", locate)
app.use("/phones", phone)
app.use("/points", point)
app.use("/drivers", driver)
app.use("/users", user)

app.get("/", (req, res, next) => {
    res.send("this is API server!")
})
app.listen(8080, (err) => {
    if (err) throw err
    console.log("server is running on port 8080!")
})