import mongoose from "mongoose";

const chatSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  fileId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "File",
    required: true,
  },

  messages: [
    {
      role: {
        type: String,
        enum: ["user", "assistant"],
      },

      content: String,

      timestamp: {
        type: Date,
        default: Date.now,
      },
    },
  ],
});

export default mongoose.model("Chat", chatSchema);