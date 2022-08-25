const mongoose = require("mongoose");
const validator = require("validator");

const locationQuestionSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    question: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const locationQuestionModal = new mongoose.model(
  "questions_for_locations",
  locationQuestionSchema
);

module.exports = locationQuestionModal;
