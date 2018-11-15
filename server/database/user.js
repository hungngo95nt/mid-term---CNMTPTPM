const Root = require('./root')

class User extends Root {
    constructor(collection) {
        super(collection)
        
    }
    BeforeInsert(fields){
        if(!fields['created_at']) fields['created_at'] = new Date() 
        if(!fields['email']) throw Error("email cannot null")
        if(!fields['password']) throw Error("password cannot null")  
        if(!fields['role']) throw Error("role cannot null")      
        return fields                  
    }
    static GetCollection(){
        return new User('users')
    }
}
module.exports = User.GetCollection()