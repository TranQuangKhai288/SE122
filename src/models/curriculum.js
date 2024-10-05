const mongoose = require("mongoose");

const semesterSchema = new mongoose.Schema(
  {
    name: String,
    courses: [{ type: mongoose.Schema.Types.ObjectId, ref: "Course" }],
    totalCredits: Number,
  },
  { _id: false }
);

const curriculumSchema = new mongoose.Schema({
  name: String,
  semesters: [semesterSchema],
  totalCredits: Number,
});

const Curriculum = mongoose.model("Curriculum", curriculumSchema);
module.exports = Curriculum;
