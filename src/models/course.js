const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema({
  code: { type: String, required: true },
  name: { type: String, required: true },
  totalCredits: { type: Number, required: true },
  theoryCredits: { type: Number, default: 0 },
  practiceCredits: { type: Number, default: 0 },
  isCompulsory: { type: Boolean, default: true },
  knowledgeGroup: { type: String, required: true, default: "Chưa phân loại" },
  subGroup: { type: String },
  isCompleted: { type: Boolean, default: false },
  // orderNumber: { type: Number },
});

const Course = mongoose.model("Course", courseSchema);
module.exports = Course;
