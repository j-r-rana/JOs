import dbConnect from "@/lib/dbConnect";
import { requireUser } from "@/lib/auth";
import Progress from "@/models/Progress";

export async function GET(req) {
  try {
    const user = requireUser(req);
    await dbConnect();
    const progress = await Progress.find({ user: user.userId }).populate("skill");
    return Response.json({ progress });
  } catch (err) {
    return Response.json({ error: err.message }, { status: err.status || 500 });
  }
}
