const Root = require('./root')

class Driver extends Root {
    constructor(collection) {
        super(collection)
        
    }
    
    static GetCollection(){
        return new Driver('drivers')
    }
}
module.exports = Driver.GetCollection()