const express = require("express");
require("dotenv").config();
const morgan = require("morgan");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");

const corsOptions = {
  // origin: "https://userregisrationfrontend.herokuapp.com",
  origin: [
    "http://localhost:3000",
  ],
  // credentials: true,
};

const app = express();
const port = process.env.PORT || 5000;

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// parse application/json
app.use(bodyParser.json());

app.use(express.json());
app.use(cookieParser());
app.use(morgan("dev"));
app.use(cors(corsOptions));

const registrationRoute = require("../routes/registration_route");
const generateNewAccessTokenRoute = require("../routes/get_new_access_token");
const userAuthrisationRoute = require("../routes/user_authrisation");
const locationRoute = require("../routes/location_data_route");
const questionRoute = require("../routes/question_route");

app.get("/", (req, res) => {
  res.status(200).json({
    message: "Backend Testing Server Running Successfully",
  });
});

app.use("/api/v1", registrationRoute);
app.use("/api/v1", userAuthrisationRoute);
app.use("/api/v1", locationRoute);
app.use("/api/v1", questionRoute);
app.use("/api/v1/auth", generateNewAccessTokenRoute);

app.listen(port, () => {
  console.log(`The app listening on port ${port}`);
});
