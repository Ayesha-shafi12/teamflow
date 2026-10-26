import mongoose from "mongoose";
import { STATUS_VALUES, PRIORITY_VALUES } from "@/lib/task-options";

const taskSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 200 },
    description: { type: String, trim: true, maxlength: 2000, default: "" },
    status: { type: String, enum: STATUS_VALUES, default: "todo" },
    priority: { type: String, enum: PRIORITY_VALUES, default: "medium" },
    dueDate: { type: Date, default: null },
    assignee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },
    workspace: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Workspace",
      required: true,
      index: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true },
);

taskSchema.index({ project: 1, status: 1 });

export default mongoose.models.Task || mongoose.model("Task", taskSchema);
