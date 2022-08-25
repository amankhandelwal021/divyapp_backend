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
const fs = require("fs");
const locationModal = require("../src/database/modals/location");
const savedLocationModal = require("../src/database/modals/saved_location");

require("../src/database/connection");

router.post("/migrate", async (req, res) => {
  try {
    let data = JSON.parse(fs.readFileSync("complete_data_array.json"));
    let data_array = [];
    data.forEach((item, index) => {
      let name = item.title;
      let category = item.rating_category;
      let address = item.address;
      let website = item.website;
      let phone_number = item.phone || "";
      let images = item.photos.split(",");
      let longitude = item.longitude;
      let latitude = item.latitude;
      let isAccessible = "";
      let hasLift = "";
      let hasElevator = "";
      let hasWheelChairEntrance = "";
      let hasWheelChairParking = "";
      let hasAccessibleCounter = "";
      let hasBrailleSupportLift = "";

      let compiled_data_array = {
        name,
        category,
        address,
        website,
        phone_number,
        images,
        longitude,
        latitude,
        isAccessible,
        hasLift,
        hasElevator,
        hasWheelChairEntrance,
        hasWheelChairParking,
        hasAccessibleCounter,
        hasBrailleSupportLift,
      };

      data_array.push(compiled_data_array);
    });
    collectData(data_array);
    res.status(200).json(data_array);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
});

router.post("/location/create", async (req, res) => {
  const data_to_be_save = req.body;
  try {
    const location = new savedLocationModal(data_to_be_save);
    const createLocation = await location.save();
    res
      .status(201)
      .json({ message: "Location added successfully", createLocation });
    return;
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
});

router.get("/location", async (req, res) => {
  let lat = req.body.latitude;
  let long = req.body.longitude;

  lat = parseFloat(lat);
  long = parseFloat(long);

  try {
    let nativeLocations = await locationModal.find({
      latitude: { $gte: lat - 0.9, $lte: lat + 0.9 },
      longitude: { $gte: long - 0.9, $lte: long + 0.9 },
    });
    let customLocations = await savedLocationModal.find({
      latitude: { $gte: lat - 0.9, $lte: lat + 0.9 },
      longitude: { $gte: long - 0.9, $lte: long + 0.9 },
    });

    let locations = nativeLocations.concat(customLocations);

    res.status(200).json(locations);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
});

router.post("/location/update", async (req, res) => {
  let lat = req.body.latitude;
  let long = req.body.longitude;

  const data_to_be_update = req.body;
  try {
    let location = await locationModal.findOne({
      latitude: lat,
      longitude: long,
    });
    if (location) {
      let updatedLocations = await locationModal.findByIdAndUpdate(
        location._id,
        data_to_be_update,
        { new: true }
      );
      res.status(200).json(updatedLocations);
    } else {
      res.status(404).json({
        message: "Location not found",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
});

router.post("/location/delete", async (req, res) => {
  let lat = req.body.latitude;
  let long = req.body.longitude;

  try {
    let location = await locationModal.findOne({
      latitude: lat,
      longitude: long,
    });
    if (location && location?.createdBy != "native") {
      let deleteLocations = await locationModal.findByIdAndDelete(
        location._id
      );
      res.status(200).json(deleteLocations);
    } else {
      res.status(404).json({
        message: "Location not found",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
});

module.exports = router;
