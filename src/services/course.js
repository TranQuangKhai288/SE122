const Course = require("../models/course");
const ExpectedCourse = require("../models/expectedcourse");
const Curriculum = require("../models/curriculum");

const uploadCourses = async (data) => {
  try {
    const promises = data.map(async (course) => {
      try {
        const newCourse = new Course({
          code: course["Mã môn học"],
          name: course["Tên môn học"],
          totalCredits: course["TC"],
          theoryCredits: course["LT"],
          practiceCredits: course["TH"],
          isCompulsory: course["Bắt buộc"],
          knowledgeGroup: course["Nhóm kiến thức"] || "Không xác định",
          orderNumber: parseInt(course["STT"]) || 0,
        });

        // Sử dụng save() thay vì create() để có thể kiểm tra lỗi chi tiết hơn
        await newCourse.save();
        return newCourse;
      } catch (createError) {
        console.error(
          `Error creating course with code ${course["Mã môn học"]}:`,
          createError.message
        );
        return null; // Skip this course and continue with others
      }
    });

    const results = await Promise.all(promises);
    return results.filter((result) => result !== null);
  } catch (error) {
    console.error("General error uploading courses:", error.message);
    throw new Error(error);
  }
};

const uploadExpectedCourses = async (data, semester) => {
  try {
    const promises = data.map(async (course) => {
      try {
        const newCourse = new ExpectedCourse({
          code: course["MÃ MH"],
          name: course["TÊN MÔN HỌC"],
          semester: semester,
        });

        // Sử dụng save() thay vì create() để có thể kiểm tra lỗi chi tiết hơn
        await newCourse.save();
        return newCourse;
      } catch (createError) {
        console.error(
          `Error creating course with code ${course["Mã môn học"]}:`,
          createError.message
        );
        return null; // Skip this course and continue with others
      }
    });

    const results = await Promise.all(promises);
    return results.filter((result) => result !== null);
  } catch (error) {
    console.error("General error uploading courses:", error.message);
    throw new Error(error);
  }
};

// Hàm lấy danh sách các môn học gợi ý
const getSuggestedCourses = async (currentSemester) => {
  try {
    const current_semester = "Học kỳ " + currentSemester; //nhớ có dấu cách ra
    // Lấy danh sách các môn học chưa hoàn thành
    const incompleteCourses = await Course.find({ isCompleted: false });

    // Lấy toàn bộ lộ trình học của trường và các môn mở trong học kỳ này
    const curriculums = await Curriculum.find().populate("semesters.courses");
    const semesterCourses = await ExpectedCourse.find();

    // Giả sử lấy ra một giới hạn tín chỉ từ trường
    const maxCreditsPerSemester = 24; // Giới hạn tín chỉ học trong một kỳ
    let currentCredits = 0; // Tổng tín chỉ gợi ý

    // Biến chứa kết quả gợi ý môn học
    const suggestedCourses = {
      compulsory: [],
      elective: [],
    };
    console.log("Current semester:", current_semester);
    // Lấy lộ trình của trường cho học kỳ hiện tại
    const curriculumForCurrentSemester = curriculums.flatMap((curriculum) => {
      console.log("Curriculum:", curriculum);
      return curriculum.semesters.filter(
        (sem) => sem.name === current_semester
      );
    });

    // Lọc và gợi ý các môn học dựa trên lộ trình và học kỳ hiện tại
    incompleteCourses.forEach((course) => {
      // Kiểm tra xem môn học có được gợi ý trong học kỳ này không
      const isCourseInSemester = semesterCourses.some(
        (semCourse) => semCourse.code === course.code
      );
      // Kiểm tra xem môn học có trong lộ trình học của học kỳ hiện tại không
      const isInCurriculumForCurrentSemester =
        curriculumForCurrentSemester.some((sem) =>
          sem.courses.some((c) => c._id.equals(course._id))
        );

      // Kiểm tra tín chỉ hiện tại có vượt quá giới hạn không và môn có trong học kỳ hiện tại không
      if (
        isCourseInSemester &&
        isInCurriculumForCurrentSemester &&
        currentCredits + course.totalCredits <= maxCreditsPerSemester
      ) {
        if (course.isCompulsory) {
          suggestedCourses.compulsory.push(course);
        } else {
          suggestedCourses.elective.push(course);
        }
        currentCredits += course.totalCredits;
      }
    });

    // Trả về kết quả gợi ý cùng với thông tin về các môn học
    return {
      incompleteCourses: {
        list: incompleteCourses,
        length: incompleteCourses.length,
      },
      curriculums: {
        list: curriculums,
        length: curriculums.length,
      },
      semesterCourses: {
        list: semesterCourses,
        length: semesterCourses.length,
      },
      // Lộ trình học của nhà trường đề xuất:
      curriculumForCurrentSemester: curriculumForCurrentSemester,
      suggestedCourses: suggestedCourses,
      totalSuggestedCredits: currentCredits, // Tín chỉ gợi ý
    };
  } catch (error) {
    console.error("Error getting suggested courses:", error);
    throw error;
  }
};

module.exports = { uploadCourses, uploadExpectedCourses, getSuggestedCourses };
