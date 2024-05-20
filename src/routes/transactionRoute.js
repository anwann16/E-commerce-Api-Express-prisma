const express = require("express");
const verifyToken = require("../middlewares/verifyToken");
const {
  createTransaction,
  getAllTransactions,
  getTransactionByUser,
} = require("../controllers/transactionControllers");

const transactionRouter = express.Router();

transactionRouter.get("/transactions", verifyToken, getAllTransactions);
transactionRouter.get(
  "/transaction-history",
  verifyToken,
  getTransactionByUser
);
transactionRouter.post("/transaction", verifyToken, createTransaction);

module.exports = transactionRouter;
