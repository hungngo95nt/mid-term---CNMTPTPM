const Root = require('./root')
const Model = require('../database')
const {
    Locate_Status
} = require('../config')
const {
    ObjectID
} = require('mongodb')
class Locate extends Root {
    constructor() {
        super()
        this.router.get('/', this.GetAllLocation.bind(this))
        this.router.post('/address', this.PostAddress.bind(this))
        this.router.get('/address', this.GetAddress.bind(this))
        this.router.put('/status/:id', this.PutStatus.bind(this))
        this.router.put('/location/:id', this.PutLocation.bind(this))
        return this.router
    }
    PutStatus(req, res, next) {
        const id = req.params.id
        const update = {
            $set: {
                status: req.body.status
            }
        }
        Model.Locate.modified({
                _id: ObjectID(id)
            }, update)
            .then(response => {
                this.HandleResult(res, 200, response)
            })
            .catch(err => {
                throw err
                this.HandleErr(res, 400, err)
            })
    }
    PutLocation(req, res, next) {
        const update = {
            $set: {
                location: req.body.location,
                status:"locating"
            }
        }
        Model.Locate.modified({
                _id: ObjectID(req.params.id)
            }, update)
            .then(response => {
                this.HandleResult(res, 200, response)
            })
            .catch(err => {
                throw err
            })
    }
    GetAllLocation(req, res, next) {
        Model.Locate.find({})
        .then(response=>{
            this.HandleResult(res,200,response)
        })
        .catch(err=>{
            throw err
            this.HandleErr(res,400,err)
        })
    }
    GetAddress(req, res, next) {
        const accesstoken = req.headers['x-accesstoken']
        if (!accesstoken)
            return this.HandleErr(res, 403, "Not authenticated")
        let me = {}
        this.IsAccessTokenBelong(res, accesstoken, "locate")
            .then(user => {
                me = user
                return Model.Locate.findOne({
                    status: Locate_Status.NEW,
                    locator: null
                })
            })
            .then(result => {
                if (result) {
                    const updated = {
                        $set: {
                            locator: me.email
                        }
                    }
                    return Model.Locate.modified({
                        _id: result._id
                    }, updated)
                }
            })
            .then(result => {
                if (!result) return this.HandleResult(res, 204, "")
                this.HandleResult(res, 200, result)
            })
            .catch(err => {
                throw err
            })

    }
    PostAddress(req, res, next) {
        const address = req.body
        const accesstoken = req.headers['x-accesstoken']
        this.IsAccessTokenBelong(res, accesstoken, "phone")
            .then(user => {
                return Model.Locate.insert(address)
            })
            .then(result => {
                result ? this.HandleResult(res, 201, result.ops[0]) :
                    this.HandleErr(res, 400, "Insert fail")
            })
            .catch(err => {
                console.error(err)
                throw err
            })
    }
    static GetRouter() {
        return new Locate()
    }
}

module.exports = Locate.GetRouter()