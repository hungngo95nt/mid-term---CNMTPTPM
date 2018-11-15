const Root = require('./root')
const Model = require('../database')
const {
    Locate_Status
} = require('../config')
class Phone extends Root {
    constructor() {
        super()
        this.router.get('/', this.CheckStatus.bind(this))
        return this.router

    }

    CheckStatus(req, res, next) {
        Model.Phone.check((err, result) => {
            if (err) throw err
            res.send("phone connect success!")
        })
    }
    static GetRouter() {
        return new Phone()
    }
}

module.exports = Phone.GetRouter()