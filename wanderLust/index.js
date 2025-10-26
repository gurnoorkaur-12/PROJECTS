const express=require('express');
const app=express();
const methodOverride=require('method-override');
const ejsMate=require('ejs-mate');
const path=require('path');
const mongoose=require('mongoose');
const mongo_url='mongodb://127.0.0.1:27017/wanderlust';
const ExpressError=require("./utils/ExpressError.js")
const listings = require('./routes/listing.js');
const reviews = require('./routes/review.js');
let port=8080;


main()
.then(()=>console.log("connection successfull"))
.catch(err=>{
    console.log(err);
})
async function main(){
    await mongoose.connect(mongo_url);
}

app.use(methodOverride("_method"));
app.engine("ejs",ejsMate);
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.static(path.join(__dirname,"public")));
app.use(express.urlencoded({extended:true}));
app.use(express.json());


app.use("/listings",listings);
app.use("/listings/:id/reviews",reviews);

//MIDDLEWARES
app.all('/{*splat}',(req,res,next)=>{
    next(new ExpressError(404,"Page not found"));
})

app.use((err,req,res,next)=>{
    let {statusCode=500,message="Something went Wrong"}=err;
    res.status(statusCode).render("error.ejs",{message});
})

app.listen(port,(req,res)=>{
    console.log("app is listening on port "+8080);
})











