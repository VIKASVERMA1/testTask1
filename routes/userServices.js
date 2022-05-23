const express = require("express");
let router = express.Router();
const Users = require("../userSchema");
const access_Token = require("../models/authSchema");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const md5 = require("md5");
const auth = require("../middleware/autentication");
const Address = require("../models/addressSchema");
// const token=("my name is");

// router.get('/test',auth,function(req,res){
//   res.status(200).send({success:true,msg:"Authenticated"})
// })

router.post("/register", async (req, res) => {
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
});

//login Api

router.post("/login", async (req, res) => {
  const name = req.body.userName;
  const pass = req.body.password;
  try {
    let userdata = await Users.findOne({ userName: name });
    const isMatch = await bcrypt.compare(pass, userdata.password);
    if (isMatch) {
      let data = {};
      const users_id = userdata._id.toString();
      const auth_token = md5(users_id);
      data.user_id = users_id;
      data.access_token = auth_token;
      let accessModel = new access_Token(data);
      await accessModel.save();

      res.status(200).json(accessModel);
    } else {
      res.status(500).send("login unsuccessfull");
    }
  } catch (error) {
    console.log(error);
  }
});

//get user Information

router.get("/get/:id", async (req, res) => {
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
});

//delete user Information

router.put("/delete/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await Users.findByIdAndDelete({ _id: id });
    res.send("user data has been deleted");
  } catch (error) {
    res.send("user data has not been deleted");
  }
});

//pagination

router.get("/list/:page", async (req, res) => {
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
});

//Api for giving multiple addressess

router.post("/addresses", async (req, res) => {
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
});

module.exports = router;
