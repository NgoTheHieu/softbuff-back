const User = require("../models/user")
const passport = require("../oauth/index")
const axios = require("axios")
const {catchAsync,AppError} = require("../utils/appError")

exports.loginWithEmail = async (req,res,next)=>{
    const {email,password} = req.body
    if(!email || !password){
        return res.status(400).json({status:"Fail",error:"Email and password are required"})
    }
    const user = await User.loginWithEmail(email,password)
    if(!user){
        return res.status(401).json({status:"Fail",error:"Wrong email or password"})
    }
    const token = await user.generateToken()

    res.json({status:"ok",data:{user:user,token:token}})
}

exports.loginFacebook = catchAsync(async(req,res,next)=>{
    const fbToken = req.query.token
    if(!fbToken){
        return next(new AppError(401,"need token"))
    }
    const data = await axios.get(`https://graph.facebook.com/me?fields=id,name,email&access_token=${fbToken}`)
    console.log(data)

    const user = await User.findOneOrCreate({
        name:data.data.name,
        email:data.data.email
    })
    const token = await user.generateToken()
    res.json({status:"ok",data:user,token})
})

exports.loginWithGithub = catchAsync(async(req,res,next)=>{
    const githubToken = req.query.token
    if(!githubToken){
        return next(new AppError(401,"need token"))
    }
    const data = await axios.get(``)
    console.log(data)
    const user = await User.findOneOrCreate({
        name,email
    })
    const token = await user.generateToken()
    res.json({status:"ok",data:user,token})
})



exports.logout = (req, res) => {
    req.logout();
    req.session.destroy((err) => {
      if (err) console.log('Error : Failed to destroy the session during logout.', err);
      req.user = null;
      res.redirect('/');
    });
  };


exports.getoauth_login =  catchAsync(async(req,res,next)=>{

    res.redirect('https://github.com/login/oauth/authorize?client_id=70bcb4de4999506e19c0&redirect_uri=https://bamboobackend123.herokuapp.com/oauth')
})


exports.loginGithub = catchAsync(async(req,res,next)=>{
    const params = await req.query
    res.json({ status: "ok", data: params });
})

