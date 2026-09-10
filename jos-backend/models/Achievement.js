import mongoose from "mongoose";

// Static definitions of badges/achievements (e.g. "First Skill Completed",
// "7-Day Streak"). Criteria is evaluated in application code, not stored
// as executable logic here.
const AchievementSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    icon: { type: String },
    criteriaKey: { type: String, required: true }, // e.g. "streak_7", "skills_completed_5"
  },
  { timestamps: true }
);

export default mongoose.models.Achievement || mongoose.model("Achievement", AchievementSchema);
