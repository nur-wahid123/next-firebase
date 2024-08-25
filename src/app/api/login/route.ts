import {
  collection,
  doc,
  getDocs,
  limit,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { checkEmailExists } from "../register/route";
import { db } from "../../../lib/dbConfig";
import bcrypt from "bcryptjs";
import { getAccessToken, getToken } from "../../../lib/auth";
import { NextResponse } from "next/server";
import { getUserIdByEmail } from "@/lib/controller";

export async function POST(req: Request) {
  const body = await req.json();
  const ressp = Response.json({
    error: true,
    message:
      "The email or password you entered doesn’t match our records. Please try again.",
  });
  if (!(await checkEmailExists(body.email))) {
    return ressp;
  }
  const userRef = collection(db, "users");
  const q = query(userRef, where("email", "==", body.email), limit(1));
  const userSnapshot = getDocs(q);
  const userData = (await userSnapshot).docs[0].data();
  if (!(await bcrypt.compare(body.password, userData.password))) {
    return ressp;
  }
  const encryptedSessionData = getToken({
    name: userData.firstName + " " + userData.lastName,
    email: userData.email,
    roles: userData.roles,
  });
  const userId = await getUserIdByEmail(userData.email);
  updateDoc(doc(db, "users", userId), {
    rememberToken: encryptedSessionData,
  });
  const accessToken = getAccessToken({
    name: userData.firstName + " " + userData.lastName,
    email: userData.email,
    roles: userData.roles,
  });
  const response = NextResponse.json({
    error: false,
    message: "Login Successfull",
  });
  response.cookies.set("token", encryptedSessionData, {
    httpOnly: true, // Accessible only by the server
    secure: process.env.NODE_ENV === "production", // Only sent over HTTPS in production
    maxAge: 60 * 60 * 2, // 2 hours in seconds
    path: "/",
  });
  return response;
}
