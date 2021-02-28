const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const TelemDataSchema = new Schema({
  vehicle: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "vehicle",
  },
  telem_item: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "telemItem",
  },
  values: {
    type: Object,
    required: true,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("telemData", TelemDataSchema);
