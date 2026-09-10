import dbConnect from "@/lib/dbConnect";
import { requireUser } from "@/lib/auth";
import Skill from "@/models/Skill";
import Prompt from "@/models/Prompt";
import CodeChallenge from "@/models/CodeChallenge";
import Progress from "@/models/Progress";

export async function GET(req, { params }) {
  try {
    const user = requireUser(req); // learning features require login (slide 8 access rule)
    await dbConnect();

    const skill = await Skill.findById(params.id);
    if (!skill) return Response.json({ error: "Skill not found" }, { status: 404 });

    const [prompts, codeChallenge, progress] = await Promise.all([
      Prompt.find({ skill: skill._id }).sort({ order: 1 }),
      skill.hasCodePractice ? CodeChallenge.findOne({ skill: skill._id }) : null,
      Progress.findOne({ user: user.userId, skill: skill._id }),
    ]);

    return Response.json({
      skill,
      prompts,
      codeChallenge,
      progress: progress || { status: "not_started" },
    });
  } catch (err) {
    return Response.json({ error: err.message }, { status: err.status || 500 });
  }
}
