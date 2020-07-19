//require
var express = require('express');
var path = require('path');
const bodyParser = require('body-parser');
var logger = require('morgan');
const AppError = require("./src/utils/appError")
const mongoose = require('mongoose')
const cookieParser = require("cookie-parser")
const app = express();
const indexRouter = require('./routes/index');
const authRouter = require("./routes/auth")
const userRouter =  require("./routes/users")
const quesRouter = require("./routes/ques")
const oauthRouter = require("./routes/oauth")
const oauthLogin_Router = require("./routes/oauth_login")
// 
const cors = require("cors")
//
require("dotenv").config()



mongoose.connect(process.env.DB, {
    // some options to deal with deprecated warning, you don't have to worry about them.
    useCreateIndex: true,
    useNewUrlParser: true,
    useFindAndModify: false,
    useUnifiedTopology: true
  }).then(() => console.log("connected to database"))
app.use(cors())
app.use(logger('dev'));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));



app.use('/auth', authRouter);
app.use('/', indexRouter);
app.use('/user', userRouter);
app.use('/ques', quesRouter);
app.use("/oauth_login",oauthLogin_Router)

app.use("/oauth",oauthRouter)
//app.get('/auth/github',
//  passport.authenticate('github'));

// app.get('/auth/github/callback', 
//   passport.authenticate('github', { failureRedirect: '/login' }),
//   function(req, res) {
//     // Successful authentication, redirect home.
//     res.redirect('/');
//   });
// app.get('/auth/github', passport.authenticate('github'));
// app.get('/auth/github/callback', passport.authenticate('github', { failureRedirect: '/login' }), (req, res) => {
//   res.redirect(req.session.returnTo || '/');
// });
// app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email', 'https://www.googleapis.com/auth/drive', 'https://www.googleapis.com/auth/spreadsheets.readonly'], accessType: 'offline', prompt: 'consent' }));
// app.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/login' }), (req, res) => {
//   res.redirect(req.session.returnTo || '/');
// });
// app.use('/ques', quesRouter);

module.exports = app;
