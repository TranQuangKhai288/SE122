const Course = require("../models/course");
const Curriculum = require("../models/curriculum");

const recommendCurriculum = async () => {
  try {
    // Lấy tất cả các khóa học chưa hoàn thành
    console.log("get unfinishedCourses");
    const unfinishedCourses = await Course.find({ isCompleted: false });
    console.log("get allCurriculums");
    // Lấy toàn bộ các kế hoạch giảng dạy
    const allCurriculums = await Curriculum.find();
    console.log("get allCurriculums and filter course");
    // Tìm lộ trình từ nhà trường (curriculum) và lọc ra các khóa học chưa học
    const recommendedPlan = allCurriculums.map((curriculum) => {
      const newSemesters = curriculum.semesters.map((semester) => {
        const filteredCourses = semester.courses.filter((course) =>
          unfinishedCourses.some((unCourse) => unCourse._id.equals(course))
        );

        return {
          name: semester.name,
          courses: filteredCourses,
        };
      });

      return {
        curriculumName: curriculum.name,
        semesters: newSemesters,
      };
    });

    return recommendedPlan;
  } catch (e) {
    return {
      status: "ERR",
      message: e.message,
    };
  }
};

const suggestCoursesForNextSemester = async (
  studentId,
  currentSemester,
  openCourses,
  maxCredits
) => {
  try {
    // const previousProgress = await StudentProgress.find({
    //   studentId,
    //   semester: { $lt: currentSemester },
    // });

    // // Lấy danh sách các môn đã rớt hoặc chưa học
    let failedCourses = [];
    let pendingCourses = [];

    // previousProgress.forEach((progress) => {
    //   failedCourses = failedCourses.concat(progress.failedCourses);
    //   pendingCourses = pendingCourses.concat(progress.pendingCourses);
    // });

    // Bắt đầu gợi ý các môn dựa trên một số yếu tố bổ sung
    let suggestedCourses = [];

    // Bước 1: Ưu tiên các môn đã rớt và có thể mở lớp trong kỳ này
    suggestedCourses = openCourses.filter(
      (course) =>
        failedCourses.includes(course.id) &&
        course.semesterAvailable.includes(currentSemester) // môn học mở lớp kỳ này
    );

    // Bước 2: Gợi ý các môn tiên quyết nếu sinh viên đã rớt môn liên quan
    openCourses.forEach((course) => {
      if (
        pendingCourses.includes(course.prerequisite) &&
        course.semesterAvailable.includes(currentSemester)
      ) {
        suggestedCourses.push(course);
      }
    });

    // Bước 3: Xem xét độ khó của các môn và sắp xếp theo độ ưu tiên
    suggestedCourses.sort((a, b) => a.difficulty - b.difficulty); // Gợi ý từ dễ đến khó

    // Bước 4: Kiểm tra số tín chỉ tối đa mà sinh viên có thể học trong kỳ này
    let totalCredits = 0;
    let finalSuggestions = [];

    suggestedCourses.forEach((course) => {
      if (totalCredits + course.credits <= maxCredits) {
        finalSuggestions.push(course);
        totalCredits += course.credits;
      }
    });

    return finalSuggestions;
  } catch (error) {
    console.error("Error suggesting courses for next semester:", error.message);
    throw error;
  }
};

module.exports = {
  recommendCurriculum,
  suggestCoursesForNextSemester,
};
