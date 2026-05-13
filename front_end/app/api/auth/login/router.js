import { NextResponse } from "next/server";

export async function POST(req) {
  const { role } = await req.json();

  const token = Buffer.from(
    JSON.stringify({ role })
  ).toString("base64");

  const res = NextResponse.json({ success: true });
  res.cookies.set("token", token, { httpOnly: true });

  return res;
}
