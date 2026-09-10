import mongoose from "mongoose";

// Curated "good" / "bad" example prompts shown in the playbook,
// used with Gemini for the AI-Assisted Learning feature.
const PromptSchema = new mongoose.Schema(
  {
    skill: { type: mongoose.Schema.Types.ObjectId, ref: "Skill", required: true },
    type: { type: String, enum: ["good", "bad"], required: true },
    promptText: { type: String, required: true },
    note: { type: String }, // why it's a good/bad example
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.models.Prompt || mongoose.model("Prompt", PromptSchema);
