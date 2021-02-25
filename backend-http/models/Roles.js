const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const RoleSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
  permissions: {
    type: [String],
    required: true,
  },
  created_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
});

module.exports = Role = mongoose.model("role", RoleSchema);
