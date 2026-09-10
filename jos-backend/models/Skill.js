import mongoose from "mongoose";

// One "Zero -> Skill" learning unit inside a domain.
const SkillSchema = new mongoose.Schema(
  {
    domain: { type: mongoose.Schema.Types.ObjectId, ref: "Domain", required: true },
    name: { type: String, required: true },
    slug: { type: String, required: true },
    description: { type: String },
    order: { type: Number, default: 0 },
    // Playbook content stored as a file (e.g. PDF) elsewhere; only the URL lives here.
    playbookUrl: { type: String },
    hasCodePractice: { type: Boolean, default: false },
    language: { type: String }, // e.g. "javascript", "python" — only if hasCodePractice
  },
  { timestamps: true }
);

SkillSchema.index({ domain: 1, slug: 1 }, { unique: true });

export default mongoose.models.Skill || mongoose.model("Skill", SkillSchema);
