const mongoose = require("mongoose");
const validator = require("validator");

const UserLoginSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      unique: true,
      required: true,
      minLength: 3,
      maxLength: 40,
    },
    password: {
      type: String,
      required: true,
      minLength: 3,
    },
    email: {
      type: String,
      required: true,
      unique: [true, "This email id is already in use"],
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Invalid email address");
        }
      },
    },
    accessToken: {
      type: String,
      // required: true,
    },
    refreshToken: {
      type: String,
      // required: true,
    },
  },
  { timestamps: true }
);

const UserLoginModal = new mongoose.model("user_login_creds", UserLoginSchema);

module.exports = UserLoginModal;
