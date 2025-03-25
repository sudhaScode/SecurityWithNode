const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')


/// Create a mongoose Scheme with
/**
  mail : str,
  password : str , min 8 char
 */
const Schema = mongoose.Schema({
    username: {type: String, required:  true, unique: true},
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true, length: 8},
    role: {type: String, enum: ["user", "admin"], default: 'user'},

})

// before executing the request
Schema.pre("save", async function(next){
    if( !this.isModified("password")){
        next();
    }
    try{
        const salt = await bcrypt.genSalt(10)
        this.password = await bcrypt.hash(this.password, salt);
        next()
    }
    catch(error){
        next(error)
    }
})

// utility function from model
Schema.methods.comparePassword = function (password){
    return bcrypt.compare(password, this.password)
}

module.exports =mongoose.model("Credential", Schema)
