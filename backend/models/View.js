const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const ViewSchema = new Schema({
  name: {
    type: String,
    unique: true,
    require: true,
  },
  vehicle: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "vehicle",
  },
  data: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "telemItem",
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("View", ViewSchema);
