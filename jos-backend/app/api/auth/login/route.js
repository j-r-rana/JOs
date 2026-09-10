import bcrypt from "bcryptjs";
import dbConnect from "@/lib/dbConnect";
import { signToken } from "@/lib/auth";
import User from "@/models/User";

export async function POST(req) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return Response.json({ error: "email and password are required" }, { status: 400 });
    }

    await dbConnect();

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return Response.json({ error: "Invalid email or password" }, { status: 401 });
    }

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
      return Response.json({ error: "Invalid email or password" }, { status: 401 });
    }

    const token = signToken({ userId: user._id.toString(), email: user.email });

    return Response.json({ token, user: { id: user._id, name: user.name, email: user.email } });
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}
