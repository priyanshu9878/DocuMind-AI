import mongoose from "mongoose";
import User from "./User.js";

const fileSchema = new mongoose.Schema({
   userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  fileName: {
    type: String,
    required: true,
  },

  filePath: {
    type: String,
    required: true,
  },

  uploadDate: {
    type: Date,
    default: Date.now,
  },

  status: {
    type: String,
    enum: ["processing", "completed", "failed"],
    default: "processing",
  }
});

export default mongoose.model("File", fileSchema);