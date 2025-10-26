//creating wrapasync function for error handling
module.exports=(func)=>{
    return function(req,res,next){
        func(req,res,next).catch(next)//call next if error
    }
}

