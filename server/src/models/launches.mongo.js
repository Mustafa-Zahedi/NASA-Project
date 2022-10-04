const mongoose = require("mongoose");

const launchesSchema = new mongoose.Schema({
  flightNumber: { type: Number, required: true },
  mission: { type: String, required: true },
  rocket: { type: String, required: true },
  launchDate: { type: Date, required: true },
  customers: [String],
  target: { type: String, required: true },
  upcoming: { type: Boolean, required: true },
  success: { type: Boolean, required: true, default: true },
});

/* Creating a model called launch with the schema launchesSchema. */
module.exports = mongoose.model("launch", launchesSchema);
