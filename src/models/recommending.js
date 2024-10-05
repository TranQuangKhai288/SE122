const mongoose = require("mongoose");

const semesterSchema = new mongoose.Schema(
  {
    name: String,
    courses: [{ type: mongoose.Schema.Types.ObjectId, ref: "Course" }],
    totalCredits: Number,
  },
  { _id: false }
);

const recommendCurriculumSchema = new mongoose.Schema({
  name: String,
  semesters: [semesterSchema],
  totalCredits: Number,
});

const RecommendCurriculum = mongoose.model(
  "RecommendCurriculum",
  recommendCurriculumSchema
);
module.exports = RecommendCurriculum;
