const Root = require('./root')

class Point extends Root {
    constructor(collection) {
        super(collection)
        
        
    }
    static GetCollection(){
       
        return new Point("points")
    }
}
module.exports = Point.GetCollection()