const express=require('express');
require('./connection')
const User=require('./userSchema');
const UserProfile=require('./usersProfileSchema')
const app=express();
const md5=require('md5')

const port=3000;
app.use(express.json({ extended: false }));

app.listen(port,()=>console.log("server is start"));


app.post('/insert', async (req, res) => {
  const { firstName, lastName,email,password } = req.body;
  const {dob,Mobile_no}=req.body;
  let user = {};
  user.firstName = firstName;
  user.lastName = lastName;
  user.email=email;
  user.password=md5(password);
  user.dob=dob;
  user.Mobile_no=Mobile_no;
  let userModel = new User(user);
  await userModel.save();
  res.json(userModel);
  const user_id=userModel._id.toString();
  console.log(user_id);
  user.user_id=user_id;
  let userModels=new UserProfile(user);
  await userModels.save();

});

