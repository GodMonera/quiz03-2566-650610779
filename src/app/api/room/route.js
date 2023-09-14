import { DB, readDB, writeDB } from "@/app/libs/DB";
import { checkToken } from "@/app/libs/checkToken";
import { nanoid } from "nanoid";
import { NextResponse } from "next/server";

export const GET = async () => {
  readDB();
  let roomNum = 0;
  for (const i of DB.rooms) roomNum++;

  return NextResponse.json({
    ok: true,
    rooms: DB.rooms,
    totalRooms: roomNum,
  });
};

export const POST = async (request) => {
  const body = await request.json();
  const { roomName } = body;

  const payload = checkToken();
  if (!payload)
    return NextResponse.json(
      {
        ok: false,
        message: "Invalid token",
      },
      { status: 401 }
    );

  readDB();

  const foundRoom = DB.rooms.find((x) => x.roomName === roomName);
  if (foundRoom)
    return NextResponse.json(
      {
        ok: false,
        message: `Room ${roomName} already exists`,
      },
      { status: 400 }
    );

  const roomId = nanoid();
  DB.rooms.push({ roomId, roomName });

  //call writeDB after modifying Database

  writeDB();

  return NextResponse.json({
    ok: true,
    roomId,
    message: `Room ${roomName} has been created`,
  });
};
