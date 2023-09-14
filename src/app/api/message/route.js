import { DB, readDB, writeDB } from "@/app/libs/DB";
import { checkToken } from "@/app/libs/checkToken";
import { nanoid } from "nanoid";
import { NextResponse } from "next/server";

export const GET = async (request) => {
  const roomId = request.nextUrl.searchParams.get("roomId");
  readDB();
  console.log(roomId);

  const foundRoom = DB.rooms.find((x) => x.roomId === roomId);
  if (!foundRoom)
    return NextResponse.json(
      {
        ok: false,
        message: `Room is not found`,
      },
      { status: 404 }
    );

  let filtered = DB.messages;
  if (roomId !== null) {
    filtered = filtered.filter((x) => x.roomId === roomId);
  }

  return NextResponse.json({
    ok: true,
    filtered,
  });
};

export const POST = async (request) => {
  const body = await request.json();
  const { roomId, messageText } = body;
  readDB();

  const foundRoom = DB.rooms.find((x) => x.roomId === roomId);
  if (!foundRoom)
    return NextResponse.json(
      {
        ok: false,
        message: `Room is not found`,
      },
      { status: 404 }
    );

  const messageId = nanoid();

  DB.messages.push({ roomId, messageId, messageText });

  writeDB();

  return NextResponse.json({
    ok: true,
    messageId,
    message: "Message has been sent",
  });
};

export const DELETE = async (request) => {
  const body = await request.json();
  const { messageId } = body;
  const payload = checkToken();

  let role = null;
  role = payload.role;
  if (role != "SUPER_ADMIN")
    return NextResponse.json(
      {
        ok: false,
        message: "Invalid token",
      },
      { status: 401 }
    );

  readDB();

  const foundMes = DB.messages.find((x) => x.messageId === messageId);
  if (!foundMes)
    return NextResponse.json(
      {
        ok: false,
        message: "Message is not found",
      },
      { status: 404 }
    );

  DB.messages = DB.messages.filter((x) => x.messageId !== messageId);

  writeDB();

  return NextResponse.json({
    ok: true,
    message: "Message has been deleted",
  });
};
