const Curriculum = require("../models/curriculum");
const Course = require("../models/course");
const xlsx = require("xlsx");

const processCourse = (row, semester) => {
  const courseCode = row["__EMPTY"];
  const courseName = row["__EMPTY_1"];
  const courseCredits = parseInt(row["__EMPTY_2"]) || 0;

  if (courseName && courseName.includes("Các học phần")) {
    // Xử lý học phần tự chọn
    const electiveCourse = {
      code: courseCode,
      name: courseName,
      totalCredits: courseCredits,
      theoryCredits: parseInt(row["__EMPTY_3"]) || 0,
      practiceCredits: parseInt(row["__EMPTY_4"]) || 0,
      isCompulsory: false,
      knowledgeGroup: "Tự chọn",
      type: "Elective",
    };
    semester.courses.push(electiveCourse);
    semester.totalCredits += courseCredits;
  } else if (courseCode && courseName) {
    // Xử lý học phần bình thường
    const course = {
      code: courseCode,
      name: courseName,
      totalCredits: courseCredits,
      theoryCredits: parseInt(row["__EMPTY_3"]) || 0,
      practiceCredits: parseInt(row["__EMPTY_4"]) || 0,
    };
    semester.courses.push(course);
    semester.totalCredits += course.totalCredits;
  }
};
// Hàm phân tích dữ liệu từ sheet
const parseSheetData = (sheetData) => {
  let semesters = [];
  let currentSemester = null;

  sheetData.forEach((row, index) => {
    if (index === 0) return;

    if (row["GIAI ĐOẠN I:"] && row["GIAI ĐOẠN I:"].includes("Học kỳ")) {
      currentSemester = {
        name: row["GIAI ĐOẠN I:"],
        courses: [],
        totalCredits: 0,
      };
      console.log(currentSemester, "currentSemester GD1");
      semesters.push(currentSemester);
      processCourse(row, currentSemester);
    } else if (
      row["GIAI ĐOẠN II:"] &&
      row["GIAI ĐOẠN II:"].includes("Học kỳ")
    ) {
      currentSemester = {
        name: row["GIAI ĐOẠN II:"],
        courses: [],
        totalCredits: 0,
      };
      console.log(currentSemester, "currentSemester GD2");
      semesters.push(currentSemester);

      processCourse(row, currentSemester);
    } else if (currentSemester) {
      processCourse(row, currentSemester);
    }
  });
  return semesters;
};
// Controller để upload file Excel và lưu dữ liệu vào MongoDB
const uploadCurriculum = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Vui lòng tải lên file Excel!" });
    }

    const workbook = xlsx.readFile(req.file.path);
    const sheetName = workbook.SheetNames[0];
    const sheetData = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName], {
      defval: "",
    });

    const semesters = [];
    let totalCredits = 0;

    for (const semesterData of parseSheetData(sheetData)) {
      const semesterCourses = [];
      let semesterTotalCredits = 0;
      for (const courseData of semesterData.courses) {
        if (courseData.type === "Elective") {
          // create a new group course
          const course = await Course.create(courseData);
          console.log(course, "course hereeeeee");
          semesterCourses.push(course._id);
          semesterTotalCredits = semesterTotalCredits + courseData.totalCredits;
        } else {
          let course = await Course.findOne({ code: courseData.code });
          if (!course) {
            // create a new course

            course = await Course.create(courseData);
          }
          semesterCourses.push(course._id);
          semesterTotalCredits += course.totalCredits;
        }
      }
      semesters.push({
        name: semesterData.name,
        courses: semesterCourses,
        totalCredits: semesterTotalCredits,
      });

      totalCredits += semesterTotalCredits;
    }
    const curriculum = await Curriculum.create({
      name: req.body.name,
      semesters,
      totalCredits,
    });

    res.status(200).json({
      message: "Chương trình đào tạo được lưu thành công!",
      data: curriculum,
    });
  } catch (error) {
    res.status(500).json({
      message: "Đã xảy ra lỗi khi lưu chương trình đào tạo.",
      error: error.message,
    });
  }
};

module.exports = {
  uploadCurriculum,
};
