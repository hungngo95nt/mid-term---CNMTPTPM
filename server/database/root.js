const express = require('express')
const axios = require('axios')
const router = express.Router()
const MongoClient = require('mongodb').MongoClient
const url = "mongodb://localhost:27017"
const Promise = require('bluebird')

// const CreateCollection = (collection, callback) => {
//     MongoClient.connect(url, (err, db) => {
//         if (err) {
//             callback(err, null)
//         } else {
//             db.createCollection(collection, function (err, res) {
//                 if (err) throw err;
//                 console.log("Collection created!");
//                 db.close();
//                 callback(null, res)
//             });
//         }
//     })
// }
const ConnectDB = (callback) => {
    MongoClient.connect(url, (err, client) => {
        if (err) {
            return callback(err, null)
        } else {
            return callback(null, client)
        }
    })
}
class Root {
    constructor(collection) {
        this.router = router
        this.collection = collection
        this.dbName = "barg"
    }
    BeforeUpdate(fields) {
        fields.$set['modified'] = new Date()
        return fields
    }
    BeforeInsert(fields) {
        if (!fields['created_at']) fields['created_at'] = new Date()
        return fields
    }
    check(callback) {
        ConnectDB((err, client) => {
            if (err) return callback(err, null)
            return callback(null, client)
        })
    }
    find(params, query) {
        const d = Promise.defer()
        ConnectDB((err, client) => {
            if (err) throw err
            const db = client.db(this.dbName)
            db.collection(this.collection).find(params, query == null ? {} : query).toArray((err, data) => {
                err ? d.reject(err) :
                    d.resolve(data)
                client.close()
            })
        })
        return d.promise;
    }
    insert(params) {
        const d = Promise.defer()
        params = this.BeforeInsert(params)
        ConnectDB((err, client) => {
            if (err) throw err
            const db = client.db(this.dbName)
            db.collection(this.collection).insert(params, (err, data) => {
                err ? d.reject(err) :
                    d.resolve(data)
                client.close()
            })
        })
        return d.promise;
    }
    insertMany(params) {
        const d = Promise.defer()
        ConnectDB((err, client) => {
            if (err) throw err
            const db = client.db(this.dbName)
            db.collection(this.collection).insertMany(params,null,(err, data) => {
                err ? d.reject(err) :
                    d.resolve(data)
                client.close()
            })
        })
        return d.promise;
    }
    modified(params, query) {
        const d = Promise.defer()
        query = this.BeforeUpdate(query)
        ConnectDB((err, client) => {
            if (err) throw err
            const db = client.db(this.dbName)
            db.collection(this.collection).findAndModify(params, [
                ["_id", "desc"]
            ], query, {
                safe: 1,
                'new': 1
            }, (err, data) => {
                err ? d.reject(err) :
                    d.resolve(data.value)
                client.close()
            })
        })
        return d.promise
    }
    findOne(params) {
        const d = Promise.defer()
        console.log("parmas", params)
        ConnectDB((err, client) => {
            if (err) throw err
            const db = client.db(this.dbName)
            db.collection(this.collection).findOne(params, null, (err, data) => {
                console.log(err, data)
                err ? d.reject(err) :
                    d.resolve(data)
                client.close()
            })
        })
        return d.promise
    }
}
module.exports = Root