const express = require("express");
const verifyToken = require("../middlewares/verifyToken");
const {
  addCategory,
  updateCategory,
  getAllCategories,
  deleteCategory,
} = require("../controllers/categoryController");

const categoryRouter = express.Router();

categoryRouter.get("/", getAllCategories);
categoryRouter.post("/add", verifyToken, addCategory);
categoryRouter.put("/edit/:id", verifyToken, updateCategory);
categoryRouter.delete("/:id", verifyToken, deleteCategory);

module.exports = categoryRouter;
