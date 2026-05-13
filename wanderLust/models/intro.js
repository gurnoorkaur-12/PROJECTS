const { required } = require("joi");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const introSchema = new Schema({
    intro:{
        type:String,
        required:true
    },
    user:{
        type:Schema.Types.ObjectId,
        ref : "User"
    }

})