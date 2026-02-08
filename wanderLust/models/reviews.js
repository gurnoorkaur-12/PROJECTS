const mongoose =require('mongoose');
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
    }
})

const Review = mongoose.model("Review",ReviewSchema);

module.exports = Review;







































