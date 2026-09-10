import dbConnect from "@/lib/dbConnect";
import { requireUser } from "@/lib/auth";
import Achievement from "@/models/Achievement";
import UserAchievement from "@/models/UserAchievement";

export async function GET(req) {
  try {
    const user = requireUser(req);
    await dbConnect();

    const [all, earned] = await Promise.all([
      Achievement.find(),
      UserAchievement.find({ user: user.userId }),
    ]);

    const earnedIds = new Set(earned.map((e) => e.achievement.toString()));
    const achievements = all.map((a) => ({
      ...a.toObject(),
      earned: earnedIds.has(a._id.toString()),
    }));

    return Response.json({ achievements });
  } catch (err) {
    return Response.json({ error: err.message }, { status: err.status || 500 });
  }
}
