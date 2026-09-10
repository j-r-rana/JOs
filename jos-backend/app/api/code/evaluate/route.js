import dbConnect from "@/lib/dbConnect";
import { requireUser } from "@/lib/auth";
import { askGemini, buildCodeEvalPrompt, parseJsonResponse } from "@/lib/gemini";
import CodeChallenge from "@/models/CodeChallenge";
import Progress from "@/models/Progress";

export async function POST(req) {
  try {
    const user = requireUser(req);
    const { challengeId, code } = await req.json();

    await dbConnect();

    const challenge = await CodeChallenge.findById(challengeId);
    if (!challenge) return Response.json({ error: "Challenge not found" }, { status: 404 });

    const prompt = buildCodeEvalPrompt({
      challengeTitle: challenge.title,
      language: challenge.language,
      code,
    });

    const raw = await askGemini(prompt);
    let evaluation;
    try {
      evaluation = parseJsonResponse(raw);
    } catch {
      // If Gemini didn't return clean JSON, surface the raw text rather than failing silently.
      return Response.json({ error: "Could not parse AI evaluation", raw }, { status: 502 });
    }

    if (evaluation.correct) {
      await Progress.findOneAndUpdate(
        { user: user.userId, skill: challenge.skill },
        { $set: { codePracticeDone: true, status: "in_progress" } },
        { upsert: true }
      );
    }

    return Response.json({ evaluation });
  } catch (err) {
    return Response.json({ error: err.message }, { status: err.status || 500 });
  }
}
