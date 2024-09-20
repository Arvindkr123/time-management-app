/* eslint-disable no-unused-vars */
import { Router } from "express";
import {
  addUserLoginController,
  addUserRegisterController,
} from "../controllers/users.controllers.js";
import { JWT_SECRET } from "../config/config.js";
import jwt from "jsonwebtoken";

const router = Router();

router.post("/register", addUserRegisterController);
router.post("/login", addUserLoginController);

// Function to create an access token
const createAccessToken = (user) => {
  return jwt.sign({ userId: user._id, email: user.email }, JWT_SECRET, {
    expiresIn: "1h", // Token expires in 1 hour
  });
};

// Function to verify refresh token
const verifyRefreshToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    throw new Error("Invalid refresh token");
  }
};

// Refresh token route
router.get("/refresh", (req, res) => {
  const refreshToken = req.cookies?.refreshToken;

  if (!refreshToken) {
    return res.status(401).json({ message: "Unauthorized, no refresh token" });
  }

  try {
    const user = verifyRefreshToken(refreshToken); // Verify the refresh token
    const newAccessToken = createAccessToken(user); // Issue new access token
    res.json({ accessToken: newAccessToken });
  } catch (err) {
    res.status(403).json({ message: "Forbidden, invalid refresh token" });
  }
});

// Logout route to clear refresh token
router.post("/logout", (req, res) => {
  res.clearCookie("refreshToken");
  res.json({ message: "Logged out successfully" });
});

// Middleware to authenticate access token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // Get the token from the Bearer header

  if (!token)
    return res.status(401).json({ message: "Unauthorized, token missing" });

  try {
    const user = jwt.verify(token, JWT_SECRET); // Verify the token
    req.user = user; // Attach user to the request object
    next(); // Proceed to the next middleware or route
  } catch (error) {
    return res.status(403).json({ message: "Forbidden, invalid token" });
  }
};

// Route to get authenticated user's info
router.get("/me", authenticateToken, (req, res) => {
  res.json({ user: req.user });
});

export default router;
