import { NextResponse } from "next/server";

export const GET = async () => {
  return NextResponse.json({
    ok: true,
    fullName: "Borwonpak Duangjun",
    studentId: "650610779",
  });
};
