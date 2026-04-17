const mongoose = require("mongoose");

const StartupSchema = new mongoose.Schema({
  name: String,
  score: Number,
  traction: Number,
  team: Number,
  market: Number,
  product: Number,

  decision: { type: String, default: "UNDECIDED" },

  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Startup", StartupSchema);