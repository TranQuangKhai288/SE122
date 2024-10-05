const mongoose = require("mongoose");
//Để điều chỉnh số lượng tín chỉ tối đa mà sinh viên có thể đăng ký trong mỗi học kỳ hoặc các cài đặt khác, bạn có thể có một model riêng cho các cài đặt này.
const settingsSchema = new mongoose.Schema({
  maxCreditsPerSemester: { type: Number, default: 24 }, // Số tín chỉ tối đa mỗi kỳ
  minCreditsPerSemester: { type: Number, default: 12 }, // Số tín chỉ tối thiểu mỗi kỳ
});

const Settings = mongoose.model("Settings", settingsSchema);
module.exports = Settings;
