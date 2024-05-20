const jwt = require("jsonwebtoken");
const prisma = require("../helpers/prismaInstance");

const verifyToken = async (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({
        error: "Invalid Token",
      });
    }

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

    const user = await prisma.user.findUnique({
      where: {
        id: decodedToken.id,
      },
    });

    if (!user) {
      return res.status(401).json({
        error: "You must login to access this content",
      });
    }

    req.user = user;

    next();
  } catch (err) {
    return res.status(401).json({
      error: "Token expired",
    });
  }
};

module.exports = verifyToken;
