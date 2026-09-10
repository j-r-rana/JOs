import mongoose from "mongoose";

const CodeChallengeSchema = new mongoose.Schema(
  {
    skill: { type: mongoose.Schema.Types.ObjectId, ref: "Skill", required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    language: { type: String, required: true },
    starterCode: { type: String, default: "" },
  },
  { timestamps: true }
);

export default mongoose.models.CodeChallenge || mongoose.model("CodeChallenge", CodeChallengeSchema);
