import mongoose from "mongoose";

export const ACTIVITY_TYPES = [
  "project_created",
  "task_created",
  "task_moved",
  "member_added",
  "member_removed",
];

const activitySchema = new mongoose.Schema(
  {
    workspace: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Workspace",
      required: true,
    },
    actor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    type: {
      type: String,
      enum: ACTIVITY_TYPES,
      required: true,
    },
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      default: null,
    },
    details: {
      projectName: String,
      taskTitle: String,
      fromStatus: String,
      toStatus: String,
      memberName: String,
    },
  },
  { timestamps: true },
);

activitySchema.index({ workspace: 1, createdAt: -1 });

export default mongoose.models.Activity ||
  mongoose.model("Activity", activitySchema);
