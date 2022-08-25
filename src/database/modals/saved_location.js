const mongoose = require("mongoose");
const validator = require("validator");

const savedLocationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    website: {
      type: String,
      required: true,
    },
    phone_number: {
      type: String,
      required: true,
    },
    images: {
      type: [
        {
          type: String,
          required: true,
        },
      ],
    },
    longitude: {
      type: String,
      required: true,
    },
    latitude: {
      type: String,
      required: true,
    },
    isAccessible: {
      type: String,
      required: true,
    },
    hasLift: {
      type: String,
      required: true,
    },
    hasElevator: {
      type: String,
      required: true,
    },
    hasWheelChairEntrance: {
      type: String,
      required: true,
    },
    hasWheelChairParking: {
      type: String,
      required: true,
    },
    hasAccessibleCounter: {
      type: String,
      required: true,
    },
    hasBrailleSupportLift: {
      type: String,
      required: true,
    },
    createdBy: {
      type: String,
      default: "native"
    }
  },
  { timestamps: true }
);

const savedLocationModal = new mongoose.model("saved_location_datas", savedLocationSchema);

module.exports = savedLocationModal;
