const express = require("express");
const router = express.Router();
const curriculumController = require("../controllers/curriculum");

const upload = require("../middleware/upload");

router.post("/upload", upload, curriculumController.uploadCurriculum);

module.exports = router;
