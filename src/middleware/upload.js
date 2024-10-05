const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Định nghĩa thư mục lưu file
const uploadDir = path.join(__dirname, "uploads");

// Kiểm tra và tạo thư mục uploads nếu chưa tồn tại
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Định nghĩa nơi lưu file và đặt tên file
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir); // Thư mục uploads để lưu file
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname)
    );
  },
});

// Filter file chỉ nhận file excel
const fileFilter = (req, file, cb) => {
  console.log("file here:", file);
  const fileTypes = /xlsx|xls/;
  const mimeTypes = [
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "application/vnd.ms-excel",
  ];
  const extName = fileTypes.test(path.extname(file.originalname).toLowerCase());
  const mimeType = mimeTypes.includes(file.mimetype);
  console.log("extName:", extName);
  console.log("mimeType:", mimeType);

  // Kiểm tra loại file
  if (extName && mimeType) {
    return cb(null, true);
  } else {
    return cb(new Error("Only Excel files are allowed!"));
  }
};

// Khởi tạo multer với cấu hình đã định nghĩa
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 1024 * 1024 * 5 }, // Giới hạn dung lượng file
}).single("file"); // "file" là tên field trong form

// Xuất module upload
module.exports = upload;
