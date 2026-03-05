const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        unique : [true , "user already taken"],
        required : true ,
    },
    email:{
        type: String,
        unique : [true , "email already taken"],
        required : true ,
    },
    password:{
        type :String,
        required : true,
    }
})

const userModel = mongoose.model("User", userSchema)

module.exports = userModel;