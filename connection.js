const mongoose = require("mongoose");
require('dotenv').config();
console.log(process.env.MONGO_URL);


main()
  .then(() => {})
  .catch((err) => console.log(err));
async function main() {
  let connection = await mongoose.connect(process.env.MONGO_URL);
  if (connection) {
    console.log("sucess");
  }
}
module.exports = main;
