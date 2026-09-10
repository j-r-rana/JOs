import dbConnect from "@/lib/dbConnect";
import { requireUser } from "@/lib/auth";
import User from "@/models/User";
import UserStats from "@/models/UserStats";

export async function GET(req) {
  try {
    const authUser = requireUser(req);
    await dbConnect();

    const [user, stats] = await Promise.all([
      User.findById(authUser.userId).select("-passwordHash"),
      UserStats.findOne({ user: authUser.userId }),
    ]);

    if (!user) return Response.json({ error: "User not found" }, { status: 404 });

    return Response.json({ user, stats: stats || { coins: 0, streakCount: 0 } });
  } catch (err) {
    return Response.json({ error: err.message }, { status: err.status || 500 });
  }
}
