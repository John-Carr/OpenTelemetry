const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const TelemSchema = new Schema({
  id: {
    type: String,
    required: false,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  iso: {
    type: String,
  },
  values: {
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

module.exports = mongoose.model("telemItem", TelemSchema);
