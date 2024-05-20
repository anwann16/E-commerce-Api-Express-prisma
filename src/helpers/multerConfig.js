const path = require("path");
const multer = require("multer");
const { v4: uuid } = require("uuid");

const productStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images/products");
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const uniqueFileName = `product-${file.fieldname}-${uuid()}${ext}`;
    cb(null, uniqueFileName);
  },
});

const avatarStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images/avatars");
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const uniqueFileName = `${file.fieldname}-${uuid()}${ext}`;
    cb(null, uniqueFileName);
  },
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg"
  ) {
    cb(null, true);
  } else {
    cb(new Error("Invalid images type"), false);
  }
};

const uploadProduct = multer({
  storage: productStorage,
  fileFilter,
});
const uploadAvatar = multer({
  storage: avatarStorage,
  fileFilter,
});

module.exports = {
  uploadProduct,
  uploadAvatar,
};
