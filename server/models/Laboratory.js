import mongoose from "mongoose";

const laboratorySchema = new mongoose.Schema(
  {
    reportFileUrl: {
      type: String,
      required: true,
    },
    reportType: {
      type: String,
      required: true,
    },
    resultSummary: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "in progress", "completed", "cancelled"],
      required: true,
    },
    consultationsId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Consultation",
      required: true,
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

export default Laboratory;
