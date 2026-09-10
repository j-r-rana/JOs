import bcrypt from "bcryptjs";
import dbConnect from "@/lib/dbConnect";
import { signToken } from "@/lib/auth";
import User from "@/models/User";
import UserStats from "@/models/UserStats";

export async function POST(req) {
  try {
    const { name, email, password } = await req.json();

    if (!name || !email || !password) {
      return Response.json({ error: "name, email and password are required" }, { status: 400 });
    }

    await dbConnect();

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      return Response.json({ error: "An account with this email already exists" }, { status: 409 });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, passwordHash });

    // Every new student starts with a stats row (0 coins, 0 streak).
    await UserStats.create({ user: user._id });

    const token = signToken({ userId: user._id.toString(), email: user.email });

    return Response.json(
      { token, user: { id: user._id, name: user.name, email: user.email } },
      { status: 201 }
    );
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}
