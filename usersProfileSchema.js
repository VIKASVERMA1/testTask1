const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  user_id: {
    type: String,
  },
  dob: {
    type: String,
  },
  Mobile_no: {
    type: Number,
  }
});
module.exports =UserProfile= mongoose.model('UserProfile', userSchema);
