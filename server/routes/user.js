const Root = require('./root')
const Model = require('../database')
const validate = require('validator')
const jwt = require('jsonwebtoken')
const Promise = require('bluebird')
const faker = require('faker')
const {
    ObjectID
} = require('mongodb')
const {
    comparePassword,
    cryptPassword,
    GenerateToken,
    VerifiedToken
} = require('../ulti/auth')
const {
    JWT_SERCRET
} = require('../config')
const default_position = {
    lat: 10.7666851,
    lng: 106.641758
};

function generateMotoBikeLocation(default_position) {
    const d = Promise.defer()

    d.resolve(pos)
    return d.promise;
}
class User extends Root {
    constructor() {
        super()
        this.router.get('/', this.CheckStatus.bind(this))
        this.router.post('/login', this.Login.bind(this))
        this.router.put('/location/:id', this.PutLocation.bind(this))
        this.router.put('/online', this.Online.bind(this))
        this.router.put('/offline', this.Offline.bind(this))
        this.router.post('/register', this.Register.bind(this))
        this.router.put('/status/:id', this.PutUserStatus.bind(this))
        this.router.get('/me', this.GetMe.bind(this))
        return this.router

    }
    CheckStatus(req, res, next) {
        Model.User.check((err, result) => {
            if (err) throw err
            res.send("user connect success!")
        })
    }
    PutUserStatus(req, res, next) {
        console.log("start update here")
        Model.User.modified({
            _id: ObjectID(req.params.id)
        }, {
            $set: {
                status: "free"
            }
        })
        .then(result=>{
            this.HandleResult(res,200,"OK")
        })
        .catch(err=>{
            throw err
        })
    }
    PutLocation(req, res, next) {
        const id = req.params.id
        const location = JSON.parse(req.body.location)
        const update = {
            $set: {
                location
            }
        }
        Model.User.modified({
                _id: ObjectID(id)
            }, update)
            .then(response => {
                this.HandleResult(res, 200, response)
            })
            .catch(err => {
                throw err
            })
    }
    GetMe(req, res, next) {
        const accesstoken = req.headers['x-accesstoken']
        const role = req.query.role
        console.log(req.query)
        this.IsAccessTokenBelong(res, accesstoken, role)
            .then(user => {
                this.HandleResult(res, 200, user)
            })
            .catch(err => {
                throw err
            })
    }
    Login(req, res, next) {
        const params = req.body
        let current_user = {}
        const {
            email,
            password,
            role
        } = params
        if (!validate.isEmail(email)) return this.HandleErr(res, 400, "Wrong email type!")
        if (!password) return this.HandleErr(res, 400, "Wrong password!")
        Model.User.findOne({
                "email": email,
                "role": role
            })
            .then(result => {
                if (result) {
                    current_user = result
                    return comparePassword(password, result.password)
                }
                this.HandleErr(res, 204, "")
                return {
                    then: function () {}
                };
            })
            .then(match => {
                match ?
                    GenerateToken({
                        email
                    }).then(token => this.HandleResult(res, 200, {
                        token: token,
                        expiry: new Date().getTime() + 1000 * 60 * 60 * 24 * 30,
                        user: current_user
                    })).catch(err => this.HandleErr(res, 400, err)) :
                    this.HandleErr(res, 403, "Password wrong!")

            })
            .catch(err => {
                throw err
            })
    }
    Online(req, res, next) {
        const email = req.body.email
        let update = {
            $set: {
                online: true
            }
        }
        Model.User.modified({
                email: email
            }, update)
            .then(result => {
                if (result) {
                    this.HandleResult(res, 200, result)
                } else {
                    this.HandleResult(res, 304, "Update failed")
                }
            })
            .catch(err => {
                throw err
            })
    }
    Offline(req, res, next) {
        const email = req.body.email
        let update = {
            $set: {
                online: false
            }
        }
        Model.User.modified({
                email: email
            }, update)
            .then(result => {
                if (result) {
                    this.HandleResult(res, 200, {
                        driver_id: result._id
                    })
                } else {
                    this.HandleResult(res, 304, "Update failed")
                }
            })
            .catch(err => {
                throw err
            })
    }
    Register(req, res, next) {
        const params = req.body
        const {
            email,
            password
        } = params
            !validate.isEmail(email) && this.HandleErr(res, 403, "Invalid email")
        Model.User.findOne({
                "email": email
            })
            .then(user => {
                if (user) {
                    this.HandleErr(res, 400, "This email already taken!")
                    return {
                        then: () => {}
                    }
                } else {
                    return cryptPassword(password)
                }
            })
            .then(result => {
                params.password = result
                if (params.role == "driver") {
                    const i = faker.random.number(1, 1000)
                    let fix_lat = i % 2 == 0 ? -1 : 1
                    let fix_lng = i % 2 != 0 ? -1 : 1
                    let pos = {
                        lat: i * (Math.random()) / 500 * fix_lat + default_position.lat,
                        lng: i * (Math.random()) / 500 * fix_lng + default_position.lng
                    }
                    params.location = pos
                    params.online = false
                    params.status = "free"
                }
                return Model.User.insert(params)
            })
            .then(result => {
                this.HandleResult(res, 200, result.ops[0])
            })
            .catch(err => {
                throw err
            })
    }
    static GetRouter() {
        return new User()
    }
}

module.exports = User.GetRouter()