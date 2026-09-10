import mongoose from "mongoose";

// One row per (user, skill): where the student is on that skill's
// Zero -> Skill sequence.
const ProgressSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    skill: { type: mongoose.Schema.Types.ObjectId, ref: "Skill", required: true },
    status: {
      type: String,
      enum: ["not_started", "in_progress", "completed"],
      default: "not_started",
    },
    playbookRead: { type: Boolean, default: false },
    codePracticeDone: { type: Boolean, default: false },
    practiceQuizPassed: { type: Boolean, default: false },
    rewardQuizPassed: { type: Boolean, default: false },
    completedAt: { type: Date },
  },
  { timestamps: true }
);

ProgressSchema.index({ user: 1, skill: 1 }, { unique: true });

export default mongoose.models.Progress || mongoose.model("Progress", ProgressSchema);
