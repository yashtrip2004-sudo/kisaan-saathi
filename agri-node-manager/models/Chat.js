const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    prompt: {
      type: String,
      required: [true, "Question zaroori hai"],
      trim: true,
    },
    answer: {
      type: String,
      required: true,
    },
    language: {
      type: String,
      default: "en",
    },
    tags: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  },
);

// Index for fast lookup by user
chatSchema.index({ user: 1, createdAt: -1 });

module.exports = mongoose.model("Chat", chatSchema);
