const path = require("path");
const cors = require("cors");
const express = require("express");
const cookieParser = require("cookie-parser");

require("dotenv").config();

const app = express();

const authRouter = require("./src/routes/authRoute");
const profileRouter = require("./src/routes/profileRoute");
const categoryRouter = require("./src/routes/categoryRoute");
const productRouter = require("./src/routes/productRoute");
const transactionRouter = require("./src/routes/transactionRoute");

app.use(
  express.static("images", express.static(path.join(__dirname + "/products")))
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const options = {
  credentials: true,
  origin: "http://localhost:5173",
};
app.use(cors(options));

app.use("/api", authRouter);
app.use("/api/profile", profileRouter);
app.use("/api/category", categoryRouter);
app.use("/api", productRouter);
app.use("/api", transactionRouter);

app.listen(process.env.PORT, () => {
  console.log("App running in port ", process.env.PORT);
});
