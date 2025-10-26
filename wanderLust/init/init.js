const initData =require("./data.js");
const mongoose=require("mongoose");
let Listing=require("../models/listing.js")
main()
.then(console.log("connection successfull"))
.catch(err=>console.log(err));

async function main(){
    await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
}

const initDB=async function(){
    await Listing.deleteMany();
    await Listing.insertMany(initData.data);
    console.log("data was initialized");
}
initDB();























