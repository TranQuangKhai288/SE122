const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
  name: { type: String },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  isAdmin: { type: Boolean, default: false, required: true },
  phone: { type: Number, default: 0 },
  avatar: { type: String, default: "" },
});
const User = mongoose.model("User", userSchema);
module.exports = User;
