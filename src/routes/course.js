const express = require("express");
const router = express.Router();
const courseController = require("../controllers/course");

const upload = require("../middleware/upload");

router.post("/upload", upload, courseController.uploadCourse);

router.post("/upload-expected", upload, courseController.uploadExpectedCourse);

router.post("/suggest", courseController.suggestCourse);

module.exports = router;
