const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const VehicleSchema = new Schema({
  id: {
    type: Number,
    requred: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
    unique: true,
  },
  description: {
    type: String,
    required: true,
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
