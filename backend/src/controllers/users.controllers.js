/* eslint-disable no-unused-vars */
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import UserModel from "../models/users.models.js";
import { JWT_SECRET } from "../config/config.js";

// Register controller
export const addUserRegisterController = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required!" });
    }

    const existedUser = await UserModel.findOne({ email });

    if (existedUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists, please login!",
      });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = new UserModel({ name, email, password: hashedPassword });
    await newUser.save();

    // Generate a JWT token
    const accessToken = jwt.sign(
      { userId: newUser._id, email: newUser.email },
      JWT_SECRET,
      {
        expiresIn: "1h", // Token will expire in 1 hour
      }
    );
    const refreshToken = jwt.sign(
      { userId: newUser._id, email: newUser.email },
      JWT_SECRET,
      {
        expiresIn: "7d", // Token will expire in 7 days
      }
    );

    // Store refresh token in HttpOnly cookie
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "Strict",
    });

    // Send access token to the client
    res.json({ accessToken });
  } catch (err) {
    res.status(500).json({ success: false, message: "Something went wrong" });
  }
};

// Login controller
export const addUserLoginController = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required!" });
    }

    // Find user by email
    const user = await UserModel.findOne({ email });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User does not exist, please register!",
      });
    }

    // Check if password is correct
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(400).json({
        success: false,
        message: "Invalid email or password!",
      });
    }

    // Generate a JWT token
    const accessToken = jwt.sign(
      { userId: user._id, email: user.email },
      JWT_SECRET,
      {
        expiresIn: "1h", // Token will expire in 1 hour
      }
    );
    const refreshToken = jwt.sign(
      { userId: user._id, email: user.email },
      JWT_SECRET,
      {
        expiresIn: "7d", // Token will expire in 7 days
      }
    );

    // Store refresh token in HttpOnly cookie
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "Strict",
    });

    // Send access token to the client
    res.json({ accessToken });
  } catch (err) {
    res.status(500).json({ success: false, message: "Something went wrong" });
  }
};
