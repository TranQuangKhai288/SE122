const RecommendingService = require("../services/recommending");

const createRecommendCurriculum = async (req, res) => {
  try {
    const response = await RecommendingService.recommendCurriculum(req.body);
    return res.status(200).json({
      status: "OK",
      message: "Re planing curriculum successfully!",
      data: response,
    });
  } catch (e) {
    console.error("Error creating user:", e);
    console.error("Stack trace:", e.stack);

    return res.status(404).json({
      status: "ERR",
      message: e,
      details: e.message,
    });
  }
};

const suggestCourses = async (req, res) => {
  try {
    const response = await RecommendingService.suggestCoursesForNextSemester(
      req.body.studentId,
      req.body.currentSemester,
      req.body.openCourses,
      req.body.maxCredits
    );
    return res.status(200).json({
      status: "OK",
      message: "Suggest courses successfully!",
      data: response,
    });
  } catch (e) {
    console.error("Error creating user:", e);
    console.error("Stack trace:", e.stack);
    return res.status(404).json({
      status: "ERR",
      message: e,
      details: e.message,
    });
  }
};

module.exports = {
  createRecommendCurriculum,
  suggestCourses,
};
