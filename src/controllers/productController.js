const fs = require("fs");
const prisma = require("../helpers/prismaInstance");

// ADD PRODUCT
exports.addProduct = async (req, res) => {
  try {
    const { name, description, price, category_id, stock } = req.body;
    const image = req.file.path;

    if (!name || !price || !category_id || !stock || !image) {
      return res.status(422).json({
        error: "Please fill all fields",
      });
    }

    const newImage = image.replace("images", "");

    const newProduct = await prisma.product.create({
      data: {
        name,
        description,
        price: parseFloat(price),
        category_id,
        stock: parseInt(stock),
        image: newImage,
      },
    });

    return res.status(201).json({
      message: "Product successfully created!",
      data: newProduct,
    });
  } catch (err) {
    throw new Error(err);
  }
};

// DELETE PRODUCT
exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await prisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      return res.status(404).json({
        error: "Product not found",
      });
    }

    const imageProduct = `images${product.image}`;

    fs.unlink(imageProduct, (err) => {
      if (err) {
        res.status(400);
        throw new Error(err);
      }
    });

    await prisma.product.delete({
      where: { id },
    });

    return res.status(200).json({
      message: "Product successfully deleted",
    });
  } catch (err) {
    throw new Error(err);
  }
};

// GET ALL PRODUCTS
exports.getAllProducts = async (req, res) => {
  try {
    const page = req.query.page ? parseInt(req.query.page) : 1;
    const perPage = 5;
    const skip = (page - 1) * perPage;
    const querySearch = req.query.search || "";

    const products = await prisma.product.findMany({
      skip: skip,
      take: perPage,
      where: {
        name: {
          contains: querySearch,
          mode: "insensitive",
        },
      },
      select: {
        id: true,
        name: true,
        description: true,
        price: true,
        stock: true,
        image: true,
        category: {
          include: true,
        },
      },
    });

    const totalItems = await prisma.product.count({
      where: {
        name: {
          contains: querySearch,
          mode: "insensitive",
        },
      },
    });
    const totalPages = Math.ceil(totalItems / perPage);

    return res.status(200).json({
      message: "Successfully get all products",
      page,
      perPage,
      totalPages,
      totalItems,
      data: products,
    });
  } catch (err) {
    throw new Error(err);
  }
};

// GET DETAIL PRODUCT
exports.getProductDetail = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
      },
    });

    if (!product) {
      return res.status(404).json({
        error: "Product not found",
      });
    }

    return res.status(200).json({
      message: "Successfully get detail product",
      data: product,
    });
  } catch (err) {
    throw new Error(err);
  }
};

// UPDATE PRODUCT
exports.updateProduct = async (req, res) => {
  try {
    const { name, description, price, category_id, stock } = req.body;
    const { id } = req.params;
    const image = req.file.path;

    const newImage = image.replace("images", "");

    const product = await prisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    const imageToDelete = `images${product.image}`;

    if (product.image) {
      fs.unlink(imageToDelete, (err) => {
        if (err) {
          return res.status(422).json({
            error: "Please input image",
          });
        }
      });
    }

    await prisma.product.update({
      where: { id },
      data: {
        name: name || product.name,
        description: description || product.description,
        price: parseFloat(price) || product.price,
        category_id: category_id || product.category_id,
        stock: parseInt(stock) || product.stock,
        image: newImage || product.image,
      },
    });

    return res.status(200).json({
      message: "Product successfully updated!",
    });
  } catch (err) {
    throw new Error(err);
  }
};
