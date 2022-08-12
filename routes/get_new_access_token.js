const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const { generateAccessToken } = require("../src/middleware/auth_token");
const UserLoginModal = require("../src/database/modals/user_auth");
dotenv.config();

require("../src/database/connection");

router.get("/token", async (req, res) => {
  try {
    const refreshToken = req.body.token;
    if (refreshToken == null) return res.sendStatus(401);

    const getRefreshToken = UserLoginModal.findOne({ refreshToken: refreshToken });
    if (!getRefreshToken) return res.sendStatus(403);
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
      console.log("user", user);
      if (err) return res.sendStatus(403);
      const accessToken = generateAccessToken({username: user.username, password: user.password, email: user.email});
      res.status(200).json({
        reason: "Access Token created successfully",
        statusCode: 200,
        status: "SUCCESS",
        accessToken,
      });
    });
  } catch (error) {
    console.log(error);
    res.status(400).json(error);
  }
});

module.exports = router;
