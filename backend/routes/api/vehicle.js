const express = require("express");
const { rawListeners } = require("../../models/Vehicle");
const router = express.Router();
const Vehicle = require("../../models/Vehicle");
const TelemItem = require("../../models/TelemItem");
router
  .route("/:id?/:decode?")
  .all()
  .post((req, res) => {
    const { name, description, telem_items, id } = req.body;
    Vehicle.findOne({ id: id }).then((item) => {
      if (!item) {
        const newItem = new Vehicle({
          id: id,
          name: name,
          description: description,
          telem_items: telem_items,
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
            console.log("Database failed to save vehicle.");
            res.status(400).json({
              data: null,
              success: false,
              msg: "Database failed to save vehicle, name must be unique.",
            });
          });
      } else {
        res.status(400).json({
          data: null,
          success: true,
          msg: "Failed to add vehicle, id must be unique.",
        });
      }
    });
  })
  .get((req, res) => {
    if (req.params.id && req.params.decode) {
      if (req.query.items) {
        Vehicle.findOne({ id: req.params.decode }).then((item) => {
          let telemItems = [];
          for (let val in item.telem_items) {
            telemItems.push(item.telem_items[val].deviceKey);
          }
          TelemItem.find({ id: { $in: telemItems } }).then((items) => {
            // match The name with the device
            for (const device in items) {
              for (const instance in item.telem_items) {
                if (
                  parseInt(items[device].id) ===
                  parseInt(item.telem_items[instance].deviceKey)
                ) {
                  item.telem_items[instance].values = items[device].values;
                }
              }
            }
            res
              .status(200)
              .json({ success: true, msg: "", data: item.telem_items });
          });
        });
      } else {
        Vehicle.findOne({ id: req.params.decode }).then((item) => {
          res.status(200).json(item);
        });
      }
    } else if (req.params.id) {
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
  .put((req, res) => {
    const { id } = req.body;
    Vehicle.findOneAndUpdate({ id: id }, req.body, {
      new: true,
      useFindAndModify: false,
    }).then((item) => {
      res.status(200).json({
        data: item,
        success: true,
        msg: "Vehicle updated successfully",
      });
    });
  })
  .delete((req, res) => {
    if (req.params.id) {
      Vehicle.findByIdAndDelete(req.params.id)
        .then((item) => res.json(item))
        .catch((err) => res.status(404).json({ success: false }));
    }
  });

module.exports = router;
