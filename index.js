const express=require("express");
const app=express();
require("./middleware/auth");
require("./databaseconnection")
const bodyParser = require('body-parser')
const passport = require('passport');
// require('./passport/passport')
const fileUpload=require("express-fileupload")
require('./emialTransporter/transporter')


port=3006;

app.use(fileUpload({
    useTempFiles:true,
    // tempFileDir:'uploads/'
}))

app.use(express.json());
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }));
app.use(require('express-session')({ secret: 'keyboard cat', resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

app.use('/uploads', express.static('uploads'));

var usersRouter = require("./routes/userRoutes");


app.use("/user", usersRouter);




app.listen(port,()=>{
    console.log(`your server is runnig on port ${port}`);
})