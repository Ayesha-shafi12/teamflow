import { connectDB } from "@/lib/mongodb";

export async function GET() {
  try {
    await connectDB();
    return Response.json({ status: "ok", database: "connected" });
  } catch (error) {
    return Response.json(
      { status: "error", message: error.message },
      { status: 500 },
    );
  }
}
