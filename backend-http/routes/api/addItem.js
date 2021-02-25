const express = require("express");
const router = express.Router();
const TelemItem = require("../../models/TelemItem");

router
  .route("/:id?")
  .all()
  .post((req, res) => {
    const { name, desc, values } = req.body;
    User.find({ name: name }).then((item) => {
      if (!item) {
        const newItem = new TelemItem({
          name: name,
          description: desc,
          values: values,
        });
        newItem
          .save()
          .then((item) =>
            res.json({
              data: item,
              success: true,
              msg: "Telemetry item created successfully",
            })
          )
          .catch((err) =>
            res.status(400).json({
              data: null,
              success: false,
              msg: "Database failed to save telemetry item.",
            })
          );
      } else {
        res.status(400).json({
          data: null,
          success: true,
          msg: "Failed to add telemtry item, item already exists.",
        });
      }
    });
    res.json({
      data: "test",
      success: true,
      msg: "Succesfully added telemetry item.",
    });
  })
  .get((req, res) => {})
  .delete((req, res) => {});
