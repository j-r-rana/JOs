import mongoose from "mongoose";

const QuestionSchema = new mongoose.Schema(
  {
    questionText: { type: String, required: true },
    options: { type: [String], required: true },
    correctIndex: { type: Number, required: true },
  },
  { _id: false }
);

// "practice" quizzes are ungraded/no reward; "reward" quizzes are the
// 7-question quiz that pays out coins per slide 7.
const QuizSchema = new mongoose.Schema(
  {
    skill: { type: mongoose.Schema.Types.ObjectId, ref: "Skill", required: true },
    type: { type: String, enum: ["practice", "reward"], required: true },
    questions: { type: [QuestionSchema], required: true },
    coinReward: { type: Number, default: 0 }, // only used when type === "reward"
  },
  { timestamps: true }
);

export default mongoose.models.Quiz || mongoose.model("Quiz", QuizSchema);
