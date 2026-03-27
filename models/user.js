const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose").default;

const userSchema =new Schema({
    email:{
        type:String,
        required:true,
    },
    // username and password is already added by passport local , hashing and salting also
    // hashing algo we are using pbkdf2
})

// console.log(passportLocalMongoose);
// console.log(typeof passportLocalMongoose);
userSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model("User",userSchema);