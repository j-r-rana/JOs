import dbConnect from "@/lib/dbConnect";
import Domain from "@/models/Domain";

export async function GET() {
  await dbConnect();
  const domains = await Domain.find().sort({ order: 1 });
  return Response.json({ domains });
}

// Faculty/admin only in a real deployment — left open here for seeding
// convenience; add a role check via requireUser() before shipping.
export async function POST(req) {
  await dbConnect();
  const body = await req.json();
  const domain = await Domain.create(body);
  return Response.json({ domain }, { status: 201 });
}
