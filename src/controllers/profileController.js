const fs = require("fs");
const prisma = require("../helpers/prismaInstance");

exports.createOrUpdateProfile = async (req, res) => {
  try {
    const { fullname, email, age } = req.body;

    if (!fullname || !age) {
      return res.status(422).json({
        error: "Please fill all Fields",
      });
    }

    const userData = await prisma.user.findUnique({
      where: {
        id: req.user.id,
      },
    });

    if (!userData) {
      return res.status(404).json({
        error: "User Not Found",
      });
    }

    await prisma.user.update({
      where: {
        id: req.user.id,
      },
      data: {
        email: email || userData.email,
        credential: {
          update: {
            email,
          },
        },
        profile: {
          update: {
            fullname,
            email: email || userData.email,
            age,
          },
        },
      },
    });

    return res.status(201).json({
      message: "Update Profile Success",
    });
  } catch (err) {
    throw new Error(err);
  }
};

// GET PROFILE
exports.getProfile = async (req, res) => {
  try {
    const userProfile = await prisma.user.findUnique({
      where: {
        id: req.user.id,
      },
      select: {
        id: true,
        username: true,
        email: true,
        profile: {
          select: {
            id: true,
            fullname: true,
            age: true,
            avatar: true,
          },
        },
      },
    });

    if (!userProfile) {
      return res.status(404).json({
        error: "User Not Found",
      });
    }

    return res.status(200).json(userProfile);
  } catch (err) {
    throw new Error(err);
  }
};

// UPDATE AVATAR
exports.updateAvatar = async (req, res) => {
  try {
    const avatar = req.file.path;

    const profile = await prisma.user.findUnique({
      where: {
        id: req.user.id,
      },
      include: {
        profile: true,
      },
    });

    if (!profile) {
      return res.status(404).json({
        error: "Profile not found",
      });
    }

    if (profile.profile.avatar) {
      fs.unlink(profile.profile.avatar, (err) => {
        if (err) {
          return res.status(400).json({
            error: "File not found",
          });
        }
      });
    }

    await prisma.user.update({
      where: {
        id: req.user.id,
      },
      data: {
        profile: {
          update: {
            avatar,
          },
        },
      },
    });

    return res.status(200).json({
      message: "Upload avatar success",
    });
  } catch (err) {
    throw new Error(err);
  }
};
