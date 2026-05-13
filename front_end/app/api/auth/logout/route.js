import { NextResponse } from "next/server";

/** Đăng xuất: xóa cookie token (middleware đọc từ đây) */
export async function POST() {
  const res = NextResponse.json({ success: true });
  res.cookies.set("token", "", {
    path: "/",
    maxAge: 0,
    expires: new Date(0),
    sameSite: "lax",
  });
  return res;
}
