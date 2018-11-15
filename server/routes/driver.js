const Root = require('./root')
const Model = require('../database')
const faker = require('faker')
const Promise = require('bluebird')
const {
    ObjectID
} = require('mongodb')
const default_position = {
    lat: 10.7666851,
    lng: 106.641758
};

function generateDriver(pos) {
    return {
        name: faker.name.findName(),
        bike: faker.random.number(1000, 9999),
        status: "free",
        location: {
            lat: pos.lat,
            lng: pos.lng
        }
    }
}

function generateMotoBikeLocation(location) {
    const d = Promise.defer()
    const position_arr = []
    for (let i = 0; i < 100; i++) {
        let fix_lat = i % 2 == 0 ? -1 : 1
        let fix_lng = i % 2 != 0 ? -1 : 1
        let pos = {
            lat: i * (Math.random()) / 500 * fix_lat + location.lat,
            lng: i * (Math.random()) / 500 * fix_lng + location.lng
        }
        let driver = generateDriver(pos)
        position_arr.push(driver)
    }
    d.resolve(position_arr)
    return d.promise;
}

function generateWorker(default_position) {
    generateMotoBikeLocation(default_position)
        .then(drivers => {
            return Model.Driver.insertMany(drivers)
        })
        .then(status => {
            console.log("state", status)
        })
        .catch(err => {
            console.log("err", err)
        })
}
class Driver extends Root {
    constructor() {
        super()
        this.router.get('/', this.GetDrivers.bind(this))
        this.router.put('/pair/:id', this.PairDriver.bind(this))
        this.router.put('/unpair/:id', this.UnPairDriver.bind(this))
        this.router.get('/generate', this.GenerateDriver.bind(this))
        return this.router
    }
    UnPairDriver(req, res, next) {
        const {
            driver
        } = req.body.payload
        const _id = req.params.id
        Model.Locate.modified({
                _id: ObjectID(_id)
            }, {$set:{status:"done"}}).then(response => {
                return Model.User.modified({
                    _id: ObjectID(driver._id)
                }, {
                    $set: {
                        status: "free"
                    }
                })
            })
            .then(result => {
                
                this.HandleResult(res, 200, result)
            })
            .catch(err => {
                throw err
            })
    }
    PairDriver(req, res, next) {
        let results ={}
        const {
            driver,
            locater
        } = req.body.payload
        const _id = req.params.id
        const update = {
            $set: {
                driver: driver,
                locater: locater,
                status: "paired"
            }
        }
        Model.Locate.modified({
                _id: ObjectID(_id)
            }, update).then(response => {
                results.location = response
                return Model.User.modified({
                    _id: ObjectID(driver._id)
                }, {
                    $set: {
                        status: "busy",
                        point:{
                            _id:response._id,
                            location:response.location
                        }
                    }
                })
            })
            .then(response => {
                results.driver = response
                this.HandleResult(res, 200, results)
            })
            .catch(err => {
                throw err
            })

    }
    GetDrivers(req, res, next) {
        Model.User.find({
                status: "free",
                online: true
            })
            .then(drivers => {
                this.HandleResult(res, 200, drivers)
            })
            .catch(err => {
                throw err
            })
    }
    GenerateDriver(req, res, next) {
        generateWorker(default_position)
        res.send("ok")
    }
    static GetRouter() {
        return new Driver()
    }
}

module.exports = Driver.GetRouter()