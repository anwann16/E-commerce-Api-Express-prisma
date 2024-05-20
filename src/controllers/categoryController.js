const prisma = require("../helpers/prismaInstance");

// ADD CATEGORY
exports.addCategory = async (req, res) => {
  try {
    const { name } = req.body;

    const category = await prisma.category.findUnique({
      where: {
        name,
      },
    });

    if (!name) {
      return res.status(422).json({
        error: "Field is required",
      });
    }

    if (category) {
      return res.status(422).json({
        error: "Category already exist",
      });
    }

    const newCategory = await prisma.category.create({
      data: { name },
    });

    return res.status(201).json({
      message: "Category successfully added",
      data: newCategory,
    });
  } catch (err) {
    throw new Error(err);
  }
};

// UPDATE CATEGORY
exports.updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    const category = await prisma.category.findUnique({
      where: { id },
    });

    if (!name) {
      return res.status(422).json({
        error: "Field is required",
      });
    }

    if (!category) {
      return res.status(404).json({
        error: "Category Not Found",
      });
    }

    await prisma.category.update({
      where: { id },
      data: { name },
    });

    return res.status(200).json({
      message: "Category successfully updated",
    });
  } catch (err) {
    throw new Error(err);
  }
};

// GET ALL CATEGORY
exports.getAllCategories = async (req, res) => {
  try {
    const categories = await prisma.category.findMany();

    return res.status(200).json({
      message: "Get all categories success",
      data: categories,
    });
  } catch (err) {
    throw new Error(err);
  }
};

// DELETE CATEGORY
exports.deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const category = await prisma.category.findUnique({
      where: { id },
    });

    if (!category) {
      return res.status(404).json({
        error: "Category Not Found",
      });
    }

    await prisma.category.delete({
      where: { id },
    });

    return res.status(200).json({
      message: "Category successfully deleted",
    });
  } catch (err) {
    throw new Error(err);
  }
};
