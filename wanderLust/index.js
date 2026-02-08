const express=require('express');
const app=express();
const methodOverride=require('method-override');
const ejsMate=require('ejs-mate');
const path=require('path');
const mongoose=require('mongoose');
const mongo_url='mongodb://127.0.0.1:27017/wanderlust';
const ExpressError=require("./utils/ExpressError.js")
const listingRouter = require('./routes/listing.js');
const reviewRouter = require('./routes/review.js');
const userRouter = require("./routes/user.js");
const session = require('express-session'); 
const flash = require('connect-flash');
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");
const { request } = require('http');
let port=8080;

main()
.then(()=>("connection successfull"))
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

const sessionOptions  = {
    secret:"mysupersecret",
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires:Date.now() + 7 *24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly:true
    }
};
app.use(session(sessionOptions));
app.use(flash());

//INITIALIZE Passport as a Middleware
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

// use static serialize and deserialize of model for passport session support
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req,res,next)=>{
    res.locals.success =req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user; 
    res.locals.showLoginModal = req.flash("showLoginModal");
    next();
})

app.use("/listings",listingRouter);
app.use("/listings/:id/reviews",reviewRouter);
app.use("/",userRouter);

//MIDDLEWARES

app.all('/{*splat}',(req,res,next)=>{
    next(new ExpressError(404,"Page not found"));
})

app.use((err,req,res,next)=>{
    let {statusCode=500,message="Something went Wrong"}=err;
    res.status(statusCode).render("error.ejs",{message,statusCode});
})

app.listen(port,(req,res)=>{
    console.log("app is listening on port "+8080);
})

