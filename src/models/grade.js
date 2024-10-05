const mongoose = require("mongoose");
//Kết quả học tập lưu trữ thông tin kết quả của sinh viên theo từng môn học sau mỗi học kỳ.
const gradeSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  }, // Tham chiếu đến sinh viên
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
    required: true,
  }, // Tham chiếu đến môn học
  semester: { type: Number, required: true }, // Học kỳ (VD: 1, 2, 3,...)
  grade: { type: Number, required: true }, // Điểm số đạt được
  status: {
    type: String,
    enum: ["passed", "failed", "not_enrolled"],
    required: true,
  }, // Trạng thái: Đậu, rớt, chưa đăng ký
});

const Grade = mongoose.model("Grade", gradeSchema);
module.exports = Grade;
