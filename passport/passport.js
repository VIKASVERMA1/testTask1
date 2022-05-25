// const localStrategy = require("passport-local").Strategy;
// const secret = require("../config");
// const Users = require("../models/userSchema");
// const passport = require("passport");


// var passports=passport.use(new localStrategy(function (userName, password, done) {
//     console.log(userName);
//     console.log(password);
//       console.log(userName, password);
//       Users.findOne({ userName: userName }, function (err, user) {
//         if (err) {
//           return done(err);
//         }
//         if (!user) {
//           return done(null, false, { message: "Incorrect User Name" });
//         }
//         if (!Users.password == password) {
//           return done(null, false, { message: "Incorrect Password" });
//         }
//         return done(null, user);
//       });
//     })
//   );


// passport.serializeUser(function(user, done) {
//     if(user){
//         return done(null,user._id)
//     }
//     return done(null,false)
//       });
      
//       passport.deserializeUser(function(id, done) {
//         Users.findById(id,(err,user)=>{
//             if(err) return done(null,false);
//             return done(null,user)
//         })
//       });

//       module.exports=passports