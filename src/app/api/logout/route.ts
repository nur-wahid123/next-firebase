import { NextResponse } from "next/server";

export function POST(req: NextResponse) {
  const resp = NextResponse.json("Logout Successfull");
  resp.cookies.delete("token");
  return resp;
}
