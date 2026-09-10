import mongoose from "mongoose";

// Append-only ledger of coin earning events, so UserStats.coins
// is always reconstructable/auditable.
const CoinTransactionSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    amount: { type: Number, required: true },
    reason: { type: String, required: true }, // e.g. "reward_quiz:<quizId>"
  },
  { timestamps: true }
);

export default mongoose.models.CoinTransaction || mongoose.model("CoinTransaction", CoinTransactionSchema);
