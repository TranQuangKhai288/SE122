const mongoose = require("mongoose");
//Model này sẽ lưu trữ thông tin lộ trình học tập của từng sinh viên cho mỗi học kỳ, dựa trên kết quả của các kỳ trước.
const studyPlanSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  }, // Tham chiếu đến sinh viên
  semester: { type: Number, required: true }, // Học kỳ
  courses: [{ type: mongoose.Schema.Types.ObjectId, ref: "Course" }], // Danh sách môn học gợi ý
  createdAt: { type: Date, default: Date.now }, // Thời gian tạo lộ trình
});

const StudyPlan = mongoose.model("StudyPlan", studyPlanSchema);
module.exports = StudyPlan;
