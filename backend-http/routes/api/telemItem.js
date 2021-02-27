const express = require("express");
const router = express.Router();
const TelemItem = require("../../models/TelemItem");

router
  .route("/:id?/:decode?")
  .all()
  .post((req, res) => {
    const { name, desc, values } = req.body;
    TelemItem.findOne({ name: name }).then((item) => {
      if (!item) {
        const newItem = new TelemItem({
          name: name,
          description: desc,
          values: values,
        });
        newItem
          .save()
          .then((item) => {
            res.status(200).json({
              data: item,
              success: true,
              msg: "Telemetry item created successfully",
            });
          })
          .catch((err) => {
            console.log("Database failed to save telemetry item.");
            console.log(err);
            res.status(400).json({
              data: null,
              success: false,
              msg: "Database failed to save telemetry item.",
            });
          });
      } else {
        res.status(400).json({
          data: null,
          success: true,
          msg: "Failed to add telemtry item, item already exists.",
        });
      }
    });
  })
  .get((req, res) => {
    if (req.params.id) {
      TelemItem.findById(req.params.id)
        .sort({ name: 1 })
        .then((item) => res.json(item))
        .catch((err) => res.status(404).json({ success: false }));
    } else if (req.params.decode) {
      console.log(res.params.decode);
    } else {
      TelemItem.find()
        .sort({ name: 1 })
        .then((item) => {
          res.json(item);
        })
        .catch((err) => res.status(404).json({ success: false }));
    }
  })
  .delete((req, res) => {
    if (req.params.id) {
      TelemItem.findByIdAndDelete(req.params.id)
        .then((item) => res.json(item))
        .catch((err) => res.status(404).json({ success: false }));
    }
  });
module.exports = router;
