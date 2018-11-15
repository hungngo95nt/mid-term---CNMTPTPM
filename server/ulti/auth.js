var bcrypt = require('bcrypt');
var Promise = require('bluebird')
const {
    JWT_SERCRET
} = require('../config')
const jwt = require('jsonwebtoken')
exports.cryptPassword = function (password) {
    const d = Promise.defer()
    bcrypt.genSalt(10, function (err, salt) {
        if (err)
            d.reject(err);

        bcrypt.hash(password, salt, function (err, hash) {
            d.resolve(hash)
        });
    });
    return d.promise;
};

exports.comparePassword = function (plainPass, hashword) {
    const d = Promise.defer()
    bcrypt.compare(plainPass, hashword, function (err, isPasswordMatch) {
        err ? d.reject(err) : d.resolve(isPasswordMatch);
    });
    return d.promise
};

exports.GenerateToken = function (payload) {
    const d = Promise.defer()
    jwt.sign(payload, JWT_SERCRET, {
        expiresIn: "30d"
    }, (err, token) => {
        err ? d.reject(err) : d.resolve(token)
    })
    return d.promise;
};
exports.VerifiedToken = function (token) {
    const d = Promise.defer()
    jwt.verify(token, JWT_SERCRET, (err, payload) => {
        err ? d.reject(err) : d.resolve(payload)
    })
    return d.promise
};