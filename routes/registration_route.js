const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const generateHash = require("../utils/generate_hash");
var bcrypt = require("bcryptjs");
const UserLoginModal = require("../src/database/modals/user_auth");
const {
  generateAccessToken,
  generateRefreshToken,
  authenticateAccessToken,
} = require("../src/middleware/auth_token");

require("../src/database/connection");
const nodemailer = require("nodemailer");

const config = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "aman.gv072@gmail.com",
    pass: "btaqvpcjjlpfaljg",
  },
});

router.post("/signup", async (req, res) => {
  try {
    const username = req.body.username;
    const password = req.body.password;
    const email = req.body.email;

    const getUser = await UserLoginModal.findOne({ username: username });
    if (getUser) {
      res.status(400).json({ message: "User already exists", getUser });
      return;
    } else {
      const hashedPassword = await generateHash(password);

      // const userDate = {
      //   username: username,
      //   password: hashedPassword,
      //   email: email,
      //   accessToken: accessToken,
      //   refreshToken: refreshToken,
      // };
      // const user = new UserLoginModal(userDate);
      // const createUser = await user.save();

      const user = {
        username: username,
        password: hashedPassword,
        email: email,
      };

      const accessToken = generateAccessToken(user);
      // const refreshToken = generateRefreshToken(user);

      let mailOptions = {
        from: "aman.gv072@gmail.com",
        to: email,
        subject: "Account Activation Link",
        text:
          `Hi ${username},\n\n` +
          `Please verify your email by clicking the link: \n` +
          `${process.env.SERVER_URL}/api/v1/auth/activate/${accessToken}\n\n`,
      };

      config.sendMail(mailOptions, function (err, result) {
        if (err) {
          res
            .status(500)
            .json({ status_code: 500, message: "Error in sending email" });
        } else {
          console.log("Email sent: " + result.response);
          res.status(200).json({
            status_code: 200,
            message: "Email sent successfully, kindly activate your account",
          });
        }
      });

      // res
      //   .status(201)
      //   .json({ message: "User created successfully", createUser });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
});

router.post("/login", authenticateAccessToken, async (req, res) => {
  try {
    const login_cred = req.body.login_cred;
    const password = req.body.password;

    let getUser = await UserLoginModal.findOne({
      username: login_cred,
    });

    if (!getUser) {
      getUser = await UserLoginModal.findOne({
        email: login_cred,
      });
    }

    if (!getUser) {
      res.status(404).json({ message: "Invalid login credentials", code: 1 });
      return;
    } else {
      passwordCompare = await bcrypt.compare(password, getUser.password);
      if (!passwordCompare) {
        res.status(401).json({ message: "Invalid login credentials", code: 1 });
        return;
      } else {
        res.status(200).json({ message: "User found", code: 0, getUser });
      }
    }
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
});

router.post("/logout", authenticateAccessToken, async (req, res) => {
  try {
    res.clearCookie("jwt");
    res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
});

router.post("/forgot-password", authenticateAccessToken, async (req, res) => {
  try {
    const email = req.body.email;
    const getUser = await UserLoginModal.findOne({ email: email });
    if (!getUser) {
      res.status(404).json({ message: "User not found", code: 1 });
      return;
    } else {
      const accessToken = generateAccessToken({
        username: getUser.username,
        password: getUser.password,
        email: getUser.email,
      });
      let mailOptions = {
        from: "aman.gv072@gmail.com",
        to: email,
        subject: "Password Reset Link",
        text:
          `Hi ${getUser.username},\n\n` +
          `Please reset your password by clicking the link: \n` +
          `${process.env.SERVER_URL}/api/v1/auth/reset-password/${accessToken}\n\n`,
      };

      config.sendMail(mailOptions, function (err, result) {
        if (err) {
          res
            .status(500)
            .json({ status_code: 500, message: "Error in sending email" });
        } else {
          console.log("Email sent: " + result.response);
          res.status(200).json({
            status_code: 200,
            message: "Email sent successfully, kindly reset your password",
          });
        }
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
});

module.exports = router;
