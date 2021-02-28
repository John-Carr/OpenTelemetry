const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const VehicleSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  id: {
    type: Number,
    requred: true,
    unique: true,
  },
  telem_items: {
    type: Array,
    required: true,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
  created_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
});

module.exports = mongoose.model("vehicle", VehicleSchema);
