import dbConnect from "@/lib/dbConnect";
import { requireUser } from "@/lib/auth";
import Quiz from "@/models/Quiz";
import Progress from "@/models/Progress";
import UserStats from "@/models/UserStats";
import CoinTransaction from "@/models/CoinTransaction";

export async function POST(req) {
  try {
    const user = requireUser(req);
    const { quizId, answers } = await req.json(); // answers: number[] (selected option index per question)

    await dbConnect();

    const quiz = await Quiz.findById(quizId);
    if (!quiz) return Response.json({ error: "Quiz not found" }, { status: 404 });

    let correctCount = 0;
    quiz.questions.forEach((q, i) => {
      if (answers[i] === q.correctIndex) correctCount += 1;
    });
    const scorePercent = Math.round((correctCount / quiz.questions.length) * 100);
    const passed = scorePercent >= 70; // pass threshold; tune as needed

    const progress = await Progress.findOneAndUpdate(
      { user: user.userId, skill: quiz.skill },
      {
        $set:
          quiz.type === "practice"
            ? { practiceQuizPassed: passed, status: "in_progress" }
            : { rewardQuizPassed: passed },
      },
      { upsert: true, new: true }
    );

    let coinsAwarded = 0;
    if (quiz.type === "reward" && passed) {
      coinsAwarded = quiz.coinReward || 0;
      await CoinTransaction.create({
        user: user.userId,
        amount: coinsAwarded,
        reason: `reward_quiz:${quiz._id}`,
      });
      await UserStats.findOneAndUpdate(
        { user: user.userId },
        { $inc: { coins: coinsAwarded } },
        { upsert: true }
      );
    }

    return Response.json({
      correctCount,
      total: quiz.questions.length,
      scorePercent,
      passed,
      coinsAwarded,
      progress,
    });
  } catch (err) {
    return Response.json({ error: err.message }, { status: err.status || 500 });
  }
}
