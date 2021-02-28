const express = require("express");
const router = express.Router();
const Vehicle = require("../../models/Vehicle");

router
  .route("/:id?")
  .all()
  .post((req, res) => {
    const { name, desc, telemItems, id } = req.body;
    Vehicle.findOne({ name: name }).then((item) => {
      if (!item) {
        const newItem = new Vehicle({
          name: name,
          description: desc,
          id: id,
          telem_items: telemItems,
        });
        newItem
          .save()
          .then((item) => {
            res.status(200).json({
              data: item,
              success: true,
              msg: "Vehicle created successfully",
            });
          })
          .catch((err) => {
            console.log("Database failed to save Vehicle.");
            console.log(err);
            res.status(400).json({
              data: null,
              success: false,
              msg: "Database failed to save Vehicle.",
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
      Vehicle.findById(req.params.id)
        .sort({ name: 1 })
        .then((item) => res.json(item))
        .catch((err) => res.status(404).json({ success: false }));
    } else {
      Vehicle.find()
        .sort({ name: 1 })
        .then((item) => res.json(item))
        .catch((err) => res.status(404).json({ success: false }));
    }
  })
  .delete((req, res) => {
    if (req.params.id) {
      Vehicle.findByIdAndDelete(req.params.id)
        .then((item) => res.json(item))
        .catch((err) => res.status(404).json({ success: false }));
    }
  });

module.exports = router;
