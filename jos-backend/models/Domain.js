import mongoose from "mongoose";

// e.g. Web Development, Data Science, AI, ML, Cyber Security, UI/UX
const DomainSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String },
    icon: { type: String },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.models.Domain || mongoose.model("Domain", DomainSchema);
