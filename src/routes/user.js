const express = require("express");
const router = express.Router();
const userController = require("../controllers/user");

const {
  authUserMiddleWare,
  authAdminMiddleWare,
} = require("../middleware/auth");



router.post("/login", userController.loginUser);

router.post("/register", userController.createUser);

router.get("/get", authUserMiddleWare, userController.getDetailsUser);

router.post("/refresh", userController.refreshToken);


module.exports = router;
