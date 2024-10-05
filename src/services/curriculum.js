const Course = require("../models/course");
const Curriculum = require("../models/curriculum");

const createOrUpdateCourse = async (courseData) => {
  try {
    let course = await Course.findOne({ code: courseData.code });
    if (course) {
      Object.assign(course, courseData);
      await course.save();
    } else {
      course = new Course(courseData);
      await course.save();
    }
    return course; // Đảm bảo trả về course bao gồm cả _id
  } catch (error) {
    console.error("Error creating/updating course:", error.message);
    throw error;
  }
};

const createOrUpdateCurriculum = async (curriculumData) => {
  try {
    let curriculum = await Curriculum.findOne({ name: curriculumData.name });
    if (curriculum) {
      Object.assign(curriculum, curriculumData);
      await curriculum.save();
    } else {
      curriculum = new Curriculum(curriculumData);
      await curriculum.save();
    }
    return curriculum;
  } catch (error) {
    console.error("Error creating/updating curriculum:", error.message);
    throw error;
  }
};

module.exports = {
  createOrUpdateCourse,
  createOrUpdateCurriculum,
};
