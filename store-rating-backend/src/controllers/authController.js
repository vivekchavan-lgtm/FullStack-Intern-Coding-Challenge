const bcrypt = require("bcryptjs");
const userService = require("../services/userService");

const register = async (req, res) => {
  try {

    const {
      name,
      email,
      password,
      address
    } = req.body;

    const existingUser =
      await userService.findUserByEmail(email);

    if (existingUser) {
      return res.status(400).json({
        message: "Email already exists"
      });
    }

    const hashedPassword =
      await bcrypt.hash(password, 10);

    const user =
      await userService.createUser(
        name,
        email,
        hashedPassword,
        address,
        "USER"
      );

    res.status(201).json({
      message: "User Registered",
      user
    });

  } catch (err) {
    res.status(500).json({
      message: err.message
    });
  }
};

module.exports = {
  register
};

const jwt = require("jsonwebtoken");

const login = async (req, res) => {

  try {

    const { email, password } = req.body;

    const user =
      await userService.findUserByEmail(email);

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    const isMatch =
      await bcrypt.compare(
        password,
        user.password
      );

    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid Credentials"
      });
    }

    const token = jwt.sign(
      {
        id: user.id,
        role: user.role
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d"
      }
    );

    res.json({
      token,
      role: user.role,
      userId: user.id
    });

  } catch (err) {

    res.status(500).json({
      message: err.message
    });

  }
};

module.exports = {
  register,
  login
};