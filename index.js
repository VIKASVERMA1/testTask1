const express = require("express");
require("./connection");
const User = require("./userSchema");
require("./usersProfileSchema");
const app = express();
const md5 = require("md5");
const usersProfileSchema = require("./usersProfileSchema");
const moment = require("moment");

const port = 3001;
app.use(express.json({ extended: false }));

app.listen(port, () => console.log("server is start"));

app.post("/insert", async (req, res) => {
  const { firstName, lastName, email, password } = req.body;
  const { dob, Mobile_no } = req.body;
  let user = {};
  user.firstName = firstName;
  user.lastName = lastName;
  user.email = email;
  user.password = md5(password);
  user.dob = dob;
  user.Mobile_no = Mobile_no;
  let userModel = new User(user);
  await userModel.save();
  res.json(userModel);
  const user_id = userModel._id.toString();
  console.log(user_id);
  user.user_id = user_id;
  var userModels = new UserProfile(user);
  await userModels.save();
});

app.get("/", async (req, res) => {
  let user1 = await UserProfile.find();

  for (var i = 0; i < user1.length; i++) {
    let dateOfBirth = user1[i].dob;
 
    let date1 = dateOfBirth.split("/");
    let date2 = new Date().toLocaleDateString();
    let date3 = date2.split("/");
    let age = date3[2] - date1[2];
    console.log(age);
    if (age > 25) {

      let data2= await UserProfile.deleteOne({ user_id: user1[i].user_id });
      let data3=await User.findOneAndDelete({_id:user1[i].user_id});
      console.log(data2)
    }else{
      console.log("error")
    }
  }
});
