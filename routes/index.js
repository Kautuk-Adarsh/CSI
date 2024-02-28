var express = require("express");
var router = express.Router();
const modelUser=require("./users");
const passport=require("passport");
const localStrategy=require("passport-local");
passport.use(new localStrategy(modelUser.authenticate()));


router.get('/', function(req, res, next) {
  res.render("register");
});

router.get("/error",function(req,res){
  throw Error();
})





router.use(function errorHandler(err,req,res,next){
  if(res.headerSent){
    return next(err);
  }
  res.status(500)
  res.render('error', { error: err })

})


router.get("/profile",isLoggedIn,function(req,res){
  res.render("profile");
});


router.get("/login",keeplog, function(req,res){
  res.render("login");
  
})

router.post("/login",passport.authenticate("local",{
  successRedirect:"/profile",
  failureRedirect:"/"
}),function(req,res){

});

router.post("/register",function(req,res){
  var userdata=new modelUser({
    username:req.body.username,
    secret:req.body.secret
  });

  modelUser.register(userdata,req.body.password)
  .then(function(){
    passport.authenticate("local")(req,res,function(){
      res.redirect("/profile");
    })
  })
});

router.get("/logout",function(req,res,next){
  req.logout(function(err){
    if(err)return next(err);
    res.redirect("/login");
  })
})

function isLoggedIn(req,res,next){
  if(req.isAuthenticated()){
    return next();
  }
  res.redirect("/");
}

function keeplog(req,res,next){
  if(req.isAuthenticated()){
    res.redirect("/profile");
  }
  
  if(!req.isAuthenticated()) {
  
  return next();}
}

const newUser=async function(req,res,next){
  const{username,body}=req.body;
  try{
    const existingUser=await useer.findOne({$or:[{emil},{username}]});
    if(existingUser){
      return res.status(400).json({message:"user already exist please go on to login page"});

    }
    next();
  }
  catch(error){
    console.error(error);
    res.status(500).json({message:"Internal server error "});
  }
};



module.exports = router;
