import { Router } from "express";
import { addUserRegisterController } from "../controllers/users.controllers.js";

const router = Router();

router.route("/register").post(addUserRegisterController);

// router.get("/auth/refresh", (req, res) => {
//   const refreshToken = req.cookies.refreshToken;
//   if (!refreshToken) return res.status(401).send("Unauthorized");

//   try {
//     const user = verifyRefreshToken(refreshToken); // Verify refresh token
//     const newAccessToken = createAccessToken(user); // Issue new access token
//     res.json({ accessToken: newAccessToken });
//   } catch (err) {
//     res.status(403).send("Forbidden");
//   }
// });

router.post("/auth/logout", (req, res) => {
  res.clearCookie("refreshToken");
  res.send("Logged out");
});

const authenticateToken = (req, res) => {};

router.get("/auth/me", authenticateToken, (req, res) => {
  res.json({ user: req.user });
});

export default router;
