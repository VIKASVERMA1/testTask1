const Users = require("../models/userSchema");
const access_Token = require("../models/accessToken");
const auth = require("../middleware/auth");
const Address = require("../models/addressSchema");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const secret = require("../config");
const { findById, findOne } = require("../models/userSchema");
const Password_Reset_Token = require("../models/passwordResetToken");
var multer = require("multer");
const path = require("path");
const transporter=require('../emialTransporter/transporter')
const cloudinary=require('cloudinary').v2
const cloudinaries=require("../onlineStorageCloudinary/cloudinary")

exports.userRegister = async (req, res) => {
  const { firstName, lastName, userName, email_id, password, confirmPassword } =
    req.body;
  try {
    if (password == confirmPassword) {
      let usersEmail = await Users.findOne({ email_id: email_id });
      if (usersEmail == null) {
        let userNsame = await Users.findOne({ userName: userName });
        if (userNsame == null) {
          let users = {};
          //generate hash password
          const salt = await bcrypt.genSalt(10);
          const passwords = await bcrypt.hash(password, salt);
          users.firstName = firstName;
          users.lastName = lastName;
          users.userName = userName;
          users.email_id = email_id;
          users.password = passwords;
          users.confirmPassword = passwords;
          let userModel = new Users(users);
          await userModel.save();
          res.send("user has been registered successfully");
          var mailOptions={
            from:'vikashverma209200@gmail.com',
            to:'vikashverma209200@gmail.com',
            subject:'sending email using node.js',
            text:'New user is registered in our database'
          };
          transporter.sendMail(mailOptions,function(error,info){
            if(error){
              console.log(error);
            }else{
              console.log('Email sent:'+info.response);
            }
          })
         
        } else {
          res.send("This user name is already present");
        }
      } else {
        res.send("This email_id already exist");
      }
    } else {
      res.send("password does not match with confirm password");
    }
  } catch (error) {
    console.log(error);
  }
};

//login Api

exports.userLogin = async (req, res) => {
  const name = req.body.userName;
  const pass = req.body.password;
  try {
    let userdata = await Users.findOne({ userName: name });
    const isMatch = await bcrypt.compare(pass, userdata.password);
    if (isMatch) {
      let data = {};
      const user_id = userdata._id.toString();
      let date = new Date();
      const token = jwt.sign(
        { user_id: userdata._id, email_id: userdata.email_id },
        secret.jwtSecret,
        { expiresIn: "1hr" }
      );
      console.log(token);
      data.user_id = user_id;
      data.access_token = token;
      let accessModel = new access_Token(data);
      await accessModel.save();
      res.status(200).json({
        message: "User found",
        accessModel,
      });
    } else {
      res.status(500).send("login unsuccessfull");
    }
  } catch (error) {
    console.log(error);
  }
};

//get user Information

exports.userInformation = async (req, res) => {
  const { id } = req.params;
  var resultArray = {
    users: [],
    Addresses: [],
  };
  const userInformation = await Users.findById({ _id: id });
  resultArray.users.push(userInformation);
  const userAddress = await Address.findOne({ user_id: id });
  resultArray.Addresses.push(userAddress);
  res.send({ users: resultArray.users, Address: resultArray.Addresses });
};

//delete user Information

exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    await Users.findByIdAndDelete({ _id: id });
    res.send("user data has been deleted");
  } catch (error) {
    res.send("user data has not been deleted");
  }
};

//pagination

exports.userPagination = async (req, res) => {
  try {
    const { page } = req.params;
    let limits = 10;

    const data = await Users.find({})
      .skip(page * limits - limits)
      .limit(limits);

    // get total documents in the Posts collection
    const count = await Users.countDocuments();

    // return response with posts, total pages, and current page
    res.json({
      data,
      totalPages: Math.ceil(count / limits),
      currentPage: page,
    });
  } catch (error) {
    res.json({ message: error });
  }
};

