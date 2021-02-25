const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const TelemSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
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

module.exports = Role = mongoose.model("telemItem", TelemSchema);
