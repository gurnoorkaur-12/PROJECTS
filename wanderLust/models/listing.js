const mongoose=require("mongoose");
const Schema= mongoose.Schema;
const Review = require("./reviews");

const ListingSchema=new Schema({
    title:{
        type:String,
        required:true
    },
    description:{
        type:String,
    },
    image:{
        type:String,
        default:"/images/default-img.jpg",
        set:v=>v===""?`/images/default-img.jpg`:v
    },
    price:{
        type:Number,
        required:true
    },
    location:{
        type:String
    },
    country:{
        type:String
    },
    reviews:[
        {
            type : Schema.Types.ObjectId,
            ref:"Review"
        }

    ]
});

ListingSchema.post ("findOneAndDelete",async(listing)=>{
    if(listing){
        await Review.deleteMany({_id:{$in : listing.reviews}})
    }
})




const Listing=mongoose.model("Listing",ListingSchema);
module.exports=Listing;



