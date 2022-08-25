const express = require("express");
const dotenv = require("dotenv");
dotenv.config();    

var MongoClient = require("mongodb").MongoClient;
var url = process.env.MONGO;

const collectData = async (data) => {
    try {
      MongoClient.connect(url, function (err, db) {
        if (err) throw err;
        var dbo = db.db("divyapp_database");
        dbo
          .collection("location_datas")
          .deleteMany({})
          .then(() => {
            dbo
              .collection("location_datas")
              .insertMany(data, function (err, res) {
                if (err) throw err;
                console.log(
                  `${data.length} documents inserted successfully)}`
                );
                db.close();
              });
          });
      });
  
      config.sendMail(mailOptions, function (err, result) {
        if (err) {
          console.log(err);
        } else {
          console.log("Email sent: " + result.response);
        }
      });
    } catch (error) {
      console.log(error);
    }
  };

  exports.collectData = collectData;