const Root = require('./root')
const {
    Locate_Status
} = require('../config')
class Locate extends Root {
    constructor(collection) {
        super(collection)

    }
    BeforeInsert(fields) {
        if (!fields['address']) throw Error("address cannot null")
        if (!fields['type']) throw Error("type cannot null")
        if (!fields['phone']) throw Error("phone cannot null")
        if (!fields['note']) fields['note'] = null
        if (!fields['name']) fields['name'] = null
        if (!fields['created_at']) fields['created_at'] = new Date()
        if (!fields['driver']) fields['driver'] = null
        if (!fields['locater']) fields['locater'] = null
        if (!fields['location']) fields['location'] = null
        if (!fields['status']) fields['status'] = Locate_Status.NEW
        return fields
    }
    static GetCollection() {
        return new Locate('locates')
    }
}
module.exports = Locate.GetCollection()