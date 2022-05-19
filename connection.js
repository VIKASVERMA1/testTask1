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



















