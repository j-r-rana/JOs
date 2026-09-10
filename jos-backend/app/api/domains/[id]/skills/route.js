import dbConnect from "@/lib/dbConnect";
import Skill from "@/models/Skill";

export async function GET(req, { params }) {
  await dbConnect();
  const skills = await Skill.find({ domain: params.id }).sort({ order: 1 });
  return Response.json({ skills });
}
