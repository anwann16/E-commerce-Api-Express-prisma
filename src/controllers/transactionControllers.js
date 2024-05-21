const prisma = require("../helpers/prismaInstance");

// CREATE TRANSACTION
exports.createTransaction = async (req, res) => {
  try {
    const { transaction_details: products } = req.body;
    const userId = req.user.id;

    const checkStock = await Promise.all(
      products.map(async (product) => {
        const productInfo = await prisma.product.findUnique({
          where: { id: product.product_id },
          select: { stock: true },
        });
        return productInfo.stock - product.quantity < 0;
      })
    );

    if (checkStock.some((stock) => stock)) {
      return res.status(400).json({
        message: "Stock product is empty",
      });
    }

    const transaction = await prisma.$transaction(async (prisma) => {
      let totalHarga = 0;

      const createdTransaction = await prisma.transaction.create({
        data: {
          user: {
            connect: {
              id: userId,
            },
          },
          transaction_details: {
            createMany: {
              data: await Promise.all(
                products.map(async (product) => {
                  const productInfo = await prisma.product.findUnique({
                    where: { id: product.product_id },
                    select: { price: true },
                  });

                  totalHarga += productInfo.price * product.quantity;

                  return {
                    product_id: product.product_id,
                    quantity: product.quantity,
                    price: productInfo.price,
                  };
                })
              ),
            },
          },
          total_amount: totalHarga,
        },
        include: {
          user: true,
          transaction_details: true,
        },
      });

      for (const product of products) {
        await prisma.product.update({
          where: {
            id: product.product_id,
          },
          data: {
            stock: {
              decrement: product.quantity,
            },
          },
        });
      }

      return createdTransaction;
    });

    return res.status(201).json({
      message: "Transaction succesfully created!",
      data: transaction,
    });
  } catch (err) {
    throw new Error(err);
  }
};

// GET ALL TRANSACTION
exports.getAllTransactions = async (req, res) => {
  try {
    const transactions = await prisma.transaction.findMany({
      select: {
        id: true,
        transaction_date: true,
        total_amount: true,
        user: {
          select: {
            id: true,
            username: true,
            email: true,
          },
        },
        transaction_details: {
          select: {
            id: true,
            product: {
              select: {
                id: true,
                name: true,
                description: true,
                price: true,
                category: {
                  include: true,
                },
                stock: true,
                image: true,
              },
            },
            quantity: true,
            price: true,
          },
        },
      },
    });

    return res.status(200).json({
      message: "Get all transactions successfully",
      data: transactions,
    });
  } catch (err) {
    throw new Error(err);
  }
};

exports.getTransactionByUser = async (req, res) => {
  try {
    const transactionHistory = await prisma.user.findUnique({
      where: {
        id: req.user.id,
      },
      select: {
        transactions: {
          orderBy: {
            transaction_date: "desc",
          },
          select: {
            id: true,
            transaction_date: true,
            total_amount: true,
            transaction_details: {
              select: {
                id: true,
                price: true,
                quantity: true,
                product: {
                  include: true,
                },
              },
            },
          },
        },
      },
    });

    if (!transactionHistory) {
      return res.status(404).json({
        message: "No Transaction Found",
      });
    }

    return res.status(200).json({
      message: "Successfully get transaction history",
      data: transactionHistory,
    });
  } catch (err) {
    throw new Error(err);
  }
};
