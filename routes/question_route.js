const express = require("express");
const disablesQuestionModal = require("../src/database/modals/question_for_disables");
const locationQuestionModal = require("../src/database/modals/question_for_locations")
const router = express.Router();

router.get("/question/location", async (req, res) => {
    try {
      let locationQuestion = await locationQuestionModal.find({});
      res.status(200).json(locationQuestion);
    } catch (error) {
      console.log(error);
      res.status(500).json(error);
    }
  });

  router.get("/question/disables", async (req, res) => {
    try {
      let diablesQuestion = await disablesQuestionModal.find({});
      res.status(200).json(diablesQuestion);
    } catch (error) {
      console.log(error);
      res.status(500).json(error);
    }
  });

  module.exports = router;

  