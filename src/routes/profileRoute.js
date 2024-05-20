const express = require("express");
const verifyToken = require("../middlewares/verifyToken");

const {
  createOrUpdateProfile,
  getProfile,
  updateAvatar,
} = require("../controllers/profileController");
const { uploadAvatar } = require("../helpers/multerConfig");

const profileRouter = express.Router();

profileRouter.get("/", verifyToken, getProfile);
profileRouter.put("/", verifyToken, createOrUpdateProfile);
profileRouter.put(
  "/upload",
  verifyToken,
  uploadAvatar.single("avatar"),
  updateAvatar
);

module.exports = profileRouter;
