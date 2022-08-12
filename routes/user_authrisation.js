const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const generateHash = require("../utils/generate_hash");
const UserLoginModal = require("../src/database/modals/user_auth");
const {
  generateAccessToken,
  generateRefreshToken,
} = require("../src/middleware/auth_token");

require("../src/database/connection");

router.get("/auth/activate/:token", async (req, res) => {
  try {
    const token = req.params.token;
    if (token == null) {
      return {
        isValid: false,
        message: "No token provided",
      };
    }
    jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET,
      async (err, verifiedUser) => {
        if (err) {
          return res.status(403).json({
            message:
              "Invalid token provided, please try again with a valid token",
          });
        }

        if (verifiedUser) {
          const { username, password, email } = verifiedUser;
          const already_present_user = await UserLoginModal.findOne({
            username: username,
            email: email,
          });
          if (already_present_user) {
            return res
              .status(400)
              .json({ message: "User already exists", already_present_user });
          }

          const user = {
            username: username,
            password: password,
            email: email,
          };

          const accessToken = generateAccessToken(user);
          const refreshToken = generateRefreshToken(user);

          const newUser = new UserLoginModal({
            ...user,
            accessToken: accessToken,
            refreshToken: refreshToken,
          });
          const createUser = await newUser.save();
          if (createUser) {
            res.cookie("jwt", accessToken, {
              httpOnly: true,
              maxAge: 1000 * 60 * 60 * 24 * 7,
              // sameSite: "strict",
              // secure: true,
            });
            res
              .status(201)
              .json({ message: "User created successfully", createUser });
          }
        }
      }
    );
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
});

router.get("/auth/reset-password/:token", async (req, res) => {
  try {
    const token = req.params.token;
    if (token == null) {
      return {
        isValid: false,
        message: "No token provided",
      };
    }
    jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET,
      async (err, verifiedUser) => {
        if (err) {
          return res.status(403).json({
            message:
              "Invalid token provided, please try again with a valid token",
          });
        }

        if (verifiedUser) {
          const { username, password, email } = verifiedUser;
          const already_present_user = await UserLoginModal.findOne({
            username: username,
            email: email,
          });
          if (!already_present_user) {
            return res.status(400).json({ message: "User not found" });
          }

          const newPassword = req.body.password;
          const hashedPassword = await generateHash(newPassword);
          const updateUserPassword = await UserLoginModal.findByIdAndUpdate(
            already_present_user._id,
            { password: hashedPassword },
            { new: true }
          );
          if (updateUserPassword) {
            res.status(201).json({
              message: "Password updated successfully",
              updateUserPassword,
            });
          }
        }
      }
    );
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
});

module.exports = router;
