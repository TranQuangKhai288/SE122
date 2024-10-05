const UserRouter = require("./user");
const CourseRouter = require("./course");
const CurriculumRouter = require("./curriculum");
const RecommendingRouter = require("./recommending");
const routes = (app) => {
  app.use("/user", UserRouter);
  app.use("/course", CourseRouter);
  app.use("/curriculum", CurriculumRouter);
  app.use("/recommending", RecommendingRouter);
};

module.exports = routes;
