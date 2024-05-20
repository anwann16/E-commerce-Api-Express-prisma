const express = require("express");
const {
  registerUser,
  loginUser,
  logoutUser,
  getMyUser,
} = require("../controllers/authController");
const verifyToken = require("../middlewares/verifyToken");

const authRouter = express.Router();

authRouter.post("/auth/register", registerUser);
authRouter.post("/auth/login", loginUser);
authRouter.get("/auth/logout", logoutUser);
authRouter.get("/me", verifyToken, getMyUser);

module.exports = authRouter;
