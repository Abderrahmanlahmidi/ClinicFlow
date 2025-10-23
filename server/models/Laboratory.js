const mongoose = require("mongoose");

const laboratorySchema = new mongoose.Schema(
  {
    reportFileUrl: {
      type: String,
      require: true,
    },
    reportType: {
      type: String,
      require: true,
    },
    resultSummary: {
      type: String,
      require: true,
    },
    status: {
      type: String,
      enum: ["pending", "in progress", "completed", "cancelled"],
      require: true,
    },
    consultationsId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Consultation",
      require: true,
    },
    tests: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Test",
      },
    ],
  },
  { collection: "Laboratory", timestamps: true }
);

const Laboratory = mongoose.model("Laboratory", laboratorySchema);

module.exports = Laboratory;
