import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    activeWorkspace: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Workspace",
      default: null,
    },
  },
  { timestamps: true },
);

export default mongoose.models.User || mongoose.model("User", userSchema);