//Api for giving multiple addressess
//one-to-many 
exports.multipleAddress = async (req, res) => {
  try {
    const tokens = await access_Token.findOne({
      access_token: req.body.access_token,
    });
    if (tokens) {
      const data = await Address.findOne({ user_id: req.body.user_id });

      if (data) {
        var add_address = [];
        for (let i = 0; i < data.user_addresses.length; i++) {
          add_address.push(data.user_addresses[i]);
        }
        add_address.push(req.body.user_addresses);
        const updated_Data = await Address.findOneAndUpdate(
          { user_id: req.body.user_id },
          { $set: { user_addresses: add_address } },
          { returnDocument: "after" }
        );
        res
          .status(200)
          .send({ success: true, msg: "Address details", data: updated_Data });
      } else {
        console.log(req.body);
        const addressess = new Address({
          user_id: req.body.user_id,
          user_addresses: req.body.user_addresses,
        });
        const address_data = await addressess.save();
        res
          .status(200)
          .send({ success: true, msg: "Address details", data: address_data });
      }
    } else {
      res.status(400).send({ success: false, msg: "Invalid access_token" });
    }
  } catch (error) {
    res.status(400).send({ success: false, msg: error.message });
  }
};

//delete userAddress

exports.deleteAddress = async (req, res) => {
  try {
    const id = req.body._id;
    console.log(id);
    for (var i = 0; i < id.length; i++) {
      console.log(id[i]);
      await Address.findByIdAndDelete({ _id: id[i] });
      res.send("Address has been deleted");
    }
  } catch (error) {
    res.send("Address has not been deleted");
  }
};
//forgot verify the user and generate a password reset token

exports.generateToken = async (req, res) => {
  const username = req.body.userName;
  try {
    const userVerify = await Users.find({ userName: username });
    if (userVerify) {
      let tokens = {};
      let date = new Date();
      const token = jwt.sign(
        { email_id: userVerify.email_id },
        secret.jwtSecret,
        { expiresIn: "10m" }
      );
      tokens.password_Access_Token = token;
      let accessTokens = new Password_Reset_Token(tokens);
      await accessTokens.save();
      res.status(200).json({ Access_Token: token });
      var mailOptions={
        from:'vikashverma209200@gmail.com',
        to:'vikashverma209200@gmail.com',
        subject:'sending email using node.js',
        text:'New user is registered in our database',
        html: `<p>Click <a href="http://localhost:3000/verify-reset-password/' + ${token} + '">here</a> to reset your password</p>`
      };
      transporter.sendMail(mailOptions,function(error,info){
        if(error){
          console.log(error);
        }else{
          console.log('Email sent:'+info.response);
        }
      })
    } else {
      res.status(400).json({ success: false, msg: "userName not found" });
    }
  } catch (error) {
    console.log(error);
  }
};

//verify the password reset token and reset the password

exports.resetPassword = async (req, res) => {
  const { Password_Access_Token } = req.params;
  console.log(Password_Access_Token);
  const userName = req.body.userName;
  const password = req.body.password;
  const confirmPassword = req.body.confirmPassword;
  const isMatch = await Password_Reset_Token.findOne({
    password_Access_Token: Password_Access_Token,
  });
  console.log(isMatch);
  if (password == confirmPassword) {
    if (isMatch != null) {
      const salt = await bcrypt.genSalt(10);
      const passwords = await bcrypt.hash(password, salt);
      await Users.updateOne(
        { userName },
        { $set: { password: passwords, confirmPassword: passwords } }
      );
      await Password_Reset_Token.findOneAndDelete({
        password_Access_Token: Password_Access_Token,
      });
      res.status(200).json({ success: true, msg: "Password has been changed" });
      var mailOptions={
        from:'vikashverma209200@gmail.com',
        to:'vikashverma209200@gmail.com',
        subject:'sending email using node.js',
        text:'Your password has been changed successfully',
              };
      transporter.sendMail(mailOptions,function(error,info){
        if(error){
          console.log(error);
        }else{
          console.log('Email sent:'+info.response);
        }
      })
    } else {
      console.log("error");
    }
  } else {
    res
      .status(400)
      .json({ success: false, msg: "Password_Reset_Token is not verified" });
  }
};

//upload image API

exports.uploadImage = async (req, res) => {
  let fileName = Date.now() + "_" + req.files.profile.name;
  let newPath = path.join(process.cwd(), "uploads", fileName);
  req.files.profile.mv(newPath);
  console.log(req.files);
  res.status(200).json(req.files);
};

//upload image in online storage

exports.uploadImageOnline = async (req, res) => {
 const file=req.files.photo
 cloudinary.uploader.upload(file.tempFilePath,(err,result)=>{
   console.log(result)
 })
};

