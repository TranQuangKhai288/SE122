const express = require("express");
const router = express.Router();
const recommendingController = require("../controllers/recommending");
const upload = require("../middleware/upload");

router.post("/", recommendingController.createRecommendCurriculum);
router.post("/recommend", upload, recommendingController.suggestCourses);
module.exports = router;
