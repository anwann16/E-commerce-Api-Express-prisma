const express = require("express");
const verifyToken = require("../middlewares/verifyToken");
const { uploadProduct } = require("../helpers/multerConfig");
const {
  addProduct,
  deleteProduct,
  getAllProducts,
  getProductDetail,
  updateProduct,
} = require("../controllers/productController");

const productRouter = express.Router();

productRouter.get("/products", getAllProducts);
productRouter.get("/product/:id", verifyToken, getProductDetail);
productRouter.delete("/product/:id", verifyToken, deleteProduct);
productRouter.put(
  "/product/:id",
  verifyToken,
  uploadProduct.single("image"),
  updateProduct
);
productRouter.post(
  "/product",
  verifyToken,
  uploadProduct.single("image"),
  addProduct
);

module.exports = productRouter;
