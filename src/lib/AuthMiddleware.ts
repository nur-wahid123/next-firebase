import { jwtVerify } from "jose";
import { NextRequest, NextResponse } from "next/server";

export async function authMiddleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  const secretKey = process.env.SECRET_KEY as string;

  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // Verify the signature
  const isValid = await checkTokenIsValid(token, secretKey);

  if (!isValid) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
}

// Helper function to decode Base64URL into a Uint8Array

export async function checkTokenIsValid(token: string, secret: string) {
  const secretKey = new TextEncoder().encode(secret);
  try {
    const { payload } = await jwtVerify(token, secretKey);
    console.log("Decoded JWT payload from jose:", payload);

    // Proceed with the request if the token is valid
    return true;
  } catch (error) {
    // Handle the error (e.g., invalid token)
    return false;
  }
}

export async function checkAccessTokenIsValid(token: string) {
  const secretKey = new TextEncoder().encode(process.env.ACCESS_TOKEN_SECRET);
  try {
    const { payload } = await jwtVerify(token, secretKey);
    console.log("Decoded JWT payload from jose:", payload);

    // Proceed with the request if the token is valid
    return true;
  } catch (error) {
    // Handle the error (e.g., invalid token)
    return false;
  }
}
