const express = require('express')
const Promise = require('bluebird')
const Model = require('../database')
const {
    VerifiedToken
} = require('../ulti/auth')
const {
    JWT_SERCRET
} = require('../config')
class Root {
    constructor() {
        this.router = express.Router()
    }
    IsAccessTokenBelong(res, accesstoken, role) {
        const d = Promise.defer()
        VerifiedToken(accesstoken)
            .then(payload => {
                return Model.User.findOne({
                    email: payload.email,
                    role: role
                })
            })
            .then(user => {
                if (!user) {
                    return this.HandleErr(res, 400, "User not found")
                } else {
                    d.resolve(user)
                }
            })
            .catch(err => {
                d.reject(err)
            })
        return d.promise
    }
    HandleResult(res, status, data) {
        const message = {
            status,
            message: data
        }
        return res.status(status).send(message)
    }
    HandleErr(res, status, err) {
        const message = {
            status,
            message: err
        }
        return res.status(status).send(message)
    }
}
module.exports = Root