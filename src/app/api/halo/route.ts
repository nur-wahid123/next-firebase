import { getUser, getUserIdByEmail } from "@/lib/controller";
import { db } from "@/lib/dbConfig";
import {
  collection,
  doc,
  getDocs,
  limit,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  const userId = await getUserIdByEmail("fajar@email.com");
  updateDoc(doc(db, "users", userId), {
    rememberToken: "hal0o",
  });
  return NextResponse.json({ id: userId });
}
export async function POST(req: NextRequest) {
  const body = await req.json();
  const data = await getUser();
  return NextResponse.json(data[0]);
}
