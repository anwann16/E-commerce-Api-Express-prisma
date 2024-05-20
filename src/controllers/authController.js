const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const prisma = require("../helpers/prismaInstance");

// REGISTER
exports.registerUser = async (req, res) => {
  try {
    const { username, email, password, confirmPassword } = req.body;

    if (!username || !email || !password) {
      return res.status(422).json({
        error: "Fill in all fields",
      });
    }

    const newEmail = email.toLowerCase();
    const newUsername = username.toLowerCase();

    const emailExist = await prisma.user.findUnique({
      where: {
        email: newEmail,
      },
    });

    const userNameExist = await prisma.user.findUnique({
      where: {
        username: newUsername,
      },
    });

    if (emailExist || userNameExist) {
      return res.status(422).json({
        error: "User already exist",
      });
    }

    if (password.length < 6) {
      return res.status(422).json({
        error: "Password must be a 6 characters",
      });
    }

    if (password != confirmPassword) {
      return res.status(422).json({
        error: "Password doesn't match",
      });
    }

    const salt = await bcrypt.genSaltSync(10);
    const hashedPassword = await bcrypt.hashSync(password, salt);
    const newUser = await prisma.user.create({
      data: {
        username,
        email: newEmail,
        credential: {
          create: {
            email,
            password: hashedPassword,
          },
        },
        profile: {
          create: {
            email,
          },
        },
      },
      select: {
        id: true,
        username: true,
        email: true,
        credential: false,
        profile: false,
      },
    });

    res.status(201).json({
      message: "Register Successfully",
      data: newUser,
    });
  } catch (err) {
    throw new Error(err);
  }
};

// LOGIN
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const newEmail = email.toLowerCase();
    const user = await prisma.user.findUnique({
      where: {
        email: newEmail,
      },
      include: {
        credential: true,
      },
    });

    if (!user) {
      return res.status(422).json({
        error: "Invalid Credential",
      });
    }

    const comparePassword = await bcrypt.compareSync(
      password,
      user.credential.password
    );

    if (!comparePassword) {
      return res.status(422).json({
        error: "Invalid Credential",
      });
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.cookie("token", token, { httpOnly: true });

    res.status(200).json({
      message: "Login Success",
      token: token,
    });
  } catch (err) {
    throw new Error(err);
  }
};

// LOGOUT
exports.logoutUser = async (req, res) => {
  res.clearCookie("token");
  res.status(200).json({
    message: "Logout Success",
  });
};

exports.getMyUser = async (req, res) => {
  try {
    const currentUser = await prisma.user.findUnique({
      where: {
        id: req.user.id,
      },
      select: {
        id: true,
        username: true,
        email: true,
        profile: {
          select: {
            avatar: true,
          },
        },
      },
    });

    if (!currentUser) {
      return res.status(404).json({
        error: "User Not Found",
      });
    }

    res.status(200).json({
      id: currentUser.id,
      username: currentUser.username,
      email: currentUser.email,
      avatar: currentUser.profile.avatar,
    });
  } catch (err) {
    throw new Error(err);
  }
};
