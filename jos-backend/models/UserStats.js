import mongoose from "mongoose";

// One row per user: coins, streaks, activity — drives the
// Gamification & Progress feature.
const UserStatsSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    coins: { type: Number, default: 0 },
    streakCount: { type: Number, default: 0 },
    lastActiveDate: { type: Date },
  },
  { timestamps: true }
);

export default mongoose.models.UserStats || mongoose.model("UserStats", UserStatsSchema);
