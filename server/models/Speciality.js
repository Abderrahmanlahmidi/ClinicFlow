const mongoose = require("mongoose");

const specialitySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
  },
  { collection: "Speciality", timestamps: true }
);

const Speciality = mongoose.model("Speciality", specialitySchema);

module.exports = Speciality;
