import mongoose from "mongoose";

// One row per (user, achievement) once earned.
const UserAchievementSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    achievement: { type: mongoose.Schema.Types.ObjectId, ref: "Achievement", required: true },
    earnedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

UserAchievementSchema.index({ user: 1, achievement: 1 }, { unique: true });

export default mongoose.models.UserAchievement || mongoose.model("UserAchievement", UserAchievementSchema);
