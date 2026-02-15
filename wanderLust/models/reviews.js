const mongoose =require('mongoose');
const user = require('./user');
const { Schema }=mongoose;

const ReviewSchema = new Schema({
    comment:{
        type:String,
        required:true,
    },
    rating:{
        type : Number,
        min : 1,
        max : 5,
        required:true
    },
    createdAt:{
        type : Date,
        default : Date.now
    },
    author:{
        type:Schema.Types.ObjectId,
        ref:"User"
    }
})

const Review = mongoose.model("Review",ReviewSchema);

module.exports = Review;







































