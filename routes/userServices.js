const express = require("express");
let router = express.Router();
const Users = require("../userSchema");
const bcrypt = require("bcrypt");
// var md5 = require("md5");

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
  console.log(req);
  const name = req.body.userName;
  const pass = req.body.password;
  try {
    let userdata = await Users.findOne({ userName: name });
    const isMatch = await bcrypt.compare(pass, userdata.password);
    if (isMatch) {
      const access_token = userdata._id.toString();
      res.send(access_token);
    } else {
      res.status(500).send("login unsuccessfull");
    }
  } catch (error) {
    console.log(error);
  }
});

//get user Information

router.get("/get/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const userInformation = await Users.findById({ _id: id });
    res.status(200).json(userInformation);
  } catch (error) {
    res.status(501).json(error);
  }
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

module.exports = router;
