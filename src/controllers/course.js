const XLSX = require("xlsx");
const CourseService = require("../services/course");

const uploadCourse = async (req, res) => {
  try {
    const filePath = req.file.path;
    const workbook = XLSX.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];

    // Định nghĩa tên cột cho dữ liệu
    const headers = [
      "STT",
      "Mã môn học",
      "Tên môn học",
      "TC",
      "LT",
      "TH",
      "Nhóm kiến thức",
      "Bắt buộc",
    ];

    // Đọc dữ liệu với header được định nghĩa
    const data = XLSX.utils.sheet_to_json(worksheet, {
      header: headers,
      range: 1,
      defval: "",
    });

    // Làm sạch và kiểm tra tính hợp lệ của dữ liệu
    const validData = data
      .filter((row) => {
        return (
          row["Mã môn học"] &&
          row["Mã môn học"] !== "Mã môn học" &&
          row["Tên môn học"] &&
          row["Tên môn học"] !== "Tên môn học" &&
          !isNaN(parseInt(row["TC"]))
        );
      })
      .map((row) => ({
        ...row,
        TC: parseInt(row["TC"]) || 0,
        LT: parseInt(row["LT"]) || 0,
        TH: parseInt(row["TH"]) || 0,
        "Bắt buộc": row["Bắt buộc"] === true,
      }));

    const response = await CourseService.uploadCourses(validData);

    return res.status(200).json({
      status: "OK",
      message: "Courses uploaded successfully!",
      data: {
        totalUploaded: response.length,
        courses: response,
      },
    });
  } catch (error) {
    console.error("Error uploading courses:", error);
    return res.status(500).json({
      status: "ERR",
      message: "Failed to upload courses",
      details: error.message,
    });
  }
};

const uploadExpectedCourse = async (req, res) => {
  try {
    const filePath = req.file.path;
    const workbook = XLSX.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];

    // Định nghĩa tên cột cho dữ liệu
    const headers = ["STT", "MÃ MH", "TÊN MÔN HỌC"];

    // Đọc dữ liệu với header được định nghĩa
    const data = XLSX.utils.sheet_to_json(worksheet, {
      header: headers,
      range: 1,
      defval: "",
    });

    // Làm sạch và kiểm tra tính hợp lệ của dữ liệu
    const validData = data.filter((row) => {
      return row["MÃ MH"] && row["TÊN MÔN HỌC"];
    });

    console.log("Valid data:", validData);
    const response = await CourseService.uploadExpectedCourses(
      validData,
      req.body.semester
    );

    return res.status(200).json({
      status: "OK",
      message: "Expected courses uploaded successfully!",
      // data: {
      //   totalUploaded: response.length,
      //   courses: response,
      // },
    });
  } catch (error) {
    console.error("Error uploading expected courses:", error);
    return res.status(500).json({
      status: "ERR",
      message: "Failed to upload expected courses",
      details: error.message,
    });
  }
};

const suggestCourse = async (req, res) => {
  const {
    // studentId,
    // expectedCourses,
    currentSemester,
  } = req.body; // semesterCourses là danh sách các môn sẽ mở trong học kỳ này

  try {
    const suggestedCourses = await CourseService.getSuggestedCourses(
      // studentId,
      // expectedCourses
      currentSemester
    );
    res.json(suggestedCourses);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  uploadCourse,
  uploadExpectedCourse,
  suggestCourse,
};
