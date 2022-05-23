const mongoose = require("mongoose");

const acessSchema = mongoose.Schema({
  user_id: {
    type: String,
    require: true,
  },
  access_token: {
    type: String,
    require: true,
  },
  expire_at: { type: Date, default: Date.now, expires: 3600 },
});
module.exports = access_Token = mongoose.model("access_token", acessSchema);
