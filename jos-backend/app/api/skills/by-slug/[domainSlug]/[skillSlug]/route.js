import dbConnect from "@/lib/dbConnect";
import { requireUser } from "@/lib/auth";
import Domain from "@/models/Domain";
import Skill from "@/models/Skill";
import Prompt from "@/models/Prompt";
import Quiz from "@/models/Quiz";
import CodeChallenge from "@/models/CodeChallenge";
import Progress from "@/models/Progress";

// Lets the frontend resolve a skill by its human-readable domain/skill
// slugs (e.g. "web-development" / "css") instead of hardcoding Mongo
// ObjectIds — the frontend's static content fixtures only know slugs.
export async function GET(req, { params }) {
  try {
    const user = requireUser(req);
    await dbConnect();

    const domain = await Domain.findOne({ slug: params.domainSlug });
    if (!domain) return Response.json({ error: "Domain not found" }, { status: 404 });

    const skill = await Skill.findOne({ domain: domain._id, slug: params.skillSlug });
    if (!skill) return Response.json({ error: "Skill not found" }, { status: 404 });

    const [prompts, quizzes, codeChallenge, progress] = await Promise.all([
      Prompt.find({ skill: skill._id }).sort({ order: 1 }),
      Quiz.find({ skill: skill._id }),
      CodeChallenge.findOne({ skill: skill._id }),
      Progress.findOne({ user: user.userId, skill: skill._id }),
    ]);

    const practiceQuiz = quizzes.find((q) => q.type === "practice") || null;
    const rewardQuiz = quizzes.find((q) => q.type === "reward") || null;

    return Response.json({
      skill,
      prompts,
      practiceQuiz,
      rewardQuiz,
      codeChallenge,
      progress: progress || { status: "not_started" },
    });
  } catch (err) {
    return Response.json({ error: err.message }, { status: err.status || 500 });
  }
}
