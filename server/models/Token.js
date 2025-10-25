import mongoose from "mongoose";

const tokenSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    refreshToken: { type: String, required: true },
  },
  { collection: "Token", timestamps: true }
);

const Token = mongoose.model("Token", tokenSchema);

export default Token;
