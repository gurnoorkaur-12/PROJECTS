const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose").default;

const userSchema = new Schema({
    email : {
        type:String,
        required:true,
    }
})

userSchema.index({ email: 1 }, { unique: true });

//used passportLocalMongoose as a plugin
userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User",userSchema);
