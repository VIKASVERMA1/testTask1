const mongoose = require("mongoose");


main()
  .then(() => {})
  .catch((err) => console.log(err));
async function main() {
  let connection = await mongoose.connect("mongodb+srv://vikas:vikas123@cluster0.upfxd.mongodb.net/?retryWrites=true&w=majority");
  if (connection) {
    console.log("sucess");
  }
}
module.exports = main;




















// var myobj = 
//     // { firstName:'sonakshi',lastName:'kumari',email:'sonakshi@gmail.com',password:md5('1234')}
//     // { firstName:'sonakshi',lastName:'kumari',email:'sonakshi@gmail.com',password:md5('678')}
//     // { firstName:'sonakshi',lastName:'kumari',email:'sonakshi@gmail.com',password:md5('4567')}
//     // { firstName:'sonakshi',lastName:'kumari',email:'sonakshi@gmail.com',password:md5('9874')}
//     { firstName:'sonakshi',lastName:'kumari',email:'sonakshi@gmail.com',password:md5('7896')}
//   ;

//   userSchema.deleteMany(myobj, function(err, res) {
//     if (err) throw err;
//     console.log("Number of documents inserted: " + res.insertedCount);
    
//   });