const Root = require('./root')

class Phone extends Root {
    constructor(collection) {
        super(collection)
        
    }
    static GetCollection(){
        return new Phone('phones')
    }
}
module.exports = Phone.GetCollection()