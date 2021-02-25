const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const PendingUserSchema = new Schema({
  nameF: {
    type: String,
    required: true,
  },
  nameL: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  phone: {
    type: Number,
    required: true,
  },
  role: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "role",
  },
  authToken: {
    type: String,
    required: true,
  },
  issuedBy: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "user",
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 86400,
  },
});

module.exports = PendingUser = mongoose.model("pendingUser", PendingUserSchema);
