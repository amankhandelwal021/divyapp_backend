const mongoose = require("mongoose");
const validator = require("validator");

const disablesQuestionSchema = new mongoose.Schema(
  {
    question: {
      type: String,
      required: true,
    },
    option: {
        type: [
          {
            type: String,
            required: true,
          },
        ],
      },
  },
  { timestamps: true }
);

const disablesQuestionModal = new mongoose.model(
  "questions_for_disables",
  disablesQuestionSchema
);

module.exports = disablesQuestionModal;
