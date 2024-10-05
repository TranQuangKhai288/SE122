const mongoose = require("mongoose");

const expectedCourseSchema = new mongoose.Schema({
  code: { type: String, required: true },
  name: { type: String, required: true },
  semester: { type: Number, required: true },
});

const ExpectedCourse = mongoose.model("ExpectedCourse", expectedCourseSchema);
module.exports = ExpectedCourse;
