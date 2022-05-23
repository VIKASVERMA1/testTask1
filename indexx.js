const express=require("express");
const app=express();
require("./connection")
require("./userSchema")
const bodyParser = require('body-parser')

const register=require("./routes/userServices")

port=3002;

app.use(express.json());
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use('/user',register);




app.listen(port,()=>{
    console.log(`your server is runnig on port ${port}`);
})