const express = require("express");
const router = express.Router();
const View = require("../../models/View");

router
  .route("/:id?")
  .all()
  .post((req, res) => {
    View.findOne({ name: req.body.name }).then((item) => {
      if (!item) {
        const newItem = new View({
          ...req.body,
        });
        newItem
          .save()
          .then((item) => {
            res.status(200).json({
              data: item,
              success: true,
              msg: "View created successfully",
            });
          })
          .catch((err) => {
            console.log("Database failed to save view.");
            console.log(err);
            res.status(400).json({
              data: null,
              success: false,
              msg: "Database failed to save view.",
            });
          });
      } else {
        res.status(400).json({
          data: null,
          success: true,
          msg: "Failed to add view item, item already exists.",
        });
      }
    });
  })
  .get((req, res) => {
    // if the query param is true then search by vehicle id
    if (req.params.id && req.query.vehicle) {
      View.find({ vehicle: req.params.id })
        .sort({ name: 1 })
        .then((items) => {
          res.status(200).json({ success: true, msg: "", data: items });
        });
    } else if (req.params.id) {
      View.findById(req.params.id)
        .sort({ name: 1 })
        .then((item) => res.json(item))
        .catch((err) => res.status(404).json({ success: false }));
    } else {
      View.find()
        .sort({ name: 1 })
        .then((item) => {
          res.json(item);
        })
        .catch((err) => res.status(404).json({ success: false }));
    }
  })
  .put((req, res) => {
    const { _id } = req.body;
    View.findByIdAndUpdate(_id, req.body, {
      new: true,
      useFindAndModify: false,
    }).then((item) => {
      res.status(200).json({
        data: item,
        success: true,
        msg: "View updated successfully",
      });
    });
  })
  .delete((req, res) => {
    if (req.params.id) {
      View.findByIdAndDelete(req.params.id)
        .then((item) => res.json(item))
        .catch((err) => res.status(404).json({ success: false }));
    }
  });
module.exports = router;
