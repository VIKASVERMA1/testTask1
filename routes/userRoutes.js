const express = require("express");
const router = express.Router("epxpress");
const userController = require("../controller/userController");
const middleware = require("../middleware/auth");
// const passport = require("../passport/passport");
const validators = require("../validators/validator");

const passports=require('../passport/passport')
const multer=require('multer')
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './uploads')
    },
    filename: function (req, file, cb) {
        const uniqueSuffix=Date.now()+'_'+Math.round(Math.random()*1E9)
      cb(null, file.originalname+'_'+uniqueSuffix)
    }
  })
  var upload = multer({ storage: storage })


router.post("/register",validators.userCreationValidator,userController.userRegister);
// router.post("/login", passports.authenticate('local'),passport.passportsStatic);
router.post("/login",validators.userCreationValidator,userController.userLogin);
router.get("/get/:id",userController.userInformation);
router.delete("/delete", middleware.Auth, userController.deleteUser);
router.get("/list/:page", userController.userPagination);
router.post("/address", userController.multipleAddress);
router.post("/forgotPassword",userController.generateToken);
router.delete('/deleteAddress',userController.deleteAddress);
router.post('/verify-reset-password/:Password_Access_Token',userController.resetPassword);
router.post('/profile-upload-single', upload.single('profile-file'),userController.uploadImage);
router.post('/uploadImageOnline',userController.uploadImageOnline)

module.exports = router;
